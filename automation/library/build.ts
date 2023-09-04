import {buildTypescriptLibrary} from '@deep-foundation/npm-automation'

main().catch(console.error);

async function main() {
  await buildTypescriptLibrary({})
}
