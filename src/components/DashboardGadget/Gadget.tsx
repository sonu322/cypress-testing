import React, { useEffect, useState } from "react";
import { APIContext } from "../../context/api";
import APIImpl from "../../impl/Cloud";
import JiraCloudImpl from "../../impl/jira/Cloud";
import IssueLinksHierarchy from "../../IssueLinksHierarchy";

interface GadgetProps {
  title: string;
  url: string;
}

interface GadgetData {
  id: number;
  name: string;
}

export const Gadget: React.FC<GadgetProps> = ({ title, url }) => {
  // const [data, setData] = useState<GadgetData[]>([]);

  // useEffect(() => {
  //   // Use the AP.context.getToken() method to get the authentication token for the user making the request
  //   const authToken = AP.context.getToken();

  //   // Use the token to make API requests to your app's backend
  //   // ...

  //   // For this example, we'll just fetch some data from a public API
  //   fetch(url)
  //     .then((response) => response.json())
  //     .then((data) => setData(data))
  //     .catch((error) => console.error(error));
  // }, [url]);

  const jiraCloud = new JiraCloudImpl();
  const api = new APIImpl(jiraCloud);
  return (
    <APIContext.Provider value={api}>
      <IssueLinksHierarchy rootIssueId="13153" />
    </APIContext.Provider>
  );
};
