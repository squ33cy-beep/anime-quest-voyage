import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout, Field } from "@/components/AuthLayout";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your AniJikan account" },
      {
        name: "description",
        content:
          "Sign up for AniJikan to build your anime watchlist, save favourites and follow airing series.",
      },
      { property: "og:title", content: "Create your AniJikan account" },
      {
        property: "og:description",
        content:
          "Sign up for AniJikan to build your anime watchlist, save favourites and follow airing series.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <AuthLayout
      title="Create account"
      subtitle="Start your list in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-cyan hover:text-foreground">
            Log in
          </Link>
        </>
      }
    >
      <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Username" type="text" placeholder="neon_fan" autoComplete="username" />
        <Field label="Email" type="email" placeholder="you@example.com" autoComplete="email" />
        <Field label="Password" type="password" placeholder="••••••••" autoComplete="new-password" />
        <button
          type="submit"
          className="w-full rounded-full bg-gradient-to-r from-pink to-brand px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-pink/25 transition hover:shadow-xl hover:shadow-brand/30"
        >
          Create account
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-slate-500">
        Demo only — no account is created yet.
      </p>
    </AuthLayout>
  );
}
