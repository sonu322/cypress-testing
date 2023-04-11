import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import {
  DEFAULT_GADGET_HEIGHT,
  DEFAULT_GADGET_TITLE,
} from "../../constants/tree";
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
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [config, setConfig] = useState<TreeGadgetConfig>();

  const [dashboardId, setDashboardId] = useState();
  const [dashboardItemId, setDashboardItemId] = useState();
  const openConfigureScreen = (): void => {
    setIsConfiguring(true);
  };

  const handleSaveConfig = (newConfig: TreeGadgetConfig): void => {
    setIsConfiguring(false);
    setConfig(newConfig);
    AP.require(["gadget"], function (gadget) {
      console.log("GADGET", gadget);
      const gadgetObj = gadget.get(dashboardItemId);
      console.log("GADGET OBJ", gadgetObj);
      if (gadgetObj) {
        gadgetObj.refresh();
      }
    });
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
    console.log("DAshboadId", dashboardId);
    console.log("dashboarditemdi", dashboardItemId);
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
          console.log("response", response);
          const data = JSON.parse(response.body);

          console.log("parsed response", data.value);
          setConfig(data.value); // last saved value
          setIsConfiguring(false);
        })
        .catch((e) => {
          console.log("FROM CATCH!!!!!!!!");
          console.log(e);
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
      console.log("edit called");
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
        <Container height={config?.height ?? DEFAULT_GADGET_HEIGHT}>
          {isConfiguring ? (
            <GadgetConfigurationForm
              savedConfig={config}
              dashboardId={dashboardId}
              dashboardItemId={dashboardItemId}
              onSave={handleSaveConfig}
            />
          ) : (
            <Gadget
              issueKey={
                config.issueKey?.length > 0 ? config.issueKey : "TNG31-12"
              }
            />
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
