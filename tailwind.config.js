/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#0291C9',
                bgBlue: '#BBECFF',
                btnGray: '#F1F5F9',
            },
        },
    },
    plugins: [],
}
