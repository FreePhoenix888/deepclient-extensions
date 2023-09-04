import {
  DeepClientInstance,
  Table,
} from "@deep-foundation/deeplinks/imports/client.js";
import { debug } from "../debug.js";
import {
  IGenerateMutationBuilder,
  ISerialOptions,
} from "@deep-foundation/deeplinks/imports/gql/index.js";
import { MutationInputLink } from "@deep-foundation/deeplinks/imports/client_types.js";
import { append } from "./append.js";
import { SerialAction } from "./serial-action.js";
import { getTransitionType } from "./get-transition-type.js";
import { ExecuteOptions, execute } from "./execute.js";
import { clear } from "./clear.js";

export function createSerialTransitionsBuilderDecorator<
  TDeepClient extends DeepClientInstance,
>(
  options: CreateTransitionBuilderDecoratorOptions<TDeepClient>,
): SerialTransitionsBuilderDecorator<TDeepClient> {
  const log = debug(
    `@deep-foundation/capacitor-device:${createSerialTransitionsBuilderDecorator.name}`,
  );
  log({ options });
  const { deep, defaultTable = "links", executeOptions } = options;
  const decorator: SerialTransitionsBuilderDecorator<TDeepClient> =
    Object.assign(
      {
        serialActions: [] as Array<SerialAction>,
        defaultTable,
        executeOptions,
        getTransitionType,
        append,
        execute,
        clear,
      } as SerialTransitionsBuilderDecorator<TDeepClient>,
      deep,
    );
  log({ decorator });
  return decorator;
}

export type CreateTransitionBuilderDecoratorOptions<
  TDeepClient extends DeepClientInstance,
> = Pick<SerialTransitionsBuilderDecorator<TDeepClient>, "deep"> &
  Partial<
    Pick<
      SerialTransitionsBuilderDecorator<TDeepClient>,
      "defaultTable" | "executeOptions"
    >
  >;

export type SerialTransitionsBuilderDecorator<
  TDeepClient extends DeepClientInstance,
> = TDeepClient & {
  deep: TDeepClient;
  defaultTable: string;
  executeOptions?: ExecuteOptions;
  serialActions: Array<SerialAction>;
  getTransitionType: typeof getTransitionType;
  append: typeof append;
  execute: typeof execute;
  clear: typeof clear;
};
