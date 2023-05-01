/** @type {import("prettier").Config} */
const config = {
    plugins: [require.resolve("prettier-plugin-tailwindcss")],
    tabWidth: 4,
    arrowParens: "avoid",
    trailingComma: "all",
};

module.exports = config;
