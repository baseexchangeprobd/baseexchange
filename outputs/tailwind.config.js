/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        'base-blue':    '#0052FF',
        'base-blue-dk': '#003FCC',
        'chain-green':  '#00E87A',
        'burn-orange':  '#FF6B35',
        'bkash-red':    '#D12053',
        'nagad-orange': '#F15A22',
        'rocket-violet':'#7B2FBE',
        'electric-purple': '#8B5CF6',
        'cyber-pink': '#EC4899',
        'neon-yellow': '#F59E0B',
        'spring-green': '#00FF88',

        // Surface system
        'void':   '#030712',
        'cosmos': '#060d1f',
        's-100':  'rgba(255,255,255,0.03)',
        's-200':  'rgba(255,255,255,0.06)',
        's-300':  'rgba(255,255,255,0.10)',

        // Borders
        'rim':         'rgba(255,255,255,0.07)',
        'rim-active':  'rgba(0,82,255,0.45)',
        'rim-success': 'rgba(0,232,122,0.30)',

        // Text
        'dust':  'rgba(255,255,255,0.35)',
        'ash':   'rgba(255,255,255,0.55)',
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        mono:    ['"Space Mono"', '"Courier New"', 'monospace'],
        body:    ['Syne', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow-blue':    '0 0 40px rgba(0,82,255,0.25), 0 0 80px rgba(0,82,255,0.10)',
        'glow-green':   '0 0 40px rgba(0,232,122,0.20)',
        'glow-orange':  '0 0 40px rgba(255,107,53,0.25)',
        'glow-purple':  '0 0 40px rgba(139,92,246,0.25)',
        'glow-pink':    '0 0 40px rgba(236,72,153,0.25)',
        'card':         '0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.4) inset',
        'btn-blue':     '0 8px 32px rgba(0,82,255,0.40), 0 2px 8px rgba(0,82,255,0.20)',
        'btn-orange':   '0 8px 32px rgba(255,107,53,0.35), 0 2px 8px rgba(255,107,53,0.20)',
      },
      animation: {
        'pulse-slow':     'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':      'spin 3s linear infinite',
        'float':          'float 6s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'scan':           'scanDown 1.2s ease-in-out infinite',
        'fade-up':        'fadeUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-in':       'slideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'glow-pulse':     'glowPulse 2s ease-in-out infinite',
        'ticker-scroll':  'tickerScroll 20s linear infinite',
        'pulse-ring':     'pulseRing 1s ease-out infinite',
        'success-bounce': 'successBounce 1s ease-out',
        'scale-in':       'scaleIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left':  'slideInLeft 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        scanDown: {
          '0%':   { top: '0%',   opacity: '0.8' },
          '100%': { top: '100%', opacity: '0'   },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to:   { opacity: '1', transform: 'translateX(0)'      },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,82,255,0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(0,82,255,0.6)' },
        },
        tickerScroll: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
        successBounce: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        scaleIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to:   { transform: 'scale(1)', opacity: '1' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to:   { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to:   { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
        'grid-lines': "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        'blue-radial': 'radial-gradient(ellipse at center, rgba(0,82,255,0.15) 0%, transparent 70%)',
        'green-radial': 'radial-gradient(ellipse at center, rgba(0,232,122,0.10) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
}
