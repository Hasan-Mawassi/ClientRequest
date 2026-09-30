import { useEffect, useState, type FormEvent } from "react";
import {
  getCurrentUser,
  login,
  logout,
  refreshSession,
  register,
  type AuthUser,
} from "./features/auth/authApi";
import "./App.css";

function App() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const response = await getCurrentUser();
        if (!cancelled) setUser(response.user);
      } catch {
        try {
          const response = await refreshSession();
          if (!cancelled) setUser(response.user);
        } catch {
          if (!cancelled) setUser(null);
        }
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    }

    void restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response =
        mode === "register"
          ? await register({ name, email, password })
          : await login({ email, password });
      setUser(response.user);
      setPassword("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setErrorMessage("");
    try {
      await logout();
      setUser(null);
      setPassword("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not sign out.",
      );
    }
  }

  function changeMode(nextMode: "login" | "register") {
    setMode(nextMode);
    setErrorMessage("");
    setPassword("");
  }

  if (isRestoring) {
    return (
      <main className="loading-screen" aria-live="polite">
        <span className="brand-mark" aria-hidden="true">
          N
        </span>
        <p>Opening your workspace</p>
      </main>
    );
  }

  return (
    <main className="auth-layout">
      <aside className="brand-panel">
        <a className="brand-lockup" href="/" aria-label="Najahak home">
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          <span>
            NAJAH<span className="brand-lockup-light">AK</span>
          </span>
        </a>
        <div className="brand-copy">
          <p className="eyebrow">CLIENT SERVICES / 01</p>
          <h1>Make space for the work that matters.</h1>
          <p className="brand-caption">
            A clear view of every client conversation.
          </p>
        </div>
        <div className="brand-footer">
          <span>INTERNAL WORKSPACE</span>
          <span>© 2026 NAJAHak</span>
        </div>
        <div className="panel-lines" aria-hidden="true" />
      </aside>

      <section className="form-panel" aria-labelledby="form-title">
        {user ? (
          <div className="signed-in-view">
            <p className="eyebrow">WORKSPACE ACCESS</p>
            <span className="signed-in-mark" aria-hidden="true">
              ✓
            </span>
            <h2 id="form-title">
              You’re signed in, {user.name.split(" ")[0]}.
            </h2>
            <p className="signed-in-email">{user.email}</p>
            <button
              className="secondary-button"
              type="button"
              onClick={handleLogout}
            >
              Sign out <span aria-hidden="true">↗</span>
            </button>
            {errorMessage && (
              <p className="form-error" role="alert">
                {errorMessage}
              </p>
            )}
          </div>
        ) : (
          <div className="auth-form-wrap">
            <div className="mobile-lockup">
              <span className="brand-mark" aria-hidden="true">
                N
              </span>
              <span>
                NAJAH<span className="brand-lockup-light">AK</span>
              </span>
            </div>
            <p className="eyebrow">YOUR WORKSPACE</p>
            <h2 id="form-title">
              {mode === "login" ? "Welcome back." : "Create your account."}
            </h2>
            <p className="form-intro">
              {mode === "login"
                ? "Sign in to continue to your workspace."
                : "Set up your account to get started."}
            </p>

            <div
              className="mode-switch"
              role="tablist"
              aria-label="Account access"
            >
              <button
                className={mode === "login" ? "mode-tab active" : "mode-tab"}
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                aria-controls="auth-form"
                onClick={() => changeMode("login")}
              >
                Sign in
              </button>
              <button
                className={mode === "register" ? "mode-tab active" : "mode-tab"}
                type="button"
                role="tab"
                aria-selected={mode === "register"}
                aria-controls="auth-form"
                onClick={() => changeMode("register")}
              >
                Create account
              </button>
            </div>

            <form id="auth-form" className="auth-form" onSubmit={handleSubmit}>
              {mode === "register" && (
                <label className="field">
                  <span>Full name</span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    minLength={2}
                    maxLength={80}
                    required
                    placeholder="Your name"
                  />
                </label>
              )}
              <label className="field">
                <span>Email address</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={254}
                  required
                  placeholder="you@company.com"
                />
              </label>
              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={mode === "register" ? 8 : 1}
                  maxLength={72}
                  required
                  placeholder={
                    mode === "register"
                      ? "At least 8 characters"
                      : "Enter your password"
                  }
                />
              </label>
              {errorMessage && (
                <p className="form-error" role="alert">
                  {errorMessage}
                </p>
              )}
              <button
                className="primary-button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Please wait…"
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
                <span aria-hidden="true">↗</span>
              </button>
            </form>
            <p className="form-footnote">
              By continuing, you agree to use this workspace responsibly.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
