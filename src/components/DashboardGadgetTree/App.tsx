import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import {
  DEFAULT_GADGET_HEIGHT,
  DEFAULT_GADGET_TITLE,
} from "../../constants/tree";
import Spinner from "@atlaskit/spinner";
import { APIContext } from "../../context/api";
import { TreeGadgetConfig } from "../../types/app";
import { Gadget } from "./Gadget";
import { GadgetConfigurationForm } from "./GadgetConfigForm";
import APIImpl from "../../impl/Cloud";
import JiraCloudImpl from "../../impl/jira/Cloud";
import { getQueryParam } from "../../util/index";
import { DashboardContext } from "./DashboardContext";

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


const DashboardGadget: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [config, setConfig] = useState<TreeGadgetConfig>();
  const [dashboardId, setDashboardId] = useState();
  const [dashboardItemId, setDashboardItemId] = useState();

  const updateConfig = (config: TreeGadgetConfig): void => {
    setConfig(config);
  };
  const updateIsConfiguring = (isConfiguring: boolean): void => {
    setIsConfiguring(isConfiguring);
  };

  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);
  useEffect(() => {
    // Set the height of your gadget using AP.resize
    if (config?.height !== undefined) {
      AP.resize("100%", config.height);
    }
  }, [config]);

  useEffect(() => {
    const dashboardId = getQueryParam("dashboardId");
    const dashboardItemId = getQueryParam("dashboardItemId");
    if (dashboardId !== undefined) {
      setDashboardId(dashboardId);
    }
    if (dashboardItemId !== undefined) {
      setDashboardItemId(dashboardItemId);
    }
    if (dashboardId !== undefined && dashboardItemId !== undefined) {
      AP.request({
        url: `/rest/api/3/dashboard/${dashboardId}/items/${dashboardItemId}/properties/config`,
      })
        .then((response) => {
          const data = JSON.parse(response.body);
          setConfig(data.value); // last saved value
          setIsConfiguring(false);
        })
        .catch((e) => {
          setConfig({
            title: DEFAULT_GADGET_TITLE,
            issueKey: "",
            height: DEFAULT_GADGET_HEIGHT,
          });
          setIsConfiguring(true);
        });
    }
  }, []);

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
            {isConfiguring ? (
              <GadgetConfigurationForm />
            ) : (
              <Gadget
                issueKey={
                  config.issueKey?.length > 0 ? config.issueKey : "TNG31-12"
                }
              />
            )}
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
