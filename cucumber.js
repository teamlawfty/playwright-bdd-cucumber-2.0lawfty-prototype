const common = [
    'features/**/*.feature', // Specify your feature files
    '--require-module ts-node/register', // Load TypeScript module
    '--require step-definitions/**/*.ts', // Load step definitions
    '--format progress', // Show progress during test execution
  ].join(' ');
  
  module.exports = {
    default: common,
  };