import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Activity, Wallet, History, Zap,
  Fingerprint, ShieldCheck, ShieldAlert, Scan,
  CheckCircle2, ArrowUpRight, ArrowDownLeft,
  TrendingUp, TrendingDown, Lock, Unlock,
  Globe, Copy, ExternalLink, BarChart3,
  ChevronRight, RefreshCw, DollarSign, Clock,
  User, Settings, Bell, Star,
} from 'lucide-react'

/* ═══════════════════════════════════
   Constants
   ═══════════════════════════════════ */
const RATE = 122.9
const RATE_PREV = 122.54
const RATE_DELTA_PCT = (((RATE - RATE_PREV) / RATE_PREV) * 100).toFixed(2)
const IS_POSITIVE = RATE > RATE_PREV

const PAYMENT_METHODS = [
  {
    id: 'bkash',
    name: 'bKash',
    tagline: 'Instant · 24/7',
    color: '#D12053',
    glyph: 'বি',
    fee: '0%',
  },
  {
    id: 'nagad',
    name: 'Nagad',
    tagline: 'Govt-backed · Fast',
    color: '#F15A22',
    glyph: 'ন',
    fee: '0%',
  },
  {
    id: 'rocket',
    name: 'Rocket',
    tagline: 'DBBL · Secure',
    color: '#7B2FBE',
    glyph: 'র',
    fee: '0%',
  },
]

const NAV_ITEMS = [
  { id: 'trade', icon: Zap, label: 'TRADE' },
  { id: 'orders', icon: History, label: 'ORDERS' },
  { id: 'wallet', icon: Wallet, label: 'WALLET' },
]

const CONNECT_SEQUENCE = [
  null,
  'Scanning biometrics…',
  'Verifying on-chain…',
  'Securing vault…',
]

const MOCK_ORDERS = [
  { id: 'TXN-8821', type: 'buy', amount: '500', usdc: '4.0684', method: 'bKash', time: '2m ago', status: 'confirmed' },
  { id: 'TXN-8820', type: 'sell', amount: '1,200', usdc: '9.7639', method: 'Nagad', time: '1h ago', status: 'confirmed' },
  { id: 'TXN-8819', type: 'buy', amount: '250', usdc: '2.0342', method: 'Rocket', time: '3h ago', status: 'confirmed' },
]

const QUICK_AMOUNTS = [100, 500, 1000, 2500]

/* ═══════════════════════════════════
   Hooks
   ═══════════════════════════════════ */
function useAnimNumber(target, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!target) return
    const to = parseFloat(target) || 0
    let start = null
    const tick = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 4)
      setVal(to * ease)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

/* ═══════════════════════════════════
   Components
   ═══════════════════════════════════ */

/** Animated canvas particle network */
function ParticleNet() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.2 + 0.3,
      a: Math.random() * 0.35 + 0.04,
    }))

    let raf
    const draw = () => {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of pts) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,102,255,${p.a})`
        ctx.fill()
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 110) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(0,102,255,${0.07 * (1 - d / 110)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return (
    <canvas
      ref={ref}
      className="fixed inset-0 w-full h-full opacity-55 pointer-events-none z-0"
    />
  )
}

/** CRT scanline film grain */
function Grain() {
  return (
    <div
      className="fixed inset-0 z-[999] pointer-events-none"
      style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.018) 2px, rgba(0,0,0,0.018) 4px)',
        mixBlendMode: 'multiply',
      }}
    />
  )
}

/** Horizontal scrolling price ticker */
function PriceTicker({ rate, delta, isPositive }) {
  const items = Array(8).fill(null).map((_, i) => ({
    pair: ['USDC/BDT', 'ETH/BDT', 'BTC/BDT', 'BNB/BDT'][i % 4],
    val: [rate, (rate * 95000).toFixed(0), (rate * 3400000).toFixed(0), (rate * 520).toFixed(0)][i % 4],
    sign: isPositive ? '+' : '-',
    pct: ['0.30', '1.24', '2.01', '0.55'][i % 4],
  }))

  return (
    <div className="overflow-hidden mb-4 opacity-70 relative">
      <div className="flex gap-6 animate-ticker-scroll whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-2 text-xs font-mono text-white/45">
            <span className="text-white/70 font-bold">{item.pair}</span>
            ৳{item.val}
            <span className={isPositive ? 'text-spring' : 'text-burn-orange'}>{item.sign}{item.pct}%</span>
            <span className="text-white/15 ml-1">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/** Rate card with live data */
function RateCard({ rate, delta, isPositive }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`bg-void border border-void-700 rounded-xl p-6 transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-98'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm text-white/60 mb-1">USDC / BDT</div>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-bold tracking-tight">৳{rate.toFixed(2)}</span>
            <span className="font-mono text-xs text-white/40">BDT</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-1 mb-1 ${isPositive ? 'text-spring' : 'text-burn-orange'}`}>
            {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            <span className="font-mono text-xs font-bold">{isPositive ? '+' : ''}{delta}%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-spring rounded-full animate-pulse" />
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">BASE NETWORK</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Connect / onboarding screen */
function ConnectScreen({ onConnect }) {
  const [step, setStep] = useState(0)

  const handleConnect = useCallback(() => {
    setStep(1)
    setTimeout(() => setStep(2), 850)
    setTimeout(() => setStep(3), 1700)
    setTimeout(() => {
      onConnect()
      setStep(0)
    }, 2500)
  }, [onConnect])

  const isProcessing = step > 0

  const icons = [
    <Fingerprint size={38} className="text-blue" />,
    <Scan size={38} className="text-blue animate-spin" />,
    <ShieldCheck size={38} className="text-spring" />,
    <CheckCircle2 size={38} className="text-spring" />,
  ]

  return (
    <div className="card animate-fade-up text-center p-11">
      {/* Top accent line */}
      <div className="absolute top-0 left-1/5 right-1/5 h-px bg-gradient-to-r from-transparent via-blue to-transparent opacity-70" />

      {/* Fingerprint ring */}
      <div className="relative w-30 h-30 mx-auto mb-6">
        <div className="fp-ring-outer">
          {isProcessing && <div className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-blue/30" />}
          <div className="fp-ring-inner flex items-center justify-center">
            <div className="transition-all duration-300">
              {icons[step]}
            </div>
          </div>
        </div>
      </div>

      <h2 className="font-display font-extrabold text-2xl tracking-tight mb-2.5 leading-tight">
        Secure Smart Wallet
      </h2>
      <p className="text-ash text-sm leading-relaxed mb-7 max-w-60 mx-auto">
        Biometric-gated, non-custodial access to the Base blockchain. Your keys, always.
      </p>

      {/* Step text */}
      <div className="mb-7 h-4 text-sm text-blue font-medium">
        {CONNECT_SEQUENCE[step] || ''}
      </div>

      {/* Feature bullets */}
      <div className="flex flex-col gap-2.5 mb-8 text-left">
        {[
          { icon: <Lock size={13} />, text: 'End-to-end encrypted on Base' },
          { icon: <Globe size={13} />, text: 'P2P smart escrow — zero counterparty risk' },
          { icon: <Zap size={13} />, text: '3–5 min settlement to your wallet' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2.5 text-dust text-xs">
            <div className="text-blue flex-shrink-0">{item.icon}</div>
            {item.text}
          </div>
        ))}
      </div>

      <button
        className={`btn btn-primary w-full ${isProcessing ? 'animate-shimmer' : ''}`}
        onClick={handleConnect}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Authenticating…
          </>
        ) : (
          <>
            <Fingerprint size={18} className="mr-2" />
            Connect Smart Wallet
          </>
        )}
      </button>

      <p className="font-mono text-xs text-dust mt-4.5 flex items-center justify-center gap-1.5">
        <ShieldCheck size={12} />
        Non-custodial · Open source · Base L2
      </p>
    </div>
  )
}

/** Trade panel (buy/sell form) */
function TradePanel({ activeTab, walletAddress }) {
  const [selectedMethod, setSelectedMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [status, setStatus] = useState(null) // null | 'success'

  const usdc = amount ? (parseFloat(amount) / RATE).toFixed(4) : '0.0000'
  const hasInput = parseFloat(amount) > 0

  const handleSubmit = useCallback(() => {
    if (!amount || !selectedMethod) return
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setStatus('success')
    }, 2400)
  }, [amount, selectedMethod])

  const reset = useCallback(() => {
    setStatus(null)
    setAmount('')
    setSelectedMethod('')
  }, [])

  /* — Success — */
  if (status === 'success') {
    return (
      <div className="card animate-scale-in text-center p-12">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-spring/30 animate-pulse-ring" />
          <div className="w-full h-full rounded-full bg-void flex items-center justify-center">
            <CheckCircle2 size={32} className="text-spring animate-success-bounce" />
          </div>
        </div>
        <h3 className="font-display font-extrabold text-xl tracking-tight mb-2">
          Order Complete
        </h3>
        <p className="text-ash text-sm mb-2.5">
          Assets secured in your Base wallet
        </p>
        <div className="font-mono text-sm text-spring mb-2">
          +{usdc} USDC confirmed
        </div>
        <div className="font-mono text-xs text-dust mb-9">
          via {PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}
        </div>

        <div className="flex gap-2.5">
          <button className="btn flex-1 h-12 text-xs bg-s-200 border-rim text-ash">
            <ExternalLink size={14} className="mr-1.5" />
            View on Explorer
          </button>
          <button className="btn btn-primary flex-1 h-12 text-sm" onClick={reset}>
            New Trade
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card animate-fade-up">
      {/* ── Amount section ── */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-sm text-white/70">You {activeTab === 'buy' ? 'Pay' : 'Send'} (BDT)</span>
          <span className="font-mono text-[10px] text-dust uppercase tracking-wider">
            RATE ৳{RATE}
          </span>
        </div>

        <div className="amount-field relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-mono text-white/60">৳</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-transparent border-none outline-none text-right text-lg font-mono text-white pr-12"
          />
          {hasInput && (
            <button
              onClick={() => setAmount('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-s-300 border-none text-dust rounded px-2 py-1 text-xs cursor-pointer"
            >
              CLR
            </button>
          )}
        </div>

        <div className={`text-xs text-dust mt-2 transition-opacity ${hasInput ? 'opacity-100' : 'opacity-0'}`}>
          ≈ <strong className="text-white">{usdc}</strong> USDC
          <span className="ml-1.5">on Base</span>
        </div>
      </div>

      {/* ── Quick amounts ── */}
      <div className="mb-6">
        <div className="text-xs text-dust mb-3 uppercase tracking-wider">Quick Amount</div>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt.toString())}
              className="btn-secondary text-xs h-10"
            >
              ৳{amt}
            </button>
          ))}
        </div>
      </div>

      {/* ── Payment method ── */}
      <div className="mb-6">
        <div className="text-xs text-dust mb-3 uppercase tracking-wider">
          Payment Method
        </div>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`method-btn w-full ${selectedMethod === method.id ? 'selected' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: method.color + '20', color: method.color }}
                >
                  {method.glyph}
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">{method.name}</div>
                  <div className="text-xs text-white/50">{method.tagline}</div>
                </div>
              </div>
              <div className="text-xs text-white/50">{method.fee} fee</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Escrow banner ── */}
      <div className="bg-s-100 border border-rim rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <ShieldCheck size={16} className="text-spring mt-0.5 flex-shrink-0" />
          <div>
            <div className="text-xs font-medium text-white mb-1">Smart Escrow Protection</div>
            <div className="text-xs text-dust leading-relaxed">
              Funds are held in a non-custodial smart contract until confirmation. Zero counterparty risk.
            </div>
          </div>
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        className={`btn btn-primary w-full h-12 text-sm font-medium ${
          hasInput && selectedMethod ? 'animate-glow-pulse' : 'opacity-50 cursor-not-allowed'
        }`}
        onClick={handleSubmit}
        disabled={!hasInput || !selectedMethod || isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Processing…
          </>
        ) : (
          <>
            {activeTab === 'buy' ? <ArrowDownLeft size={16} className="mr-2" /> : <ArrowUpRight size={16} className="mr-2" />}
            {activeTab === 'buy' ? 'Buy' : 'Sell'} {usdc} USDC
          </>
        )}
      </button>
    </div>
  )
}

/** Orders panel */
function OrdersPanel() {
  return (
    <div className="card animate-slide-in-left">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-lg">Recent Orders</h3>
        <button className="text-dust hover:text-white transition-colors">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_ORDERS.map((order) => (
          <div key={order.id} className="bg-s-100 border border-rim rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  order.type === 'buy' ? 'bg-spring/20 text-spring' : 'bg-burn-orange/20 text-burn-orange'
                }`}>
                  {order.type.toUpperCase()}
                </div>
                <span className="font-mono text-xs text-dust">{order.id}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-dust">
                <Clock size={12} />
                {order.time}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="font-mono text-sm">৳{order.amount}</div>
                <div className="text-xs text-dust">{order.usdc} USDC</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-dust">{order.method}</div>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 size={12} className="text-spring" />
                  <span className="text-xs text-spring">Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Wallet panel */
function WalletPanel({ walletAddress }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [walletAddress])

  return (
    <div className="card animate-slide-in-right">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display font-bold text-lg">Wallet</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-spring rounded-full animate-pulse" />
          <span className="text-xs text-spring font-medium">Connected</span>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-gradient-to-r from-blue/10 to-spring/10 border border-blue/20 rounded-lg p-4 mb-6">
        <div className="text-sm text-dust mb-1">Total Balance</div>
        <div className="font-mono text-2xl font-bold text-white">12.4567 USDC</div>
        <div className="text-xs text-dust mt-1">≈ ৳1,525.23</div>
      </div>

      {/* Address */}
      <div className="mb-6">
        <div className="text-sm text-dust mb-2">Wallet Address</div>
        <div className="flex items-center gap-2 p-3 bg-void-800 border border-rim rounded-lg">
          <span className="font-mono text-sm text-white flex-1 truncate">
            {walletAddress}
          </span>
          <button
            onClick={handleCopy}
            className="text-dust hover:text-white transition-colors"
          >
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="wallet-chip">
            <Globe size={10} />
            Base
          </div>
          <div className="wallet-chip">
            <ShieldCheck size={10} />
            Non-custodial
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="btn-secondary h-12 text-sm">
          <ExternalLink size={16} className="mr-2" />
          Explorer
        </button>
        <button className="btn-secondary h-12 text-sm">
          <Settings size={16} className="mr-2" />
          Settings
        </button>
      </div>
    </div>
  )
}

/** Stats grid */
function StatsGrid() {
  const stats = [
    { label: '24h Volume', value: '৳2.4M', change: '+12.5%', positive: true },
    { label: 'Active Users', value: '1,247', change: '+8.2%', positive: true },
    { label: 'Avg. Settlement', value: '3.2m', change: '-0.3%', positive: false },
    { label: 'Success Rate', value: '99.7%', change: '+0.1%', positive: true },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div key={i} className="stat-card animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
          <div className="value">{stat.value}</div>
          <div className="label">{stat.label}</div>
          <div className={`text-xs mt-1 ${stat.positive ? 'text-spring' : 'text-burn-orange'}`}>
            {stat.change}
          </div>
        </div>
      ))}
    </div>
  )
}

/** Bottom navigation */
function BottomNav({ activeTab, onTabChange }) {
  return (
    <div className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
        >
          <item.icon className="icon" />
          <span className="label">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════
   Main App
   ═══════════════════════════════════ */
export default function App() {
  const [connected, setConnected] = useState(false)
  const [activeTab, setActiveTab] = useState('trade')
  const [walletAddress] = useState('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')

  if (!connected) {
    return (
      <div className="min-h-screen bg-void text-rim flex items-center justify-center p-4">
        <ParticleNet />
        <Grain />
        <div className="w-full max-w-sm">
          <ConnectScreen onConnect={() => setConnected(true)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void text-rim">
      <ParticleNet />
      <Grain />

      {/* Header */}
      <div className="sticky top-0 z-50 bg-void/80 backdrop-blur-sm border-b border-rim p-4">
        <div className="max-w-md mx-auto">
          <PriceTicker rate={RATE} delta={RATE_DELTA_PCT} isPositive={IS_POSITIVE} />
          <RateCard rate={RATE} delta={RATE_DELTA_PCT} isPositive={IS_POSITIVE} />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-md mx-auto p-4 pb-24">
        <StatsGrid />

        {/* Tab rail */}
        <div className="tab-rail mb-6">
          {['buy', 'sell'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Panels */}
        {activeTab === 'buy' || activeTab === 'sell' ? (
          <TradePanel activeTab={activeTab} walletAddress={walletAddress} />
        ) : activeTab === 'orders' ? (
          <OrdersPanel />
        ) : (
          <WalletPanel walletAddress={walletAddress} />
        )}
      </div>

      {/* Bottom nav */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}