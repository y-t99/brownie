"use client";

import { AnimatePresence, motion } from "framer-motion";
import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { getSession, signin, signup } from "@/lib/auth-api";
import { type HomeAuthState, resolveHomeAuthState } from "@/lib/auth-ui-state";

import { loginHeroImage } from "./assets";

type AuthMode = "signin" | "create";

const formMotion = {
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  initial: { opacity: 0, y: 12 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
} as const;

const errorMotion = {
  animate: { height: "auto", opacity: 1, y: 0 },
  exit: { height: 0, opacity: 0, y: -4 },
  initial: { height: 0, opacity: 0, y: -4 },
  transition: { duration: 0.18, ease: "easeOut" },
} as const;

export function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [authState, setAuthState] = useState<HomeAuthState>({
    status: "loading",
  });
  const [sessionAttempt, setSessionAttempt] = useState(0);
  const isSignIn = mode === "signin";

  useEffect(() => {
    let isCurrent = true;

    resolveHomeAuthState(getSession()).then((state) => {
      if (isCurrent) setAuthState(state);
    });

    return () => {
      isCurrent = false;
    };
  }, [sessionAttempt]);

  function retrySession() {
    setAuthState({ status: "loading" });
    setSessionAttempt((attempt) => attempt + 1);
  }

  return (
    <div className="stitch-login-page flex min-h-dvh flex-col bg-white text-[#1c1b1b]">
      <style>{`
        html:has(.stitch-login-page),
        body:has(.stitch-login-page) {
          background: #ffffff;
        }
        .stitch-login-page {
          min-height: 100dvh;
          background: #ffffff;
          color: #1c1b1b;
          color-scheme: light;
        }
        .stitch-login-page a,
        .stitch-login-page button {
          cursor: pointer;
        }
        .stitch-login-header-inner,
        .stitch-login-hero,
        .stitch-login-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding-left: 16px;
          padding-right: 16px;
        }
        .stitch-login-header-inner {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .stitch-login-brand {
          display: inline-flex;
          align-items: center;
          gap: 16px;
        }
        .stitch-login-brand-mark {
          display: inline-flex;
          width: 30px;
          height: 30px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 8px;
          background: #f6f1e8;
        }
        .stitch-login-brand-mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .stitch-login-brand-wordmark {
          display: block;
          width: 112px;
          height: auto;
        }
        .stitch-login-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(390px, 480px);
          gap: clamp(44px, 6vw, 88px);
          align-items: center;
          width: 100%;
          padding-top: 80px;
          padding-bottom: 80px;
        }
        .stitch-login-copy {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .stitch-login-image {
          margin-top: 12px;
          aspect-ratio: 16 / 9;
          max-height: 360px;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid #e2e2e2;
          background: #ffffff;
        }
        .stitch-login-auth-column {
          display: flex;
          justify-content: flex-end;
        }
        .stitch-login-auth-card {
          display: flex;
          flex-direction: column;
          gap: 30px;
          width: 100%;
          max-width: 480px;
          border-radius: 8px;
          border: 1px solid #dbdbdb;
          background: #ffffff;
          padding: 38px;
          box-shadow: 0 10px 34px rgba(0, 0, 0, 0.055);
        }
        .stitch-auth-switcher {
          position: relative;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          height: 44px;
          border-radius: 8px;
          border: 1px solid #f0f0f0;
          background: #fcfcfc;
          padding: 4px;
        }
        .stitch-auth-switcher-item {
          position: absolute;
          inset: 0;
          border-radius: 6px;
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }
        .stitch-auth-switcher-button {
          position: relative;
          z-index: 1;
          display: flex;
          min-width: 0;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #747878;
          font-size: 13px;
          font-weight: 600;
          line-height: 1;
          white-space: nowrap;
        }
        .stitch-auth-switcher-button-active {
          color: #1c1b1b;
        }
        .stitch-auth-body {
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-height: 376px;
          overflow: hidden;
        }
        .stitch-auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .stitch-auth-field {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .stitch-auth-field-label {
          color: #444748;
          font-size: 11px;
          font-weight: 600;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .stitch-auth-input {
          width: 100%;
          height: 46px;
          border-radius: 8px;
          border: 1px solid #dbdbdb;
          background: #ffffff;
          padding: 0 18px;
          color: #1c1b1b;
          font-size: 13px;
          outline: none;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease;
        }
        .stitch-auth-input::placeholder {
          color: #a8a8a8;
        }
        .stitch-auth-input:focus {
          border-color: #1c1b1b;
          box-shadow: 0 0 0 3px rgba(28, 27, 27, 0.06);
        }
        .stitch-auth-error {
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid #f3c6c6;
          background: #fff7f7;
          padding: 11px 13px;
          color: #9b1c1c;
          font-size: 12px;
          line-height: 18px;
        }
        .stitch-auth-primary,
        .stitch-auth-secondary {
          display: inline-flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0;
          line-height: 1;
          transition:
            background-color 160ms ease,
            border-color 160ms ease,
            color 160ms ease;
        }
        .stitch-auth-primary {
          height: 46px;
          border: 1px solid #1c1b1b;
          background: #1c1b1b;
          color: #ffffff;
        }
        .stitch-auth-primary:hover {
          background: #333131;
          border-color: #333131;
        }
        .stitch-auth-primary:disabled,
        .stitch-auth-secondary:disabled {
          cursor: not-allowed;
          opacity: 0.62;
        }
        .stitch-auth-secondary {
          height: 44px;
          border: 1px solid #d9d9d9;
          background: #ffffff;
          color: #1c1b1b;
        }
        .stitch-auth-secondary:hover {
          border-color: #1c1b1b;
          background: #fafafa;
        }
        .stitch-auth-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #747878;
          font-size: 10px;
          font-weight: 700;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .stitch-auth-divider::before,
        .stitch-auth-divider::after {
          content: "";
          height: 1px;
          flex: 1;
          background: #e2e2e2;
        }
        .stitch-auth-legal {
          margin: 0;
          color: #747878;
          font-size: 11px;
          line-height: 19px;
          text-align: center;
        }
        .stitch-auth-session {
          display: flex;
          min-height: 420px;
          flex-direction: column;
          justify-content: center;
          gap: 24px;
        }
        .stitch-auth-session-icon {
          display: inline-flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #f5f5f5;
          color: #1c1b1b;
        }
        .stitch-auth-session-copy {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .stitch-auth-session-title {
          color: #1c1b1b;
          font-size: 24px;
          font-weight: 650;
          line-height: 1.25;
        }
        .stitch-auth-session-email {
          color: #747878;
          font-size: 13px;
          line-height: 20px;
        }
        .stitch-auth-loading-line {
          height: 12px;
          border-radius: 999px;
          background: #f1f1f1;
          animation: stitch-auth-pulse 1.4s ease-in-out infinite;
        }
        @keyframes stitch-auth-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
        .stitch-login-footer-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 72px;
        }
        @media (max-width: 1023px) {
          .stitch-login-hero {
            grid-template-columns: minmax(0, 1fr) minmax(340px, 440px);
            gap: 36px;
            padding-top: 48px;
            padding-bottom: 48px;
          }
          .stitch-login-image {
            max-height: 240px;
          }
          .stitch-login-auth-column {
            justify-content: flex-end;
          }
          .stitch-login-auth-card {
            max-width: 440px;
            padding: 32px;
          }
        }
        @media (max-width: 767px) {
          .stitch-login-hero {
            grid-template-columns: 1fr;
          }
          .stitch-login-image {
            max-height: none;
          }
          .stitch-login-auth-column {
            justify-content: center;
          }
          .stitch-login-auth-card {
            max-width: 480px;
          }
        }
        @media (max-width: 640px) {
          .stitch-login-header-inner,
          .stitch-login-hero,
          .stitch-login-footer-inner {
            padding-left: 16px;
            padding-right: 16px;
          }
          .stitch-login-footer-inner {
            flex-direction: column;
            justify-content: center;
          }
          .stitch-login-auth-card {
            padding: 26px 20px;
            gap: 26px;
          }
          .stitch-auth-form {
            gap: 18px;
          }
          .stitch-auth-input,
          .stitch-auth-primary {
            height: 46px;
          }
        }
      `}</style>
      <header className="sticky top-0 z-20 border-b border-[#e2e2e2] bg-white">
        <div className="stitch-login-header-inner">
          <Link
            aria-label="lnkling home"
            className="stitch-login-brand"
            href="/"
          >
            <img
              alt="lnkling"
              className="stitch-login-brand-wordmark"
              src="/lnkling-wordmark.png"
            />
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="stitch-login-hero">
          <div className="stitch-login-copy">
            <div className="stitch-login-image">
              <img
                alt="lnkling brand background"
                className="h-full w-full object-cover"
                src={loginHeroImage}
              />
            </div>
            <p className="w-full text-base leading-7 text-[#444748]">
              Deploy secure, context-aware artificial intelligence across your
              organization. Transform fragmented data into coherent strategic
              advantages with our sub-millisecond inference engine.
            </p>
          </div>

          <div className="stitch-login-auth-column">
            <div className="stitch-login-auth-card">
              {authState.status === "anonymous" ? (
                <>
                  <div
                    className="stitch-auth-switcher"
                    role="tablist"
                    aria-label="Authentication mode"
                  >
                    <button
                      aria-selected={isSignIn}
                      className={`stitch-auth-switcher-button ${
                        isSignIn ? "stitch-auth-switcher-button-active" : ""
                      }`}
                      onClick={() => setMode("signin")}
                      role="tab"
                      type="button"
                    >
                      {isSignIn ? (
                        <motion.span
                          className="stitch-auth-switcher-item"
                          layoutId="stitch-auth-switcher-item"
                          transition={{
                            duration: 0.24,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      ) : null}
                      <span className="relative z-[1]">Sign In</span>
                    </button>
                    <button
                      aria-selected={!isSignIn}
                      className={`stitch-auth-switcher-button ${
                        !isSignIn ? "stitch-auth-switcher-button-active" : ""
                      }`}
                      onClick={() => setMode("create")}
                      role="tab"
                      type="button"
                    >
                      {!isSignIn ? (
                        <motion.span
                          className="stitch-auth-switcher-item"
                          layoutId="stitch-auth-switcher-item"
                          transition={{
                            duration: 0.24,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        />
                      ) : null}
                      <span className="relative z-[1]">Create Account</span>
                    </button>
                  </div>

                  <div className="stitch-auth-body">
                    <AnimatePresence mode="wait" initial={false}>
                      {isSignIn ? (
                        <SignInForm key="signin" />
                      ) : (
                        <CreateAccountForm key="create" />
                      )}
                    </AnimatePresence>

                    <p className="stitch-auth-legal">
                      By continuing, you agree to our{" "}
                      <a className="underline text-[#1c1b1b]" href="#">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a className="underline text-[#1c1b1b]" href="#">
                        Privacy Policy
                      </a>
                      .
                    </p>
                  </div>
                </>
              ) : (
                <SessionCardContent
                  authState={authState}
                  onRetry={retrySession}
                />
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e2e2e2] bg-white py-8">
        <div className="stitch-login-footer-inner text-xs text-[#444748]">
          <div className="font-semibold text-[#1c1b1b]">lnkling</div>
          <p>© 2024 lnkling. All rights reserved.</p>
          <nav className="flex gap-8">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function SessionCardContent({
  authState,
  onRetry,
}: {
  authState: Exclude<HomeAuthState, { status: "anonymous" }>;
  onRetry: () => void;
}) {
  if (authState.status === "loading") {
    return (
      <div aria-live="polite" className="stitch-auth-session">
        <div className="stitch-auth-loading-line w-12" />
        <div className="space-y-3">
          <div className="stitch-auth-loading-line w-2/3" />
          <div className="stitch-auth-loading-line w-full" />
        </div>
        <div className="stitch-auth-loading-line h-[46px] w-full" />
        <span className="sr-only">Checking your session</span>
      </div>
    );
  }

  if (authState.status === "error") {
    return (
      <div className="stitch-auth-session">
        <div className="stitch-auth-session-copy">
          <h2 className="stitch-auth-session-title">
            We couldn&apos;t check your session
          </h2>
          <p className="stitch-auth-session-email">{authState.error}</p>
        </div>
        <button className="stitch-auth-primary" onClick={onRetry} type="button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="stitch-auth-session">
      <span className="stitch-auth-session-icon">
        <User aria-hidden="true" size={22} strokeWidth={1.7} />
      </span>
      <div className="stitch-auth-session-copy">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#747878]">
          Signed in
        </p>
        <h2 className="stitch-auth-session-title">
          Welcome back, {authState.user.name}
        </h2>
        <p className="stitch-auth-session-email">{authState.user.email}</p>
      </div>
      <Link className="stitch-auth-primary" href="/chat">
        Continue to Chat
      </Link>
    </div>
  );
}

function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signin({ email, password });
      router.push("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.form
      className="stitch-auth-form"
      onSubmit={handleSubmit}
      {...formMotion}
    >
      <Field
        autoComplete="email"
        label="Business Email"
        onChange={setEmail}
        placeholder="name@company.com"
        type="email"
        value={email}
      />
      <Field
        autoComplete="current-password"
        label="Password"
        maxLength={32}
        minLength={8}
        onChange={setPassword}
        placeholder="••••••••"
        type="password"
        value={password}
      />
      <AnimatePresence initial={false}>
        {error ? (
          <motion.div
            className="stitch-auth-error"
            role="alert"
            {...errorMotion}
          >
            {error}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.button
        animate={{ scale: isSubmitting ? 0.985 : 1 }}
        className="stitch-auth-primary"
        disabled={isSubmitting}
        whileHover={isSubmitting ? undefined : { y: -1 }}
        whileTap={isSubmitting ? undefined : { scale: 0.985 }}
        type="submit"
      >
        {isSubmitting ? "Signing in..." : "Continue to Dashboard"}
      </motion.button>
      <Divider />
      <motion.button className="stitch-auth-secondary" disabled type="button">
        <User size={18} />
        Continue with Google
      </motion.button>
    </motion.form>
  );
}

function CreateAccountForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signup({ email, name, password });
      router.push("/chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Account creation failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.form
      className="stitch-auth-form"
      onSubmit={handleSubmit}
      {...formMotion}
    >
      <Field
        autoComplete="name"
        label="Full Name"
        maxLength={32}
        minLength={2}
        onChange={setName}
        placeholder="John Doe"
        type="text"
        value={name}
      />
      <Field
        autoComplete="email"
        label="Company Email"
        onChange={setEmail}
        placeholder="name@company.com"
        type="email"
        value={email}
      />
      <Field
        autoComplete="new-password"
        label="Password"
        maxLength={32}
        minLength={8}
        onChange={setPassword}
        placeholder="Min. 8 characters"
        type="password"
        value={password}
      />
      <AnimatePresence initial={false}>
        {error ? (
          <motion.div
            className="stitch-auth-error"
            role="alert"
            {...errorMotion}
          >
            {error}
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.button
        animate={{ scale: isSubmitting ? 0.985 : 1 }}
        className="stitch-auth-primary"
        disabled={isSubmitting}
        whileHover={isSubmitting ? undefined : { y: -1 }}
        whileTap={isSubmitting ? undefined : { scale: 0.985 }}
        type="submit"
      >
        {isSubmitting ? "Creating account..." : "Start Free Trial"}
      </motion.button>
    </motion.form>
  );
}

function Field({
  autoComplete,
  label,
  maxLength,
  minLength,
  onChange,
  placeholder,
  type,
  value,
}: {
  autoComplete?: string;
  label: string;
  maxLength?: number;
  minLength?: number;
  onChange: (value: string) => void;
  placeholder: string;
  type: string;
  value: string;
}) {
  return (
    <label className="stitch-auth-field">
      <span className="stitch-auth-field-label">{label}</span>
      <input
        autoComplete={autoComplete}
        className="stitch-auth-input"
        maxLength={maxLength}
        minLength={minLength}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

function Divider() {
  return <div className="stitch-auth-divider">Or connect with</div>;
}
