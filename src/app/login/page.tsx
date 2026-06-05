import { signInWithGoogle } from "@/features/auth/actions/auth.actions";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden bg-background">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: "var(--app-primary)" }} />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: "var(--app-primary)" }} />

      <div className="relative w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl font-black text-white select-none" style={{ backgroundColor: "var(--app-primary)", boxShadow: "0 6px 0 var(--app-primary-shadow)" }}>L</div>
          <div>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--app-primary)" }}>Learn Vocabulary</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your personal vocabulary trainer</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {["🔊 Audio IPA", "🎯 Flashcards", "🔥 Daily streak"].map((f) => (
              <span key={f} className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-muted-foreground">{f}</span>
            ))}
          </div>
        </div>

        <div className="card-duo rounded-2xl border-2 bg-card p-6 space-y-4">
          <p className="text-center text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">Sign in to continue</p>
          <form action={signInWithGoogle}>
            <button type="submit" className="btn-duo w-full flex items-center justify-center gap-3 rounded-xl border-2 bg-background py-3.5 text-sm font-extrabold transition-colors hover:bg-muted">
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">🔒 Your words are private — only you can see them.</p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
