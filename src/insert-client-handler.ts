import { DeepClient } from "@deep-foundation/deeplinks/imports/client";
import { createSerialOperation } from "@deep-foundation/deeplinks/imports/gql";

export async function insertClientHandler(
  this: DeepClient,
  param: InsertClientHandlerParam,
) {
  const {
    ownerLinkId = this.linkId,
    triggerTypeLinkId,
    supportsJsLinkId,
    code,
    fileWithHandlerCodeName,
    handleName,
    handlerName,
    handleClientTypeLinkId,
    typeLinkIds: {
      containTypeLinkId = await this.id("@deep-foundation/core", "Contain"),
      handlerTypeLinkId = await this.id("@deep-foundation/core", "Handler"),
      syncTextFileTypeLinkId = await this.id(
        "@deep-foundation/core",
        "SyncTextFile",
      ),
    },
  } = param;

  const linksIdsToReserveCount = Object.keys(param.linksIds).length;
  let reservedIds: Array<number>;
  if (linksIdsToReserveCount > 0) {
    reservedIds = await this.reserve(linksIdsToReserveCount);
  }
  const {
    linksIds: {
      syncTextFileLinkId = reservedIds!.pop(),
      handlerLinkId = reservedIds!.pop(),
    },
  } = param;

  await this.serial({
    operations: [
      createSerialOperation({
        table: "links",
        type: "insert",
        objects: {
          id: syncTextFileLinkId,
          type_id: syncTextFileTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
              ...(fileWithHandlerCodeName && {
                string: { data: { value: fileWithHandlerCodeName } },
              }),
            },
          },
        },
      }),
      createSerialOperation({
        table: "strings",
        type: "insert",
        objects: {
          link_id: syncTextFileLinkId,
          value: code,
        },
      }),
      createSerialOperation({
        table: "links",
        type: "insert",
        objects: {
          id: handlerLinkId,
          type_id: handlerTypeLinkId,
          from_id: supportsJsLinkId,
          to_id: syncTextFileLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
              ...(handlerName && {
                string: { data: { value: handlerName } },
              }),
            },
          },
        },
      }),
      createSerialOperation({
        table: "links",
        type: "insert",
        objects: {
          type_id: handleClientTypeLinkId,
          from_id: triggerTypeLinkId,
          to_id: handlerLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
              ...(handleName && {
                string: { data: { value: handleName } },
              }),
            },
          },
        },
      }),
    ],
  });
}

export interface InsertClientHandlerParam {
  code: string;
  triggerTypeLinkId: number;
  supportsJsLinkId: number;
  handleClientTypeLinkId: number;
  typeLinkIds: {
    containTypeLinkId?: number;
    handlerTypeLinkId?: number;
    portTypeLinkId?: number;
    syncTextFileTypeLinkId?: number;
  };
  ownerLinkId?: number;
  fileWithHandlerCodeName?: string;
  handlerName?: string;
  handleName?: string;
  linksIds: {
    handlerLinkId?: number;
    syncTextFileLinkId?: number;
  };
}
