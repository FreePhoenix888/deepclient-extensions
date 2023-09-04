import { DeepClientInstance } from "@deep-foundation/deeplinks/imports/client";
import { MakeInstallPackagesOperationsOptions } from "./main";
import { PackageInstallerDecorator } from "./package-installer-decorator.ts/create-package-installer-decorator";

export async function installPackages<TDeepClient extends DeepClientInstance>(
  this: PackageInstallerDecorator<TDeepClient>,
  options: InstallPackagesOptions,
) {
  const operations = await this.makeInstallPackagesOperations(options);
  return this.serial({ operations: Object.values(operations).flat() });
}

export type InstallPackagesOptions = MakeInstallPackagesOperationsOptions;
