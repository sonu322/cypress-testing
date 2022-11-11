// writing all new common utils here.
import { ThemeAppearance } from "@atlaskit/lozenge";
import { IssueStatus } from "../types/api";
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
  if (typeof p === "object" && typeof p.then === "function") {
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
export const getScreenHeight = (): number => {
  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );
};

export const getStatusAppearance = (status: IssueStatus): ThemeAppearance => {
  const known: ThemeAppearance[] = [
    "default",
    "inprogress",
    "moved",
    "new",
    "removed",
    "success",
  ];
  // let color = category.colorName;
  let type: ThemeAppearance = "default";
  const foundType = known.find((type) => {
    console.log(type);
    console.log(status.name.replace(/ /g, ""));
    return type === status.name.toLowerCase().replace(/ /g, "");
  });
  if (foundType !== undefined) {
    return foundType;
  } else {
    const { statusColor } = status;
    if (statusColor.includes("gray")) {
      type = "default";
    } else if (statusColor.includes("green")) {
      type = "success";
    } else if (statusColor.includes("blue")) {
      type = "inprogress";
    } else if (statusColor.includes("red")) {
      type = "removed";
    } else if (statusColor.includes("yellow")) {
      type = "moved";
    }
  }

  return type;
};