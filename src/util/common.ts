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
