import { generateApolloClient } from "@deep-foundation/hasura/client.js";
import { ApolloClient } from "@apollo/client/index.js";
import "@testing-library/jest-dom";
import assert from "assert";
import { DeepClient } from "@deep-foundation/deeplinks/imports/client.js";
import {
  createSerialTransitionsBuilderDecorator,
  SerialTransitionsBuilderDecorator,
} from "../src/serial-transitions-builder/create-serial-transitions-builder-decorator.js";
import { Transition } from "../src/serial-transitions-builder/transition.js";

const graphQlPath = `${process.env.DEEPLINKS_HASURA_PATH}/v1/graphql`;
if (process.env.DEEPLINKS_HASURA_SSL == null) {
  throw new Error("DEEPLINKS_HASURA_SSL is not defined");
}
const ssl = !!+process.env.DEEPLINKS_HASURA_SSL;
if (process.env.DEEPLINKS_HASURA_SECRET == null) {
  throw new Error("DEEPLINKS_HASURA_SECRET is not defined");
}
const secret = process.env.DEEPLINKS_HASURA_SECRET;
const ws = true;

let apolloClient: ApolloClient<any>;
let deep: DeepClient;
let decoratedDeep: SerialTransitionsBuilderDecorator<DeepClient>;

beforeAll(async () => {
  apolloClient = generateApolloClient({
    path: graphQlPath,
    ssl,
    secret,
    ws,
  });
  deep = new DeepClient({ apolloClient });

  const { data: corePackageLinks } = await deep.select({
    up: {
      tree_id: {
        _id: ["@deep-foundation/core", "containTree"],
      },
      parent_id: {
        _id: ["@deep-foundation/core"],
      },
    },
  });
  deep.minilinks.apply(corePackageLinks);
  decoratedDeep = createSerialTransitionsBuilderDecorator({ deep });
});

describe("SerialTransitionsdecoratedDeep", () => {
  it("should append insert transition", async () => {
    const table = "links";
    const transition = [
      null,
      {
        type_id: deep.idLocal("@deep-foundation/core", "Type"),
      },
    ];
    decoratedDeep.append({ table, transition });
    expect(decoratedDeep.serialActions.length).toBe(1);
  });

  it("should clear transitions", () => {
    const table = "links";
    const transition = [
      null,
      {
        type_id: deep.idLocal("@deep-foundation/core", "Type"),
      },
    ];
    decoratedDeep.append({ table, transition });
    decoratedDeep.clear();
    expect(decoratedDeep.serialActions.length).toBe(0);
  });

  it("should get correct transition type for insert", () => {
    const transition: Transition = [
      null,
      {
        type_id: deep.idLocal("@deep-foundation/core", "Type"),
      },
    ];
    const type = decoratedDeep.getTransitionType(transition);
    if (type !== "insert") {
      throw new Error("Incorrect transition type");
    }
  });

  it("should get correct transition type for update", () => {
    const transition: Transition = [
      {
        id: 0,
      },
      {
        id: 0,
      },
    ];
    const type = decoratedDeep.getTransitionType(transition);
    if (type !== "update") {
      throw new Error("Incorrect transition type");
    }
  });

  it("should get correct transition type for delete", () => {
    const transition: Transition = [
      {
        type_id: deep.idLocal("@deep-foundation/core", "Type"),
      },
      null,
    ];
    const type = decoratedDeep.getTransitionType(transition);
    if (type !== "delete") {
      throw new Error("Incorrect transition type");
    }
  });

  it("should execute transition", async () => {
    const transition = [
      null,
      {
        type_id: deep.idLocal("@deep-foundation/core", "Type"),
      },
    ];
    const result = await decoratedDeep.append({ transition }).execute();

    assert.equal(Object.keys(result.data).length, 2);
  });

  it("should execute transitions", async () => {
    const transition = [
      null,
      {
        type_id: deep.idLocal("@deep-foundation/core", "Type"),
      },
    ];
    const result = await decoratedDeep
      .append({ transition })
      .append({ transition })
      .execute();
    assert.equal(Object.keys(result.data).length, 4);
  });

  it("should execute multiple transitions", async () => {
    const transition = [
      null,
      {
        type_id: deep.idLocal("@deep-foundation/core", "Type"),
      },
    ];
    const result = await decoratedDeep
      .append({ transition }, { transition })
      .execute();
    assert.equal(Object.keys(result.data).length, 4);
  });

  it("should execute transition and result link be accessible by both alias and index", async () => {
    const transition = [
      null,
      {
        type_id: deep.idLocal("@deep-foundation/core", "Type"),
      },
    ];
    const alias = "link";
    const { data } = await decoratedDeep
      .append({ transition, alias })
      .execute();
    expect(data[alias]).toBeDefined();
    expect(data[0]).toBeDefined();
  });

  it("should execute transitions and result links be accessible by both alias and index", async () => {
    const transition = [
      null,
      {
        type_id: deep.idLocal("@deep-foundation/core", "Type"),
      },
    ];
    const firstLinkAlias = "link0";
    const secondLinkAlias = "link1";
    const { data } = await decoratedDeep
      .append({ transition, alias: firstLinkAlias })
      .append({ transition, alias: secondLinkAlias })
      .execute();
    expect(data[firstLinkAlias]).toBeDefined();
    expect(data[0]).toBeDefined();
    expect(data[secondLinkAlias]).toBeDefined();
    expect(data[1]).toBeDefined();
  });
});
