import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, Field } from "@/components/AuthLayout";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in to AniVerse" },
      {
        name: "description",
        content:
          "Log in to AniVerse to keep your anime list, track episodes and get tailored recommendations.",
      },
      { property: "og:title", content: "Log in to AniVerse" },
      {
        property: "og:description",
        content:
          "Log in to AniVerse to keep your anime list, track episodes and get tailored recommendations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
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
      <form
        className="mt-6 space-y-4"
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
