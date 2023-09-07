import { MinilinksDecorator } from "./create-minilinks-decorator";
import { IdParam } from "./id";

export function idOrNull(this: MinilinksDecorator, pathItems: IdOrNullParam) {
  const result = this.query({
    id: {
      _id: pathItems,
    },
  });
  if (result.length === 0) return null;
  return result[0].id;
}

export type IdOrNullParam = IdParam;
