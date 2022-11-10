// writing all new common utils here.

export const getKeyValues = (
  objArray: Array<{
    [key: string]: any;
  }>,
  key: string
): string[] => {
  return objArray.map((obj) => obj[key]);
};
// TODO: add types so that, all objects contain the selected key property
export const getKeyMap = (
  map: Map<
    string,
    {
      values: any[];
      [otherKeys: string]: any;
    }
  >,
  targetKey: string
): Map<string, string[]> => {
  const newMap = new Map<string, string[]>();
  for (const [key, value] of map.entries()) {
    newMap.set(key, getKeyValues(value.values, targetKey));
  }
  return newMap;
};


export const isPromise = (p): boolean => {
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }

  return false;
};

export const getUniqueValues = <Type>(
  arrayHavingDuplicates: Type[]
): Type[] => {
  const uniqeArray = [...new Set(arrayHavingDuplicates)];
  return uniqeArray;
};