import {generateDocumentation} from '@deep-foundation/npm-automation'

main().catch(console.error);

async function main() {
  await generateDocumentation({
    generateCliAppsHelpInReadmeOptions: null,
    generateUsageWaysOfNpmCliAppsInMarkdownFormatOptions: null,
  });
}