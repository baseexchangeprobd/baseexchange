import React, { useState, useEffect, useRef } from 'react';
import {
  Wallet, ArrowRightLeft, ShieldCheck, History,
  CheckCircle2, TrendingUp, Zap, ShieldAlert,
  Fingerprint, ChevronRight, Activity, BarChart3,
  ArrowUpRight, ArrowDownLeft, Scan, X
} from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'bkash', name: 'bKash', tagline: 'Instant transfer', color: '#D12053', glyph: 'বি' },
  { id: 'nagad', name: 'Nagad', tagline: 'Fast & secure', color: '#F15A22', glyph: 'ন' },
  { id: 'rocket', name: 'Rocket', tagline: 'Zero friction', color: '#7B2FBE', glyph: 'র' },
];

const RATE = 122.9;

// Ticker numbers animation hook
function useAnimatedValue(target, duration = 800) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = null;
    const from = 0;
    const to = parseFloat(target) || 0;
    if (to === 0) return;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCurrent(from + (to - from) * ease);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return current;
}

// Particle canvas background
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.4 + 0.05,
    }));

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,82,255,${p.a})`;
        ctx.fill();
      });
      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,82,255,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />;
}

// Glitch text effect
function GlitchText({ children, className }) {
  return (
    <span className={`relative inline-block ${className}`} data-text={children}>
      {children}
    </span>
  );
}

// Scan line overlay
function ScanLines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[999] opacity-[0.025]"
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.8) 2px, rgba(0,0,0,0.8) 4px)',
      }}
    />
  );
}

export default function BaseExchangePro() {
  const [activeTab, setActiveTab] = useState('buy');
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(null);
  const [activeNav, setActiveNav] = useState('trade');
  const [connectStep, setConnectStep] = useState(0);
  const [showRate, setShowRate] = useState(false);

  const usdc = amount ? (parseFloat(amount) / RATE).toFixed(4) : '0.0000';

  useEffect(() => {
    setTimeout(() => setShowRate(true), 600);
  }, []);

  const connectWallet = () => {
    setConnectStep(1);
    setTimeout(() => setConnectStep(2), 800);
    setTimeout(() => setConnectStep(3), 1600);
    setTimeout(() => {
      setWalletAddress('0x71C7…4fCB');
      setIsConnected(true);
      setConnectStep(0);
    }, 2400);
  };

  const handleTransaction = () => {
    if (!amount || !selectedMethod) return;
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); setStatus('success'); }, 2400);
  };

  const CONNECT_STEPS = ['', 'Scanning biometrics…', 'Verifying on-chain…', 'Securing vault…'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        * { box-sizing: border-box; }

        :root {
          --blue: #0052FF;
          --blue-dim: rgba(0,82,255,0.15);
          --green: #00E87A;
          --orange: #FF6B35;
          --surface: rgba(255,255,255,0.03);
          --border: rgba(255,255,255,0.07);
          --border-active: rgba(0,82,255,0.5);
          --text-muted: rgba(255,255,255,0.35);
        }

        body { background: #030712; }

        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono-custom { font-family: 'Space Mono', monospace; }

        .app-shell {
          min-height: 100dvh;
          background: #030712;
          color: #fff;
          font-family: 'Syne', sans-serif;
          overflow-x: hidden;
          position: relative;
        }

        /* Ambient blobs */
        .blob-1 {
          position: fixed; top: -120px; left: -80px;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(0,82,255,0.12) 0%, transparent 70%);
          pointer-events: none; border-radius: 50%;
        }
        .blob-2 {
          position: fixed; bottom: -80px; right: -80px;
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(0,232,122,0.07) 0%, transparent 70%);
          pointer-events: none; border-radius: 50%;
        }

        /* Nav */
        .nav-bar {
          position: sticky; top: 0; z-index: 50;
          background: rgba(3,7,18,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 16px 20px;
        }
        .nav-inner {
          max-width: 420px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo-mark {
          width: 36px; height: 36px;
          background: var(--blue);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
        }
        .logo-mark::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%);
        }
        .live-badge {
          display: flex; align-items: center; gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 10px; color: var(--green);
          border: 1px solid rgba(0,232,122,0.25);
          padding: 4px 10px; border-radius: 100px;
        }
        .live-dot {
          width: 6px; height: 6px; background: var(--green);
          border-radius: 50%; animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* Rate ticker */
        .rate-ticker {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 14px 18px;
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 20px;
          opacity: 0; transform: translateY(8px);
          transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        .rate-ticker.visible { opacity: 1; transform: translateY(0); }

        /* Connect screen */
        .connect-card {
          background: linear-gradient(160deg, rgba(0,82,255,0.08) 0%, rgba(3,7,18,0) 60%);
          border: 1px solid var(--border);
          border-radius: 28px; padding: 40px 28px;
          text-align: center; position: relative; overflow: hidden;
        }
        .connect-card::before {
          content: '';
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 200px; height: 1px;
          background: linear-gradient(90deg, transparent, var(--blue), transparent);
        }
        .fp-ring {
          width: 100px; height: 100px; margin: 0 auto 24px;
          position: relative; display: flex; align-items: center; justify-content: center;
        }
        .fp-ring::before, .fp-ring::after {
          content: ''; position: absolute; border-radius: 50%;
          border: 1px solid rgba(0,82,255,0.3);
        }
        .fp-ring::before { inset: 0; animation: ripple 2s infinite; }
        .fp-ring::after { inset: -12px; animation: ripple 2s 0.5s infinite; }
        @keyframes ripple {
          0% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.3); }
        }
        .fp-inner {
          width: 72px; height: 72px;
          background: rgba(0,82,255,0.1);
          border: 1px solid rgba(0,82,255,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--blue);
        }

        .connect-step {
          font-family: 'Space Mono', monospace;
          font-size: 11px; color: var(--green);
          height: 18px; overflow: hidden;
          transition: all 0.3s;
        }

        /* Main connect btn */
        .btn-primary {
          width: 100%; height: 60px;
          background: var(--blue);
          border: none; border-radius: 18px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800;
          letter-spacing: 0.05em;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn-primary::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(0,82,255,0.4); }
        .btn-primary:active { transform: scale(0.985); }
        .btn-primary:disabled { opacity: 0.5; pointer-events: none; }

        /* Wallet chip */
        .wallet-chip {
          display: flex; align-items: center; gap: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px; padding: 14px 18px;
          margin-bottom: 20px;
        }
        .wallet-avatar {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, var(--blue) 0%, #004de0 100%);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
          font-family: 'Space Mono', monospace;
        }

        /* Tab toggle */
        .tab-rail {
          display: flex;
          background: rgba(255,255,255,0.04);
          border: 1px solid var(--border);
          border-radius: 18px; padding: 4px;
          margin-bottom: 20px;
        }
        .tab-btn {
          flex: 1; height: 48px; border: none; border-radius: 14px;
          font-family: 'Syne', sans-serif;
          font-size: 12px; font-weight: 800;
          letter-spacing: 0.1em; cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
          display: flex; align-items: center; justify-content: center; gap-8px;
          gap: 8px;
        }
        .tab-btn.buy-active { background: var(--blue); color: #fff; box-shadow: 0 4px 20px rgba(0,82,255,0.35); }
        .tab-btn.sell-active { background: #FF6B35; color: #fff; box-shadow: 0 4px 20px rgba(255,107,53,0.35); }
        .tab-btn.inactive { background: transparent; color: var(--text-muted); }

        /* Trade card */
        .trade-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px; padding: 24px;
        }

        /* Amount input */
        .amount-wrap { margin-bottom: 24px; }
        .amount-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; color: var(--text-muted);
          text-transform: uppercase; margin-bottom: 10px; display: block;
        }
        .amount-box {
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--border);
          border-radius: 18px; padding: 16px 20px;
          display: flex; align-items: center; gap: 12px;
          transition: border-color 0.2s;
        }
        .amount-box:focus-within { border-color: var(--border-active); }
        .amount-currency {
          font-family: 'Space Mono', monospace;
          font-size: 22px; color: var(--text-muted); flex-shrink: 0;
        }
        .amount-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Syne', sans-serif;
          font-size: 32px; font-weight: 800; color: #fff;
          width: 100%;
        }
        .amount-input::placeholder { color: rgba(255,255,255,0.1); }
        .usdc-preview {
          font-family: 'Space Mono', monospace;
          font-size: 12px; color: var(--blue);
          margin-top: 8px; text-align: right;
        }

        /* Payment methods */
        .methods-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; color: var(--text-muted);
          text-transform: uppercase; margin-bottom: 10px; display: block;
        }
        .method-btn {
          width: 100%; display: flex; align-items: center; gap: 14px;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 14px 16px;
          cursor: pointer; margin-bottom: 8px;
          transition: all 0.2s;
          text-align: left;
        }
        .method-btn:hover { border-color: rgba(255,255,255,0.15); }
        .method-btn.selected { border-color: var(--border-active); background: var(--blue-dim); }
        .method-icon {
          width: 44px; height: 44px; border-radius: 13px;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 18px; font-weight: 800; color: #fff;
          flex-shrink: 0;
        }
        .method-check {
          margin-left: auto; width: 22px; height: 22px;
          background: var(--blue); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* Escrow warning */
        .escrow-banner {
          display: flex; align-items: flex-start; gap: 12px;
          background: rgba(255,187,0,0.05);
          border: 1px solid rgba(255,187,0,0.2);
          border-radius: 14px; padding: 14px 16px;
          margin: 20px 0;
        }
        .escrow-banner-icon { color: #FFBB00; flex-shrink: 0; margin-top: 2px; }

        /* Submit btn */
        .btn-submit {
          width: 100%; height: 60px;
          border: none; border-radius: 18px; cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 15px; font-weight: 800; letter-spacing: 0.05em;
          color: #fff; position: relative; overflow: hidden;
          transition: all 0.2s;
        }
        .btn-submit.buy-mode { background: linear-gradient(135deg, #0052FF 0%, #0041CC 100%); }
        .btn-submit.sell-mode { background: linear-gradient(135deg, #FF6B35 0%, #E55520 100%); }
        .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,82,255,0.3); }
        .btn-submit:active { transform: scale(0.985); }
        .btn-submit:disabled { opacity: 0.35; pointer-events: none; }
        .btn-submit.buy-mode:hover { box-shadow: 0 8px 24px rgba(0,82,255,0.35); }
        .btn-submit.sell-mode:hover { box-shadow: 0 8px 24px rgba(255,107,53,0.35); }

        /* Shimmer loading */
        .shimmer {
          position: relative; overflow: hidden;
        }
        .shimmer::after {
          content: '';
          position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer { to { left: 100%; } }

        /* Success */
        .success-card {
          background: rgba(0,232,122,0.04);
          border: 1px solid rgba(0,232,122,0.2);
          border-radius: 24px; padding: 48px 28px;
          text-align: center;
        }
        .success-ring {
          width: 96px; height: 96px; margin: 0 auto 24px;
          background: rgba(0,232,122,0.1);
          border: 1px solid rgba(0,232,122,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes successPop {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        /* Trust stats */
        .stat-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; margin-top: 20px;
        }
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 16px;
        }
        .stat-value {
          font-family: 'Space Mono', monospace;
          font-size: 18px; font-weight: 700;
          margin-bottom: 4px;
        }
        .stat-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; color: var(--text-muted);
          text-transform: uppercase;
        }

        /* Bottom nav */
        .bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: rgba(3,7,18,0.92);
          backdrop-filter: blur(20px);
          border-top: 1px solid var(--border);
          padding: 10px 0 16px;
        }
        .bottom-nav-inner {
          max-width: 420px; margin: 0 auto;
          display: flex; justify-content: space-around;
        }
        .nav-item {
          display: flex; flex-direction: column; align-items: center;
          gap: 4px; cursor: pointer; padding: 6px 16px;
          border-radius: 12px; transition: all 0.2s;
          background: transparent; border: none; color: var(--text-muted);
        }
        .nav-item.active { color: var(--blue); }
        .nav-item span {
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
        }

        /* Scan animation on connect */
        .scan-line {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--blue), transparent);
          animation: scanDown 1s infinite;
        }
        @keyframes scanDown {
          from { top: 0; opacity: 1; }
          to { top: 100%; opacity: 0; }
        }

        /* Processing overlay */
        .processing-wrap {
          display: flex; align-items: center; justify-content: center;
          gap: 10px;
        }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .main-content {
          max-width: 420px; margin: 0 auto;
          padding: 20px 20px 100px;
        }

        /* Fade in */
        .fade-up {
          animation: fadeUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <ScanLines />

      <div className="app-shell">
        <div className="blob-1" />
        <div className="blob-2" />

        {/* Nav */}
        <nav className="nav-bar">
          <div className="nav-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="logo-mark">
                <Activity size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 15, letterSpacing: '0.05em', lineHeight: 1 }}>
                  BASE EXCHANGE
                </div>
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: 'rgba(0,82,255,0.7)', letterSpacing: '0.12em', marginTop: 2 }}>
                  BANGLADESH · PRO
                </div>
              </div>
            </div>
            <div className="live-badge">
              <div className="live-dot" />
              LIVE
            </div>
          </div>
        </nav>

        <main className="main-content">

          {/* Rate ticker */}
          <div className={`rate-ticker ${showRate ? 'visible' : ''}`}>
            <div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 4 }}>USDC / BDT</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 22, fontWeight: 700 }}>
                ৳{RATE.toFixed(2)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#00E87A', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginBottom: 4 }}>
                <ArrowUpRight size={12} />
                +0.3% today
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-muted)' }}>
                Base Network
              </div>
            </div>
          </div>

          {!isConnected ? (
            /* ─── Connect Screen ─── */
            <div className="connect-card fade-up">
              <div className="fp-ring">
                {connectStep > 0 && <div className="scan-line" />}
                <div className="fp-inner">
                  {connectStep === 0
                    ? <Fingerprint size={36} />
                    : connectStep === 1
                      ? <Scan size={36} style={{ animation: 'spin 1s linear infinite' }} />
                      : connectStep === 2
                        ? <ShieldCheck size={36} color="#00E87A" />
                        : <CheckCircle2 size={36} color="#00E87A" />
                  }
                </div>
              </div>

              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 28, marginBottom: 8, letterSpacing: '-0.02em' }}>
                Secure Smart Wallet
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 32, lineHeight: 1.6 }}>
                Biometric-gated access to the Base blockchain.<br />
                Your keys, your crypto.
              </p>

              <div className="connect-step">
                {CONNECT_STEPS[connectStep]}
              </div>
              {connectStep === 0 && <div style={{ height: 18 }} />}

              <div style={{ height: 24 }} />

              <button className={`btn-primary ${connectStep > 0 ? 'shimmer' : ''}`} onClick={connectWallet} disabled={connectStep > 0}>
                {connectStep === 0
                  ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <Fingerprint size={18} /> Connect Wallet
                    </span>
                  : <span className="processing-wrap">
                      <div className="spinner" /> Authenticating…
                    </span>
                }
              </button>

              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: 10, color: 'var(--text-muted)', marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ShieldCheck size={12} /> E2E Encrypted · Non-custodial
              </p>
            </div>
          ) : (
            <>
              {/* ─── Wallet Chip ─── */}
              <div className="wallet-chip fade-up">
                <div className="wallet-avatar">0x</div>
                <div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>CONNECTED</div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 13 }}>{walletAddress}</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div className="live-dot" />
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 9, color: '#00E87A' }}>BASE</span>
                </div>
              </div>

              {/* ─── Tab Toggle ─── */}
              <div className="tab-rail fade-up">
                {['buy', 'sell'].map(t => (
                  <button
                    key={t}
                    onClick={() => { setActiveTab(t); setStatus(null); }}
                    className={`tab-btn ${activeTab === t ? (t === 'buy' ? 'buy-active' : 'sell-active') : 'inactive'}`}
                  >
                    {t === 'buy' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                    {t.toUpperCase()} USDC
                  </button>
                ))}
              </div>

              {/* ─── Success State ─── */}
              {status === 'success' ? (
                <div className="success-card fade-up">
                  <div className="success-ring">
                    <CheckCircle2 size={44} color="#00E87A" />
                  </div>
                  <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, marginBottom: 8 }}>
                    Order Complete
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 8 }}>
                    Assets secured in your Base wallet
                  </p>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 12, color: '#00E87A', marginBottom: 32 }}>
                    +{usdc} USDC confirmed
                  </div>
                  <button className="btn-primary" onClick={() => { setStatus(null); setAmount(''); setSelectedMethod(''); }}>
                    New Trade
                  </button>
                </div>
              ) : (
                /* ─── Trade Form ─── */
                <div className="trade-card fade-up">
                  {/* Amount */}
                  <div className="amount-wrap">
                    <span className="amount-label">You Pay (BDT)</span>
                    <div className="amount-box">
                      <span className="amount-currency">৳</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0"
                        className="amount-input"
                      />
                    </div>
                    <div className="usdc-preview">
                      ≈ <strong>{usdc}</strong> USDC
                    </div>
                  </div>

                  {/* Methods */}
                  <span className="methods-label">Payment Gateway</span>
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`method-btn ${selectedMethod === m.id ? 'selected' : ''}`}
                    >
                      <div
                        className="method-icon"
                        style={{ background: m.color }}
                      >
                        {m.glyph}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.tagline}</div>
                      </div>
                      {selectedMethod === m.id && (
                        <div className="method-check">
                          <CheckCircle2 size={14} color="#fff" />
                        </div>
                      )}
                    </button>
                  ))}

                  {/* Escrow */}
                  <div className="escrow-banner">
                    <ShieldAlert size={16} className="escrow-banner-icon" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>Smart Escrow Active</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        Funds release only after on-chain confirmation on Base network.
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    className={`btn-submit ${activeTab === 'buy' ? 'buy-mode' : 'sell-mode'} ${isProcessing ? 'shimmer' : ''}`}
                    onClick={handleTransaction}
                    disabled={!amount || !selectedMethod || isProcessing}
                  >
                    {isProcessing
                      ? <span className="processing-wrap"><div className="spinner" /> Processing…</span>
                      : activeTab === 'buy'
                        ? `BUY ${usdc !== '0.0000' ? usdc : ''} USDC`
                        : `SELL USDC NOW`
                    }
                  </button>
                </div>
              )}

              {/* Stats */}
              <div className="stat-grid">
                <div className="stat-card">
                  <div className="stat-value" style={{ color: '#00E87A' }}>3-5m</div>
                  <div className="stat-label">Settlement</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: '#0052FF' }}>0%</div>
                  <div className="stat-label">Platform Fee</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'rgba(255,255,255,0.8)' }}>P2P</div>
                  <div className="stat-label">Non-custodial</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value" style={{ color: 'rgba(255,255,255,0.8)' }}>24/7</div>
                  <div className="stat-label">Always On</div>
                </div>
              </div>
            </>
          )}
        </main>

        {/* Bottom Nav */}
        <nav className="bottom-nav">
          <div className="bottom-nav-inner">
            {[
              { id: 'trade', icon: <Zap size={20} />, label: 'TRADE' },
              { id: 'orders', icon: <History size={20} />, label: 'ORDERS' },
              { id: 'wallet', icon: <Wallet size={20} />, label: 'WALLET' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}
