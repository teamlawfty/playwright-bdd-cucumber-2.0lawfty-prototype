/* eslint-disable @typescript-eslint/no-require-imports */
export default {
  // eslint-disable-next-line no-undef
  ...require('gts/.prettierrc.json'),
  // Custom overrides for some inherited default rules, based on pour preferences
  semi: false, // Don't force semi-column line endings, although it's the suggested approach
  bracketSpacing: true, // Preserve spacing between brackets
  printWidth: 120, // Increase the max line-wrap limit
  endOfLine: 'auto',
}
