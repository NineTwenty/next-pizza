import type { EntityState } from 'types/client';

type Only<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export function uniqueObjArray<T extends Record<string, unknown>>(
  objArray: T[],
  key: Only<T, string | number>
) {
  return [...new Map(objArray.map((item) => [item[key], item])).values()];
}

export function reduceToStateObject<T extends { id: number }>(
  acc: EntityState<T>,
  object: T
) {
  return {
    ids: [...acc.ids, object.id],
    entities: { ...acc.entities, [object.id]: object },
  };
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
