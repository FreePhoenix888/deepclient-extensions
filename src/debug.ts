import innerDebug from "debug";

export function debug(namespace: string) {
  return innerDebug(`@freephoenix888/deepclient-extensions:${namespace}`);
}
