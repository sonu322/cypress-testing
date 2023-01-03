import React, { useState } from "react";
import { CustomJQLEditor } from "./components/JQLEditorServer";
import { jqlDialogOptions } from "./constants/traceabilityReport";
import TracebilityReport from "./TracebilityReport";

const TracebilityReportServerWithEditor = () => {
  const [isEditorOpen, setIsOpenJQLEditor] = useState(false);
  const [callback, setCallback] = useState(() => () => null);
  const [jql, setJQLString] = useState(jqlDialogOptions.jql);
  const options = { ...jqlDialogOptions };
  const showCustomJQLEditor = (opts, callback): void => {
    setCallback(() => callback);
    setJQLString(opts.jql);
    setIsOpenJQLEditor(true);
  };

  function onSearch(jql: string): void {
    callback({ jql });
  }
  return (
    <span>
      <TracebilityReport showCustomJQLEditor={showCustomJQLEditor} />
      <CustomJQLEditor
        isEditorOpen={isEditorOpen}
        setIsOpen={setIsOpenJQLEditor}
        jql={jql}
        setJQLString={setJQLString}
        onSearch={onSearch}
        options={options}
      />
    </span>
  );
};

export default TracebilityReportServerWithEditor;
