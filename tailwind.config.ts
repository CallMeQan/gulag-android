module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}", // add this for shadcn components
    ],
    theme: {
        extend: {},
    },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [require("tw-animate-css")], // Ensure you have this
}