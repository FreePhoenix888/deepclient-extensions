import { MutationInputLink } from "@deep-foundation/deeplinks/imports/client_types";

export type TransitionInsertType = "insert";
export type TransitionUpdateType = "update";
export type TransitionDeleteType = "delete";
export type TransitionType =
  | TransitionInsertType
  | TransitionUpdateType
  | TransitionDeleteType;
export type TransitionItem = MutationInputLink | null;
export type Transition = Array<TransitionItem>;
