import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import { Gadget } from "./Gadget";
import { GadgetConfigurationForm } from "./GadgetConfigForm";
import APIImpl from "../../impl/Cloud";
import JiraCloudImpl from "../../impl/jira/Cloud";
import { getQueryParam } from "../../util/index";
import { DashboardContext } from "../common/Dashboard/DashboardContext";
import {
  defaultGadgetConfig,
  DEFAULT_GADGET_HEIGHT,
} from "../../constants/gadgetTraceability";
import LXPAPI from "../../types/api";
import { TraceabilityGadgetConfig } from "../../types/app";

interface ContainerProps {
  height: number;
}
const Container = styled.div<ContainerProps>`
  height: ${({ height }) => height}px;
  overflow: auto;
`;
const SpinnerContainer = styled.span`
  display: flex;
  min-width: 24px;
  width: 24px;
  height: 64px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
  padding-top: 8px;
`;

const createAPI = (): LXPAPI => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);

  return api;
};

const DashboardGadget: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [config, setConfig] = useState<any>();
  const [dashboardId, setDashboardId] = useState();
  const [dashboardItemId, setDashboardItemId] = useState();
  const updateConfig = (config: TraceabilityGadgetConfig): void => {
    setConfig(config);
  };
  const updateIsConfiguring = (isConfiguring: boolean): void => {
    setIsConfiguring(isConfiguring);
  };

  const api = useMemo(() => createAPI(), []);

  useEffect(() => {
    if (config?.height !== undefined) {
      api.resizeWindow("100%", config.height);
    }
  }, [config, api]);

  useEffect(() => {
    const getConfig = async (): Promise<void> => {
      try {
        const config = await api.getDashboardGadgetConfig(
          dashboardId,
          dashboardItemId
        );
        setConfig(config.value);
        setIsConfiguring(false);
      } catch (error: unknown) {
        setConfig(defaultGadgetConfig);
        setIsConfiguring(true);
      }
    };
    const dashboardId = getQueryParam("dashboardId");
    const dashboardItemId = getQueryParam("dashboardItemId");
    if (dashboardId !== undefined) {
      setDashboardId(dashboardId);
    }
    if (dashboardItemId !== undefined) {
      setDashboardItemId(dashboardItemId);
    }
    if (dashboardId !== undefined && dashboardItemId !== undefined) {
      void getConfig();
    }
  }, [api]);

  // event handler to handle click on configure button provided by jira
  AP.require(["jira"], function (jira) {
    jira.DashboardItem.onDashboardItemEdit(function () {
      // render dashboard item configuration now
      setIsConfiguring(true);
    });
  });
  if (
    dashboardId !== undefined &&
    dashboardItemId !== undefined &&
    config !== undefined
  ) {
    return (
      <APIContext.Provider value={api}>
        <DashboardContext.Provider
          value={{
            dashboardId,
            dashboardItemId,
            config,
            updateConfig,
            isConfiguring,
            updateIsConfiguring,
          }}
        >
          <Container height={config?.height ?? DEFAULT_GADGET_HEIGHT}>
            {isConfiguring ? <GadgetConfigurationForm /> : <Gadget />}
          </Container>
        </DashboardContext.Provider>
      </APIContext.Provider>
    );
  } else {
    return (
      <SpinnerContainer>
        <Spinner size={"large"} />
      </SpinnerContainer>
    );
  }
};
const App = document.getElementById("app");
ReactDOM.render(<DashboardGadget />, App);
