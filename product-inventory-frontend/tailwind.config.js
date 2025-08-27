/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: false, 
    themes: [
      {
        light: {
          primary: "#2563eb",
          secondary: "#7c3aed",
          accent: "#f59e0b",
          neutral: "#3d4451",
          "base-100": "#ffffff",
          "base-200": "#f9fafb",
          "base-300": "#e5e7eb",
          "base-content": "#1f2937",
        },
      },
      {
        mydark: { // 👈 now you can safely call it "dark"
          primary: "#60a5fa",
          secondary: "#c084fc",
          accent: "#fbbf24",
          neutral: "#0f172a",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f8fafc",
          info: "#38bdf8",
          success: "#34d399",
          warning: "#fbbf24",
          error: "#f87171",
        },
      },
      {
        black: {
          
        }
      }, 
    ],
  },
  plugins: [require("daisyui")],
};
