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
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[hsl(var(--text-muted))] hover:text-rose-400 hover:bg-rose-400/10 border border-transparent hover:border-rose-400/20 transition-all duration-300"
    >
      <LogOut className="w-4 h-4" />
      <span className="text-xs font-medium">退出</span>
    </button>
  );
}
