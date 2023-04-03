import React, { useEffect, useState } from "react";

interface GadgetConfig {
  title: string;
  url: string;
}

interface GadgetConfigurationFormProps {
  onSave: (GadgetConfig) => void;
}

export const GadgetConfigurationForm: React.FC<
  GadgetConfigurationFormProps
> = ({ onSave }) => {
  const [config, setConfig] = useState<GadgetConfig>({ title: "", url: "" });

  useEffect(() => {
    AP.context.getToken(function (token) {
      console.log("Access token:", token);
    }); // TODO: check why token is undefined

    AP.request({
      url: "/config",
      success: (response) => {
        setConfig(response.config);
      },
    });
  }, []);

  const handleSave = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    AP.request({
      url: "/config",
      type: "POST",
      data: JSON.stringify({ config }),
      success: () => {
        console.log("saved");
        onSave(config);
      },
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setConfig((prevConfig) => ({
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
        value={config.title}
        onChange={handleInputChange}
      />
      <br />
      <label htmlFor="url">URL:</label>
      <input
        type="text"
        name="url"
        id="url"
        value={config.url}
        onChange={handleInputChange}
      />
      <br />
      <button type="submit">Save</button>
    </form>
  );
};
