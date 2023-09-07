import { MinilinkCollection } from "@deep-foundation/deeplinks/imports/minilinks";
import { MinilinksDecorator } from "./create-minilinks-decorator";

export function id(this: MinilinksDecorator, pathItems: IdParam) {
  const result = this.idOrNull(pathItems);
  if (result === null)
    throw new Error(
      `Minilink Error: id not found by path ${pathItems.join("/")}`,
    );
  return result;
}

export type IdParam = [string, ...Array<string>];
