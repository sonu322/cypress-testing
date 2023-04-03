import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Gadget } from "./Gadget";
import { GadgetConfigurationForm } from "../common/GadgetConfigForm";

interface GadgetConfig {
  title: string;
  issueId: string;
}

const DashboardGadget: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [config, setConfig] = useState<GadgetConfig>({
    title: "",
    issueId: "",
  });
  const openConfigureScreen = (): void => {
    setIsConfiguring(true);
  };

  const handleSaveConfig = (newConfig: GadgetConfig): void => {
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
            issueId={config.issueId?.length > 0 ? config.issueId : "13153"}
          />
        </>
      )}
    </div>
  );
};

console.log("dashboard gadget script called");
const App = document.getElementById("app");
ReactDOM.render(<DashboardGadget />, App);
