import { MinilinkCollection } from "@deep-foundation/deeplinks/imports/minilinks";
import { id } from "./id";
import { idOrNull } from "./id-or-null";

export function createMinilinksDecorator<TMinilinks extends MinilinkCollection>(
  minilinks: TMinilinks,
): MinilinksDecorator<TMinilinks> {
  const result: MinilinksDecorator<TMinilinks> = Object.assign(
    {
      id: id,
      idOrNull: idOrNull,
    } as MinilinksDecorator<TMinilinks>,
    minilinks,
  );
  return result;
}

export type MinilinksDecorator<
  TMinilinks extends MinilinkCollection = MinilinkCollection,
> = TMinilinks & {
  id: typeof id;
  idOrNull: typeof idOrNull;
};
