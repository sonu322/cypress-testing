import { createContext } from "react";
import { DASHBOARD_GADGET_CONFIG_KEY } from "../../../constants/gadgetTree";
import { TraceabilityGadgetConfig, TreeGadgetConfig } from "../../../types/app";

export const DashboardContext = createContext<{
  dashboardId: string;
  dashboardItemId: string;
  [DASHBOARD_GADGET_CONFIG_KEY]: TreeGadgetConfig | TraceabilityGadgetConfig;
  updateConfig: (config: TreeGadgetConfig | TraceabilityGadgetConfig) => void;
  isConfiguring: boolean;
  updateIsConfiguring: (isConfiguring: boolean) => void;
}>({
  dashboardId: undefined,
  dashboardItemId: undefined,
  [DASHBOARD_GADGET_CONFIG_KEY]: undefined,
  updateConfig: undefined,
  isConfiguring: true,
  updateIsConfiguring: undefined,
});
