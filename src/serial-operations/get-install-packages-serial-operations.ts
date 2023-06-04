import {
  DeepClient,
  SerialOperation,
  SerialOperationType,
} from '@deep-foundation/deeplinks/imports/client';
import { MutationInputLink } from '@deep-foundation/deeplinks/imports/client_types';
import { createSerialOperation } from '@deep-foundation/deeplinks/imports/gql';

export async function getInstallPackagesSerialoperations(
  param: GetInstallPackagesSerialOperationsParam
): Promise<Array<SerialOperation>> {
  const {
    deep,
    packagesData,
    typeLinkIds: {
      containTypeLinkId = await deep.id('@deep-foundation/core', 'Contain'),
      installTypeLinkId = await deep.id(
        '@deep-foundation/npm-packager',
        'Install'
      ),
      packageQueryTypeLinkId = await deep.id(
        '@deep-foundation/core',
        'PackageQuery'
      ),
    },
  } = param;

  const serialOperations = packagesData.map((packageData) => {
    const { name, installLinkId, containerLinkId, containData } = packageData;

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

    if(installLinkId) {
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
      insertData.in!.data = containInsertData;
    }

    return createSerialOperation({
      table: 'links',
      type: 'insert',
      objects: insertData,
    });
  });

  return serialOperations;
}

export interface GetInstallPackagesSerialOperationsParam {
  deep: DeepClient,
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
