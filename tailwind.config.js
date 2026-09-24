/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        heritage: {
          crimson: '#9b1b30',     // Đỏ son cung đình
          ruby: '#c02739',        // Đỏ bảo ngọc
          gold: '#cba135',        // Vàng hoàng kim
          amber: '#e5a93b',       // Vàng hổ phách
          indigo: '#1a365d',      // Xanh chàm
          teal: '#0d5c75',        // Xanh cổ vịt
          jade: '#2d6a4f',        // Xanh ngọc bích
          silk: '#fcf8f2',        // Trắng tơ lụa
          ink: '#111827',         // Đen mực xạ
          charcoal: '#1f242d',    // Xám than cổ phong
          purple: '#5e2a84',      // Tím cố đô Huế
        },
        genz: {
          neonPink: '#ff2a85',
          neonCyan: '#00f2fe',
          neonLime: '#b8ff00',
          cyberViolet: '#8a2be2',
          hologram: '#ff77e9',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', '"Be Vietnam Pro"', 'serif'],
        sans: ['"Be Vietnam Pro"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(203, 161, 53, 0.45)',
        'glow-crimson': '0 0 25px rgba(155, 27, 48, 0.45)',
        'glow-cyan': '0 0 25px rgba(0, 242, 254, 0.45)',
        'glow-neon': '0 0 25px rgba(184, 255, 0, 0.45)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(203, 161, 53, 0.4))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(203, 161, 53, 0.8))' },
        }
      }
    },
  },
  plugins: [],
}
