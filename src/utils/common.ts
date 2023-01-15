type Only<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

export function uniqueObjArray<T extends Record<string, unknown>>(
  objArray: T[],
  key: Only<T, string | number>
) {
  return [...new Map(objArray.map((item) => [item[key], item])).values()];
}
