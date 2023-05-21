import { DeepClient } from '@deep-foundation/deeplinks/imports/client';
import { createSerialOperation } from '@deep-foundation/deeplinks/imports/gql';

export async function insertRouteHandler(
  this: DeepClient,
  param: InsertRouteHandlerParam
) {
  const {
    code,
    port,
    route,
    typeLinkIds: {
      supportsJsLinkId,
      containTypeLinkId = await this.id('@deep-foundation/core', 'Contain'),
      handleRouteLinkId = await this.id('@deep-foundation/core', 'HandleRoute'),
      handlerTypeLinkId = await this.id('@deep-foundation/core', 'Handler'),
      portTypeLinkId = await this.id('@deep-foundation/core', 'Port'),
      routeTypeLinkId = await this.id('@deep-foundation/core', 'Route'),
      routerListeningLinkId = await this.id(
        '@deep-foundation/core',
        'RouterListening'
      ),
      routerStringUseTypeLinkId = await this.id(
        '@deep-foundation/core',
        'RouterStringUse'
      ),
      routerTypeLinkId = await this.id('@deep-foundation/core', 'Router'),
      syncTextFileTypeLinkId = await this.id(
        '@deep-foundation/core',
        'SyncTextFile'
      ),
    },
    ownerLinkId = this.linkId,
  } = param;

  const linksIdsToReserveCount = Object.keys(param.linkIds).length;
  let reservedIds: Array<number>;
  if (linksIdsToReserveCount > 0) {
    reservedIds = await this.reserve(linksIdsToReserveCount);
  }
  const {
    linkIds: {
      handlerLinkId = reservedIds!.pop(),
      portLinkId = reservedIds!.pop(),
      routeLinkId = reservedIds!.pop(),
      routerLinkId = reservedIds!.pop(),
      routerStringUseLinkId = reservedIds!.pop(),
      syncTextFileLinkId = reservedIds!.pop(),
    },
  } = param;

  await this.serial({
    operations: [
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          id: syncTextFileLinkId,
          type_id: syncTextFileTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
            },
          },
        },
      }),
      createSerialOperation({
        table: 'strings',
        type: 'insert',
        objects: {
          link_id: syncTextFileLinkId,
          value: code,
        },
      }),
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          id: handlerLinkId,
          type_id: handlerTypeLinkId,
          from_id: supportsJsLinkId,
          to_id: syncTextFileLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
            },
          },
        },
      }),
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          id: routeLinkId,
          type_id: routeTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
            },
          },
        },
      }),
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          type_id: handleRouteLinkId,
          from_id: routeLinkId,
          to_id: handlerLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
            },
          },
        },
      }),
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          id: routerLinkId,
          type_id: routerTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
            },
          },
        },
      }),
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          id: routerStringUseLinkId,
          type_id: routerStringUseTypeLinkId,
          from_id: routeLinkId,
          to_id: routerLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
            },
          },
        },
      }),
      createSerialOperation({
        table: 'strings',
        type: 'insert',
        objects: {
          link_id: routerStringUseLinkId,
          value: route,
        },
      }),
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          id: portLinkId,
          type_id: portTypeLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
            },
          },
        },
      }),
      createSerialOperation({
        table: 'numbers',
        type: 'insert',
        objects: {
          link_id: portLinkId,
          value: port,
        },
      }),
      createSerialOperation({
        table: 'links',
        type: 'insert',
        objects: {
          type_id: routerListeningLinkId,
          from_id: routerLinkId,
          to_id: portLinkId,
          in: {
            data: {
              type_id: containTypeLinkId,
              from_id: ownerLinkId,
            },
          },
        },
      }),
    ],
  });
}

export interface InsertRouteHandlerParam {
  code: string;
  route: string;
  port: number;
  ownerLinkId?: number;
  typeLinkIds: {
    supportsJsLinkId: number;
    syncTextFileTypeLinkId?: number;
    containTypeLinkId?: number;
    handlerTypeLinkId?: number;
    routeTypeLinkId?: number;
    handleRouteLinkId?: number;
    routerTypeLinkId?: number;
    routerStringUseTypeLinkId?: number;
    portTypeLinkId?: number;
    routerListeningLinkId?: number;
  };
  linkIds: {
    syncTextFileLinkId?: number;
    handlerLinkId?: number;
    routeLinkId?: number;
    routerStringUseLinkId?: number;
    routerLinkId?: number;
    portLinkId?: number;
  };
}
