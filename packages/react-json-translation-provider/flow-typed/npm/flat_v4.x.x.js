// flow-typed signature: e3c966a8f7ad5d07b2f9dab477cf083d
// flow-typed version: <<STUB>>/flat_v4/flow_v0.81.0

declare module 'flat' {
  declare type Options = {
    delimiter?: string,
    safe?: boolean,
    object?: boolean,
    overwrite?: boolean,
    maxDepth?: number,
  };

  declare export function flatten(target: Object, opts?: Options): Object;
  declare export function unflatten(target: Object, opts?: Options): Object;

  declare export default function flatten(target: Object, opts?: Options): Object;
}
