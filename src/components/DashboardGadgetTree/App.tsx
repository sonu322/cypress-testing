import React, { useState } from "react";
import ReactDOM from "react-dom";
import { TreeGadgetConfig } from "../../types/app";
import { Gadget } from "./Gadget";
import { GadgetConfigurationForm } from "./GadgetConfigForm";

const DashboardGadget: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [config, setConfig] = useState<TreeGadgetConfig>({
    title: "",
    issueKey: "",
  });
  const openConfigureScreen = (): void => {
    setIsConfiguring(true);
  };

  const handleSaveConfig = (newConfig: TreeGadgetConfig): void => {
    setIsConfiguring(false);
    setConfig(newConfig);
  };

  return (
    <div>
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
    </div>
  );
};

console.log("dashboard gadget script called");
const App = document.getElementById("app");
ReactDOM.render(<DashboardGadget />, App);
