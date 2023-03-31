import React, { useEffect, useState } from "react";

interface GadgetConfig {
  title: string;
  url: string;
}

interface GadgetConfigurationFormProps {
  onSave: () => void;
}

export const GadgetConfigurationForm: React.FC<
  GadgetConfigurationFormProps
> = ({ onSave }) => {
  const [config, setConfig] = useState<GadgetConfig>({ title: "", url: "" });

  useEffect(() => {
    AP.request<GadgetConfig>({
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
      data: { config },
      success: () => {
        onSave();
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
