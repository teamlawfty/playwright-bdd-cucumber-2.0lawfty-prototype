module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,  // No semicolons
  bracketSpacing: true,
  endOfLine: 'auto',
  plugins: ['prettier-plugin-gherkin'],  // Add Gherkin plugin to format .feature files
};
