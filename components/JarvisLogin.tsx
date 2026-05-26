import Link from "next/link";

export default function JarvisLogin() {
  return (
    <main className="jarvis-login">
      <div className="login-grid-bg" />
      <div className="login-vignette" />
      <div className="scanline-layer" />

      <div className="login-outer-frame frame-one" />
      <div className="login-outer-frame frame-two" />

      <section className="login-shell">
        <div className="login-reactor">
          <div className="login-reactor-ring ring-one" />
          <div className="login-reactor-ring ring-two" />
          <div className="login-reactor-ring ring-three" />
          <div className="login-reactor-core" />
        </div>

        <h1>JARVIS</h1>
        <p>AI ASSISTANT SYSTEM</p>

        <div className="login-panel">
          <h2>SIGN IN TO JARVIS</h2>

          <label>
            <span>♙</span>
            <input type="email" placeholder="Username" />
          </label>

          <label>
            <span>▣</span>
            <input type="password" placeholder="Password" />
            <b>◌</b>
          </label>

          <Link href="/dashboard" className="login-submit">
            SIGN IN
          </Link>

          <div className="login-separator">
            <i />
            <span>OR</span>
            <i />
          </div>

          <button type="button" className="bio-button">
            <span>◎</span>
            USE BIOMETRIC LOGIN
          </button>
        </div>

        <em>JARVIS v6.2.0</em>
      </section>
    </main>
  );
}
