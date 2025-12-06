"use client";

import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[hsl(var(--text-dark-muted))] hover:text-[hsl(var(--rose))] hover:bg-[hsl(var(--rose)_/_0.1)] transition-colors"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-xs font-medium">退出</span>
    </button>
  );
}
