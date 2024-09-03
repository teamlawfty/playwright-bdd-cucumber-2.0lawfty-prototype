const fs = require('fs');
const path = require('path');

// Get the feature file path from the command-line arguments
const featureFilePath = process.argv[2];

if (!featureFilePath) {
  console.error('Please provide the path to the feature file.');
  process.exit(1);
}

// Read the feature file
const featureContent = fs.readFileSync(featureFilePath, 'utf-8');

// Extract Gherkin steps with the keyword
const stepRegex = /(Given|When|Then|And) (.+)/g;
const steps = [];
let match;
while ((match = stepRegex.exec(featureContent)) !== null) {
  steps.push({ keyword: match[1], step: match[2] });
}

// Generate step definitions with imports
const cucumberImports = `
import { Given, When, Then } from '@cucumber/cucumber';
`;

let previousKeyword = null;
const stepDefinitions = steps.map(({ keyword, step }) => {
  if (keyword === 'And') {
    keyword = previousKeyword;
  } else {
    previousKeyword = keyword;
  }
  
  return `
    ${keyword}('${step}', async () => {
      // Implement this step
    });
  `;
}).join('\n');

// Combine imports with step definitions
const fileContent = cucumberImports + stepDefinitions;

// Generate the output file path
const outputFileName = path.basename(featureFilePath, '.feature') + '.steps.ts';
const outputFilePath = path.resolve(__dirname, '../step-definitions', outputFileName);

// Ensure the output directory exists
const outputDir = path.dirname(outputFilePath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the step definitions to the file
fs.writeFileSync(outputFilePath, fileContent);

console.log(`Step definitions written to ${outputFilePath}`);
