/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-green': '#39FF14',
                'slate-950': '#020617',
                'slate-50': '#F8FAFC',
            },
        },
    },
    plugins: [],
}
