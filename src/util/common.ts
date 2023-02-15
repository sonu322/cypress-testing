// writing all new common utils here.
import { ThemeAppearance } from "@atlaskit/lozenge";
import { lastSavedReportConfigKey } from "../constants/common";
import { IssueStatus } from "../types/api";
import { LastSavedReportConfig } from "../types/app";
export const getKeyValues = (
  objArray: Array<{
    [key: string]: any;
  }>,
  key: string
): string[] => {
  return objArray.map((obj) => obj[key]);
};
// TODO: add types so that, all objects contain the selected key property



export const handleGetItemInSavedReportConfig = (
  key: string
): LastSavedReportConfig => {
  const lastSavedReportConfig: LastSavedReportConfig = getItemInLocalStorage(
    lastSavedReportConfigKey
  );
  return lastSavedReportConfig[key];
};



export const getItemInLocalStorage = (key: string): any => {
  const strigifiedLastSavedReportConfig = window.localStorage.getItem(key);
  const lastSavedReportConfig = JSON.parse(strigifiedLastSavedReportConfig);
  return lastSavedReportConfig;
};

export const setItemInLocalStorage = (key: string, value: any): void => {
  window.localStorage.setItem(key, JSON.stringify(value));
};




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
  if(status === null || status === undefined) return "default";
  const known: ThemeAppearance[] = [
    "default", // gray
    "inprogress", // blue
    "moved", // yellow
    "new", // purple
    "removed", // red
    "success", // green
  ];

  let type: ThemeAppearance = "default";
  const foundType = known.find((type) => {
    return type === status.name.toLowerCase().replace(/ /g, "");
  });
  // a/c api response color, "yellow" has status category name: indeterminate.
  // status category is "indeterminate" for in progress issues
  // but, "inprogress" is a known type, the type "inprogress" is returned. When assigned to Lozenge, it will give blue color.
  if (foundType !== undefined) {
    return foundType;
  } else {
    const { statusColor } = status;
    // a/c api response color, "blue-gray" has status category name: new -> gives purple color
    // but, it is not included here. the type returned will by default(color gray)
    // status category is new for "todo" issues.

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

export const getAppRoot = (): Promise<HTMLElement>  => {
  let root = document.getElementById("lxp-container-root");
  if(root) return Promise.resolve(root);
  else {
    return new Promise((resolve) => {
      let counter = 0;
      const interval = setInterval(() => {
        counter++;
        root = document.getElementById("lxp-container-root");
        if(root){
          clearInterval(interval);
          resolve(root);
        } else if(counter > 20){
          clearInterval(interval);
          resolve(null);
        }
      }, 50);
    });
  }
};
