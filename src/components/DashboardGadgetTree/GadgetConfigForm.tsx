import React, { useEffect, useState } from "react";

interface GadgetConfig {
  title: string;
  issueId: string;
}

interface GadgetConfigurationFormProps {
  onSave: (GadgetConfig: GadgetConfig) => void;
}

export const GadgetConfigurationForm: React.FC<
  GadgetConfigurationFormProps
> = ({ onSave }) => {
  const [inputConfig, setInputConfig] = useState<GadgetConfig>({
    title: "",
    issueId: "",
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
    AP.request({
      url: "/config",
      type: "POST",
      data: JSON.stringify({ config: inputConfig }),
      success: () => {
        onSave(inputConfig);
      },
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setInputConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSave}>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        name="title"
        id="title"
        value={inputConfig.title}
        onChange={handleInputChange}
      />
      <br />
      <label htmlFor="issueId">Issue Id:</label>
      <input
        type="text"
        name="issueId"
        id="issueId"
        value={inputConfig.issueId}
        onChange={handleInputChange}
      />
      <br />
      <button type="submit">Save</button>
    </form>
  );
};
