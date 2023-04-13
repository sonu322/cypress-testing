import { createContext } from "react";
import { TreeGadgetConfig } from "../../../types/app";

export const DashboardContext = createContext<{
  dashboardId: string;
  dashboardItemId: string;
  config: TreeGadgetConfig;
  updateConfig: (config: TreeGadgetConfig) => void;
  isConfiguring: boolean;
  updateIsConfiguring: (isConfiguring: boolean) => void;
}>({
  dashboardId: undefined,
  dashboardItemId: undefined,
  config: undefined,
  updateConfig: undefined,
  isConfiguring: true,
  updateIsConfiguring: undefined,
});
