import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Gadget } from "./Gadget";
import { GadgetConfigurationForm } from "../common/GadgetConfigForm";

const DashboardGadget: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleConfigure = () => {
    setIsConfiguring(true);
  };

  const handleSaveConfig = (newConfig) => {
    console.log("new config is");
    console.log(newConfig);
    setIsConfiguring(false);
  };

  return (
    <div>
      <h1>LXP</h1>
      {isConfiguring ? (
        <GadgetConfigurationForm onSave={handleSaveConfig} />
      ) : (
        <>
          <button onClick={handleConfigure}>Configure</button>
          <Gadget title={"LXP"} url={""} />
        </>
      )}
    </div>
  );
};

console.log("dashboard gadget script called");
const App = document.getElementById("app");
ReactDOM.render(<DashboardGadget />, App);
