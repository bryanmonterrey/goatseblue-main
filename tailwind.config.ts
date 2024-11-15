import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			azul: '#74FFCC',
        darkblue: '#131020',
  		},
  		fontFamily: {
  			sportesia: ['sportesia', 'monospace'],
  			verminy: ['vermin1', 'monospace'],
  			verminyv: ['verminV', 'monospace'],
        goatse: ['goatse', 'monospace'],
        courier: ['courier', 'monospace'],
		inter: ['inter', 'monospace']
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
