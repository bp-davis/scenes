/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
    theme: {
        extend: {
            boxShadow: {
                'custom-red': '0 0 15px 4px rgba(255,0,0,0.8)',
                'custom-orange': '0 0 15px 4px rgba(255,165,0,0.8)',
            },
        },
    },
    plugins: [],
};
