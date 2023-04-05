import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { DEFAULT_GADGET_HEIGHT } from "../../constants/tree";
import { TreeGadgetConfig } from "../../types/app";
import { Gadget } from "./Gadget";
import { GadgetConfigurationForm } from "./GadgetConfigForm";

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
  const openConfigureScreen = (): void => {
    setIsConfiguring(true);
  };

  const handleSaveConfig = (newConfig: TreeGadgetConfig): void => {
    setIsConfiguring(false);
    setConfig(newConfig);
  };

  useEffect(() => {
    // Set the height of your gadget using AP.resize
    AP.resize("100%", config.height);
  }, [config]);
  return (
    <Container height={config.height}>
      <h1>{config.title?.length > 0 ? config.title : "LXP"}</h1>
      {isConfiguring ? (
        <GadgetConfigurationForm onSave={handleSaveConfig} />
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
  );
};

console.log("dashboard gadget script called");
const App = document.getElementById("app");
ReactDOM.render(<DashboardGadget />, App);
