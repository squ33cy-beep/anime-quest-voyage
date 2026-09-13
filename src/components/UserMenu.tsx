import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { avatarUrl, displayName, useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export function UserMenu() {
  const { user, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (loading) {
    return <div className="size-9 animate-pulse rounded-full bg-panel/70" />;
  }

  if (!user) {
    return (
      <>
        <Link
          to="/login"
          className="hidden rounded-full border border-line bg-panel/60 px-4 py-2 text-sm font-semibold text-foreground backdrop-blur-md transition hover:border-brand/50 sm:block"
        >
          {t("action.login")}
        </Link>
        <Link
          to="/register"
          aria-label="Create an account"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink to-brand text-sm font-bold text-primary-foreground"
        >
          R
        </Link>
      </>
    );
  }

  const name = displayName(user);
  const avatar = avatarUrl(user);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-line bg-panel/60 py-1 pl-1 pr-1 backdrop-blur-md transition hover:border-brand/50 sm:pr-3"
      >
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            referrerPolicy="no-referrer"
            className="size-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-pink to-brand text-xs font-bold text-primary-foreground">
            {name.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="hidden max-w-[9rem] truncate text-sm font-semibold text-foreground sm:block">
          {name}
        </span>
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-line bg-panel/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
        >
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-foreground">{name}</p>
            {user.email ? (
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-ink/60 hover:text-foreground"
          >
            <LogOut className="size-4" />
            {t("action.signOut")}
          </button>
        </div>
      ) : null}
    </div>
  );
}
