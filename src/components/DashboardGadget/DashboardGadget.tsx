import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Gadget } from "./Gadget";
import { GadgetConfigurationForm } from "../common/GadgetConfigForm";

const DashboardGadget: React.FC = () => {
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleConfigure = () => {
    setIsConfiguring(true);
  };

  const handleSaveConfig = () => {
    setIsConfiguring(false);
  };

  return (
    <div>
      <h1>{"extension.title"}</h1>
      {isConfiguring ? (
        <GadgetConfigurationForm onSave={handleSaveConfig} />
      ) : (
        <>
          <button onClick={handleConfigure}>Configure</button>
          <Gadget title={"extension.title"} url={""} />
        </>
      )}
    </div>
  );
};

console.log("dashboard gadget script called");
const App = document.getElementById("app");
ReactDOM.render(<DashboardGadget />, App);
