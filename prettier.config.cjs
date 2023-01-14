/** @type {import("prettier").Config} */
module.exports = {
  singleQuote: true,
  jsxSingleQuote: true,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
};
