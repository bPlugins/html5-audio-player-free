/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,js}"], // Adjust paths to your files
    theme: {
        extend: {},
    },
    plugins: [],
    corePlugins: {
        preflight: false, // Disable Tailwind's reset/base styles
        backdropSaturate: false,
        backdropSepia: false,
    },
    mode: "jit",
    purge: ["./src/**/*.{js,ts,jsx,tsx,html}"],
};