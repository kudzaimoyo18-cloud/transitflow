"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export function InviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined" ? window.location.origin + "/join/" + code : "/join/" + code;
  function copy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <code className="px-3 py-2 rounded-lg bg-surface border border-border font-mono text-lg tracking-widest flex-1">{code}</code>
        <button onClick={() => copy(code)} className="p-2 rounded-lg border border-border hover:bg-surface">{copied ? <Check className="w-4 h-4 text-signal" /> : <Copy className="w-4 h-4" />}</button>
      </div>
      <button onClick={() => copy(link)} className="text-sm text-primary hover:underline">Copy invite link</button>
    </div>
  );
}
