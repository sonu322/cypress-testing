import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { DEFAULT_GADGET_HEIGHT } from "../../constants/tree";
import { APIContext } from "../../context/api";
import { TreeGadgetConfig } from "../../types/app";
import { Gadget } from "./Gadget";
import { GadgetConfigurationForm } from "./GadgetConfigForm";
import APIImpl from "../../impl/Cloud";
import JiraCloudImpl from "../../impl/jira/Cloud";
import { getQueryParam } from "../../util/index";
interface ContainerProps {
  height: number;
}
const Container = styled.div<ContainerProps>`
  height: ${({ height }) => height}px;
`;

const DashboardGadget: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [config, setConfig] = useState<TreeGadgetConfig>({
    title: "",
    issueKey: "",
    height: DEFAULT_GADGET_HEIGHT,
  });
  const [dashboardId, setDashboardId] = useState();
  const [dashboardItemId, setDashboardItemId] = useState();
  const openConfigureScreen = (): void => {
    setIsConfiguring(true);
  };

  const handleSaveConfig = (newConfig: TreeGadgetConfig): void => {
    setIsConfiguring(false);
    setConfig(newConfig);
  };
  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);
  useEffect(() => {
    // Set the height of your gadget using AP.resize
    AP.resize("100%", config.height);
  }, [config]);

  useEffect(() => {
    const dashboardId = getQueryParam("dashboardId");
    const dashboardItemId = getQueryParam("dashboardItemId");
    console.log("DAshboadId", dashboardId);
    console.log("dashboarditemdi", dashboardItemId);
    if (dashboardId !== undefined) {
      setDashboardId(dashboardId);
    }
    if (dashboardItemId !== undefined) {
      setDashboardItemId(dashboardItemId);
    }
  }, []);

  if (dashboardId !== undefined && dashboardItemId !== undefined) {
    return (
      <APIContext.Provider value={api}>
        <Container height={config.height}>
          <h1>{config.title?.length > 0 ? config.title : "LXP"}</h1>
          {isConfiguring ? (
            <GadgetConfigurationForm
              dashboardId={dashboardId}
              dashboardItemId={dashboardItemId}
              onSave={handleSaveConfig}
            />
          ) : (
            <>
              <button onClick={openConfigureScreen}>Configure</button>
              <Gadget
                issueKey={
                  config.issueKey?.length > 0 ? config.issueKey : "TNG31-12"
                }
              />
            </>
          )}
        </Container>
      </APIContext.Provider>
    );
  } else {
    return <em>Loading</em>;
  }
};

console.log("dashboard gadget script called");
const App = document.getElementById("app");
ReactDOM.render(<DashboardGadget />, App);
