import {
  DeepClientInstance,
  Table,
} from "@deep-foundation/deeplinks/imports/client";
import { SerialTransitionsBuilderDecorator } from "./create-serial-transitions-builder-decorator";
import { Transition } from "./transition";
import { SerialAction } from "./serial-action";
import {
  deleteMutation,
  insertMutation,
  updateMutation,
} from "@deep-foundation/deeplinks/imports/gql";

export function append<TDeepClient extends DeepClientInstance>(
  this: SerialTransitionsBuilderDecorator<TDeepClient>,
  ...options: AppendTransitionOptions[]
) {
  for (const optionsItem of options) {
    const { table = this.defaultTable, transition } = optionsItem;
    const transitionType = this.getTransitionType(transition);
    const index = this.serialActions.length;
    let serialAction: SerialAction;
    switch (transitionType) {
      case "insert":
        serialAction = {
          mutation: insertMutation(table, { objects: transition[1] }),
          index,
          transitionType,
          table: table as Table<"insert">,
        };
        break;
      case "update":
        serialAction = {
          mutation: updateMutation(table, {
            exp: transition[0],
            value: transition[1],
          }),
          index,
          transitionType,
          table: table as Table<"update">,
        };
        break;
      case "delete":
        serialAction = {
          mutation: deleteMutation(table, { exp: transition[0] }),
          index,
          transitionType,
          table: table as Table<"delete">,
        };
        break;
      default:
        throw new Error(
          "Invalid transition type. If you want to insert link - the first element must be null and the second must be link. If you want to update link - the first and second elements must be links. If you want to delete link - the first element must be link and second must be null",
        );
    }
    serialAction.alias =
      optionsItem.alias ?? `${transitionType}_${table}_${index}`;
    this.serialActions.push(serialAction);
  }
  return this;
}

export interface AppendTransitionOptions {
  /**
   * A transition to append
   *
   * If you want to insert link - the first element must be null and the second must be link. If you want to update link - the first and second elements must be links. If you want to delete link - the first element must be link and second must be null
   */
  transition: Transition;
  /**
   * A table name where operation must be executed
   *
   * @defaultValue 'links'
   */
  table?: Table<
    Transition[0] extends null
      ? "insert"
      : Transition[1] extends null
      ? "delete"
      : "update"
  >;
  alias?: string;
}
