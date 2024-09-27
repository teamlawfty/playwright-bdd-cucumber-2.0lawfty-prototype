const common = [
  'features/**/Sign-In.feature', // Specify your feature files
  'features/**/NewInquiryFormFields.feature',
  '--require-module ts-node/register', // Load TypeScript module
  '--require step-definitions/Sign-In.steps.ts',
  // '--require step-definitions/NewInquiryFormFields.steps.ts', // Load step definitions
  '--require step-definitions/generic.steps.ts',
  '--format progress', // Show progress during test execution
  '--parallel 0'
].join(' ');

module.exports = {
  default: common,
};