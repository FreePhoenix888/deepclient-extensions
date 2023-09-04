import { DeepClientInstance } from "@deep-foundation/deeplinks/imports/client";
import { SerialTransitionsBuilderDecorator } from "./create-serial-transitions-builder-decorator";

export function clear<TDeepClient extends DeepClientInstance>(
  this: SerialTransitionsBuilderDecorator<TDeepClient>
) {
  this.serialActions = [];
  return this;
}