import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import { TreeGadgetConfig } from "../../types/app";
import { Gadget } from "./Gadget";
import { GadgetConfigurationForm } from "./GadgetConfigForm";
import APIImpl from "../../impl/Cloud";
import JiraCloudImpl from "../../impl/jira/Cloud";
import { getQueryParam } from "../../util/index";
import { DashboardContext } from "../common/Dashboard/DashboardContext";
import { ISSUE_TYPE_VIEW_ID } from "../../constants/traceabilityReport";
import {
  DEFAULT_GADGET_HEIGHT,
  DEFAULT_GADGET_TITLE,
} from "../../constants/gadgetTraceability";

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

const createAPI = () => {
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);

  return api;
};

const DashboardGadget: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [config, setConfig] = useState<any>();
  const [dashboardId, setDashboardId] = useState();
  const [dashboardItemId, setDashboardItemId] = useState();

  const updateConfig = (config: TreeGadgetConfig): void => {
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
        console.log("dashboardid", dashboardId);
        console.log("dashboardItemId", dashboardItemId);
        const config = await api.getDashboardGadgetConfig(
          dashboardId,
          dashboardItemId
        );
        console.log("CONFIG", config);
        setConfig(config.value);
        setIsConfiguring(false);
      } catch (error: unknown) {
        console.log("ERROR CAUGHT");
        console.log(error);
        setConfig({
          title: DEFAULT_GADGET_TITLE,
          viewType: ISSUE_TYPE_VIEW_ID,
          height: DEFAULT_GADGET_HEIGHT,
          selectedIssueTypeIds: [],
          selectedLinkTypeIds: [],
          issueCardFields: [],
          pageSize: 20,
        });
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
  console.log(dashboardId, dashboardItemId, config);
  if (
    dashboardId !== undefined &&
    dashboardItemId !== undefined &&
    config !== undefined
  ) {
    console.log("rendering app");
    console.log(config);
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
        from else
        <Spinner size={"large"} />
      </SpinnerContainer>
    );
  }
};
const App = document.getElementById("app");
ReactDOM.render(<DashboardGadget />, App);
