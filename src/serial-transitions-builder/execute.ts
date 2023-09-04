import { DeepClientInstance, DeepClientResult } from "@deep-foundation/deeplinks/imports/client.js";
import { ISerialOptions, generateSerial } from "@deep-foundation/deeplinks/imports/gql/index.js";
import { SerialTransitionsBuilderDecorator } from "./create-serial-transitions-builder-decorator.js";

export async function execute<TDeepClient extends DeepClientInstance>(
  this: SerialTransitionsBuilderDecorator<TDeepClient>,
  options: ExecuteOptions|undefined = this.executeOptions
  ): Promise<DeepClientResult<Record<string, { id: number }>>> {
  const result = await this.deep.apolloClient.mutate(generateSerial({
    actions: this.serialActions.map(serialAction => serialAction.mutation),
    ...options
  }))
  const data = result.data;
  for (const serialAction of this.serialActions) {
    const {alias, index} = serialAction;
    const oldKey = `m${serialAction.index}`;
    const newValue = {
      ...data[oldKey].returning,
      index: serialAction.index
    };
    if(alias) {
      data[alias] = newValue;
    }
    data[index] = newValue;
    delete data[oldKey]
  }
  // @ts-ignore
  return {
    ...result,
    data,
  } as Record<string, DeepClientResult<{ id: number }>>

}

export type ExecuteOptions = Omit<ISerialOptions, 'actions'>