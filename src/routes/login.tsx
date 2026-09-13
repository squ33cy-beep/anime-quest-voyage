import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthLayout, Field } from "@/components/AuthLayout";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to AniJikan" },
      {
        name: "description",
        content:
          "Log in to AniJikan to keep your anime list, track episodes and get tailored recommendations.",
      },
      { property: "og:title", content: "Log in to AniJikan" },
      {
        property: "og:description",
        content:
          "Log in to AniJikan to keep your anime list, track episodes and get tailored recommendations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate({ to: "/" });
  }, [user, navigate]);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="font-semibold text-cyan hover:text-foreground">
            Create an account
          </Link>
        </>
      }
    >
      <div className="mt-6">
        <GoogleSignInButton label={t("action.googleSignIn")} />
      </div>
      <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-600">
        <span className="h-px flex-1 bg-line" />
        or
        <span className="h-px flex-1 bg-line" />
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <Field label="Email" type="email" placeholder="you@example.com" autoComplete="email" />
        <Field label="Password" type="password" placeholder="••••••••" autoComplete="current-password" />
        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-brand to-cyan px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-brand/30 transition hover:shadow-xl hover:shadow-cyan/30"
        >
          Log in
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-slate-500">
        Demo only — no account is created yet.
      </p>
    </AuthLayout>
  );
}
