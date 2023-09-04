import { DeepClientInstance } from "@deep-foundation/deeplinks/imports/client";
import { makeInstallPackagesOperations } from "../main";
import { debug } from "../debug";
import { installPackages } from "./install-packages";

export function createPackageInstallerDecorator<
  TDeepClient extends DeepClientInstance,
>(deep: TDeepClient): PackageInstallerDecorator<TDeepClient> {
  const log = debug(
    `@deep-foundation/capacitor-device:${createPackageInstallerDecorator.name}`,
  );
  const decorator: PackageInstallerDecorator<TDeepClient> = Object.assign(
    {
      makeInstallPackagesOperations: makeInstallPackagesOperations,
      installPackages: installPackages,
    } as PackageInstallerDecorator<TDeepClient>,
    deep,
  );
  log({ decorator });
  return decorator;
}

export type PackageInstallerDecorator<TDeepClient extends DeepClientInstance> =
  TDeepClient & {
    makeInstallPackagesOperations: typeof makeInstallPackagesOperations;
    installPackages: typeof installPackages;
  };
