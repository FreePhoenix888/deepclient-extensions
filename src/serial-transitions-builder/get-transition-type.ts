import { DeepClientInstance } from "@deep-foundation/deeplinks/imports/client"
import { SerialTransitionsBuilderDecorator } from "./create-serial-transitions-builder-decorator"
import { Transition, TransitionType } from "./transition"

export function getTransitionType<TDeepClient extends DeepClientInstance>(
  this: SerialTransitionsBuilderDecorator<TDeepClient>,
  transition: Transition
  ): TransitionType {
  if (transition[0] === null) {
    return 'insert'
  } else if (transition[1] === null) {
    return 'delete'
  } else if (transition[0] !== null && transition[1] !== null) {
    return 'update'
  } else {
    throw new Error('Invalid transition')
  }
}