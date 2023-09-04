import {
  DeepClient,
  DeepClientInstance,
  SerialOperation,
} from "@deep-foundation/deeplinks/imports/client";
import { MutationInputLink } from "@deep-foundation/deeplinks/imports/client_types";
import { createSerialOperation } from "@deep-foundation/deeplinks/imports/gql";
import { PackageInstallerDecorator } from "./create-package-installer-decorator";

export async function makeInstallPackagesOperations<
  TDeepClient extends DeepClientInstance,
>(
  this: PackageInstallerDecorator<TDeepClient>,
  options: MakeInstallPackagesOperationsOptions,
): Promise<InstallPackagesOperationsPerPackageName> {
  const {
    deep,
    packagesData,
    typeLinkIds: {
      containTypeLinkId = await deep.id("@deep-foundation/core", "Contain"),
      installTypeLinkId = await deep.id(
        "@deep-foundation/npm-packager",
        "Install",
      ),
      packageQueryTypeLinkId = await deep.id(
        "@deep-foundation/core",
        "PackageQuery",
      ),
    },
  } = options;

  const serialOperationsPerPackageName =
    packagesData.reduce<InstallPackagesOperationsPerPackageName>(
      (serialOperationsPerPackageName, packageData) => {
        const { name, installLinkId, containerLinkId, containData } =
          packageData;
        const serialOperations: Array<SerialOperation> = [];

        const insertData: MutationInputLink = {
          type_id: installTypeLinkId,
          from_id: containerLinkId,
          to: {
            data: {
              type_id: packageQueryTypeLinkId,
              string: { data: { value: name } },
            },
          },
        };

        if (installLinkId) {
          insertData.id = installLinkId;
        }

        if (containData) {
          const { linkId, value } = packageData.containData ?? {};
          const containInsertData: MutationInputLink = {
            type_id: containTypeLinkId,
            from_id: containerLinkId,
          };
          if (linkId !== null) {
            containInsertData.id = linkId;
          }
          if (value !== null) {
            containInsertData.string = {
              data: { value: value ?? `Install${name}` },
            };
          }

          serialOperations.push(
            createSerialOperation({
              table: "links",
              type: "insert",
              objects: containInsertData,
            }),
          );
        }

        serialOperations.push(
          createSerialOperation({
            table: "links",
            type: "insert",
            objects: insertData,
          }),
        );

        serialOperationsPerPackageName[name] = serialOperations;

        return serialOperationsPerPackageName;
      },
      {},
    );

  return serialOperationsPerPackageName;
}

export interface MakeInstallPackagesOperationsOptions {
  deep: DeepClient;
  packagesData: Array<{
    name: string;
    installLinkId?: number | undefined;
    containerLinkId?: number | undefined;
    containData?:
      | {
          linkId?: number | undefined;
          value?: string | undefined | null;
        }
      | undefined;
  }>;
  typeLinkIds: {
    containTypeLinkId?: number | undefined;
    installTypeLinkId?: number | undefined;
    packageQueryTypeLinkId?: number | undefined;
  };
}

export type PackageName = string;
export type InstallPackagesOperationsPerPackageName = Record<
  PackageName,
  Array<SerialOperation>
>;
