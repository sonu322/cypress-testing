import React from "react";
import ErrorIcon from "@atlaskit/icon/glyph/error";
import Banner from "@atlaskit/banner";

const JiraErrorContainer = () => {
  const errorMessage = "This page is accessible only inside Jira application.";

  return (
    <Banner appearance="error" icon={<ErrorIcon label="Error" />}>
      {errorMessage}
    </Banner>
  );
};

export default JiraErrorContainer;
