import type { ReactNode } from "react";
import { AmbientBackdrop, BrandMark } from "@/components/AppShell";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-ink px-4 py-6 text-slate-200 sm:px-6">
      <AmbientBackdrop />
      <div className="mx-auto w-full max-w-7xl">
        <BrandMark />
      </div>
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
        <div className="rounded-3xl glass p-6 shadow-2xl shadow-black/50 sm:p-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          {children}
        </div>
        <div className="mt-6 text-center text-sm text-slate-400">{footer}</div>
      </main>
    </div>
  );
}

export function Field({
  label,
  type,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}) {
  const id = `${label.toLowerCase().replace(/\s+/g, "-")}-field`;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-foreground placeholder:text-slate-600 transition focus:border-brand/60 focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </div>
  );
}
