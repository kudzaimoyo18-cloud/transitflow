"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth";
import type { UserRole } from "@/generated/prisma/client";

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["FLEET_OWNER", "DRIVER", "COMMISSION_AGENT", "CUSTOMER"]),
  organizationName: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function signup(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    role: formData.get("role") as string,
    organizationName: formData.get("organizationName") as string,
  };

  const parsed = SignupSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: "An account with this email already exists" };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  let organizationId: string | undefined;

  if (
    parsed.data.role === "FLEET_OWNER" &&
    parsed.data.organizationName
  ) {
    const slug = parsed.data.organizationName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const org = await prisma.organization.create({
      data: {
        name: parsed.data.organizationName,
        slug: `${slug}-${Date.now().toString(36)}`,
      },
    });
    organizationId = org.id;
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role as UserRole,
      organizationId,
    },
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function login(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = LoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    return { error: "Invalid email or password" };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password" };
  }

  if (!user.isActive) {
    return { error: "Account is deactivated. Contact support." };
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}