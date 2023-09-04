import { Table } from "@deep-foundation/deeplinks/imports/client";
import { IGenerateMutationBuilder } from "@deep-foundation/deeplinks/imports/gql";
import {
  TransitionDeleteType,
  TransitionInsertType,
  TransitionType,
  TransitionUpdateType,
} from "./transition";

type CommonSerialAction = {
  mutation: IGenerateMutationBuilder;
  alias?: string;
  index: number;
};

type InsertAction = {
  transitionType: TransitionInsertType;
  table: Table<"insert">;
};

type UpdateAction = {
  transitionType: TransitionUpdateType;
  table: Table<"update">;
};

type DeleteAction = {
  transitionType: TransitionDeleteType;
  table: Table<"delete">;
};

// Combine them into the final union type
export type InsertSerialAction = CommonSerialAction & InsertAction;
export type UpdateSerialAction = CommonSerialAction & UpdateAction;
export type DeleteSerialAction = CommonSerialAction & DeleteAction;
export type SerialAction =
  | InsertSerialAction
  | UpdateSerialAction
  | DeleteSerialAction;
