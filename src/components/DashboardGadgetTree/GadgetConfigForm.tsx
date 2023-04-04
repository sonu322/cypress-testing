import React, { useEffect, useState } from "react";
import { DEFAULT_GADGET_HEIGHT } from "../../constants/tree";
import { TreeGadgetConfig } from "../../types/app";

interface GadgetConfigurationFormProps {
  onSave: (GadgetConfig: TreeGadgetConfig) => void;
}

export const GadgetConfigurationForm: React.FC<
  GadgetConfigurationFormProps
> = ({ onSave }) => {
  const [inputConfig, setInputConfig] = useState<TreeGadgetConfig>({
    title: "",
    issueKey: "",
    height: DEFAULT_GADGET_HEIGHT,
  });
  useEffect(() => {
    AP.context.getToken(function (token) {
      console.log("Access token:", token);
    }); // TODO: check why token is undefined

    AP.request({
      url: "/config",
      success: (response) => {
        setInputConfig(response.config); // last saved value
      },
    });
  }, []);

  const handleSave = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    // AP.request({
    //   url: "/config",
    //   type: "POST",
    //   data: JSON.stringify({ config: inputConfig }),
    //   success: () => {
    //     onSave(inputConfig);
    //   },
    // });
    onSave(inputConfig);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    console.log(name, value);
    setInputConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSave}>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        name="title"
        id="title"
        value={inputConfig.title}
        onChange={handleInputChange}
      />
      <br />
      <label htmlFor="issueKey">Issue Key</label>
      <input
        type="text"
        name="issueKey"
        id="issueKey"
        value={inputConfig.issueKey}
        onChange={handleInputChange}
      />
      <br />
      <label htmlFor="height">Tree Height</label>
      <input
        type="number"
        name="height"
        id="height"
        value={inputConfig.height}
        onChange={handleInputChange}
      />
      <br />
      <button type="submit">Save</button>
    </form>
  );
};
