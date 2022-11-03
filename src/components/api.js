/* eslint-disable no-undef */
import { formatIssue } from "../util/TreeUtils";
const getKey = () => {
  return new Promise(
    (resolve) => {
      AP.context.getContext((res) => {
        resolve(res.jira.issue.id);
      });
    },
    (reject) => {
      let err = new Error("something went wrong fetching issue key");
      reject(err);
    }
  );
};
export const IssueTypeAPI = async () => {
  return AP.request("/rest/api/3/issuetype")
    .then((response) => JSON.parse(response.body))
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Some error occurred fetching issue types");
      }
    })
    .catch((error) => {
      const newError = new Error(
        "Some error occurred fetching issue issue types"
      );
      console.log(error);
      throw newError;
    });
};

export const LinkTypeAPI = async () => {
  return AP.request("/rest/api/3/issueLinkType")
    .then((response) => JSON.parse(response.body))
    .then((data) => {
      if (data && data.issueLinkTypes) {
        return data.issueLinkTypes;
      } else {
        throw new Error("Some error occurred fetching issue link types");
      }
    })
    .catch((error) => {
      const newError = new Error("Some error fetching issue link types");
      console.log(error);
      throw newError;
    });
};

export const PriorityAPI = async () => {
  return AP.request("/rest/api/3/priority")
    .then((response) => JSON.parse(response.body))
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("some error occurred fetching priorities");
      }
    })
    .catch((error) => {
      console.log(error);
      const newError = new Error("Some error fetching issue priorities");
      throw newError;
    });
};

export const IssueFieldsAPI = async () => {
  return AP.request("/rest/api/3/field")
    .then((response) => JSON.parse(response.body))
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("some error occurred fetching fields");
      }
    })
    .catch((error) => {
      const newError = new Error("Some error fetching issue fields");
      console.log(error);
      throw newError;
    });
};
export const IssueAPI = async (
  key,
  fields = [
    "summary",
    "subtasks",
    "parent",
    "issuelinks",
    "issuetype",
    "priority",
    "status",
  ]
) => {
  const input = key || (await getKey());
  let queries = [];
  fields.forEach((field) => {
    queries.push(`fields=${field}`);
  });
  const queriesString = queries.join("&");
  let url = `/rest/api/3/issue/${input}`;
  if (queriesString.length > 0) {
    url = url + "?" + queriesString;
  }

  return AP.request(url)
    .then((response) => {
      return JSON.parse(response.body);
    })
    .catch((error) => {
      console.log(error);
      const newError = new Error(`some error occurred fetching issue ${input}`);
      throw newError;
    });
};
export const IssueSearchAPI = async (jql, start, max, fields) => {
  const query = () => {
    return new Promise((resolve, reject) => {
      const data = {
        fields: fields ?? [
          "summay",
          "subtasks",
          "parent",
          "issuelinks",
          "issuetype",
          "priority",
          "status",
        ],
        startAt: start ?? 0,
        maxResults: max ?? 500,
        jql: jql,
      };

      AP.request({
        type: "POST",
        contentType: "application/json",
        url: "/rest/api/3/search",
        data: JSON.stringify(data),
        success: (response) => {
          resolve(JSON.parse(response));
        },
        error: (err) => {
          reject(err);
        },
      });
    });
  };

  return query();
};
export const IssueLinkAPI = async (key, fields) => {
  const input = key || (await getKey());
  const rootIssueData = await IssueAPI(input).catch((error) => {
    console.log(error);
    const newError = new Error(`some error occurred fetching issue ${input}`);
    throw newError;
  });
  const formattedRootIssueData = formatIssue(rootIssueData);
  const relatedIssues = formattedRootIssueData.children;
  let relatedIssueIds = [];
  if (relatedIssues) {
    relatedIssues.forEach((issue) => {
      if (!issue.data.isType) {
        relatedIssueIds.push(issue.data.id);
      }
    });
  }
  const relatedIssuesData = await IssueSearchAPI(
    `id in (${relatedIssueIds})`,
    null,
    null,
    fields
  );
  return { rootIssueData, relatedIssuesData };
};

export const FilterAPI = async () => {
  const response = await AP.request("/rest/api/3/filter/search");

  return Promise.resolve(JSON.parse(response.body));
};
export const ProjectAPI = async (key) => {
  const getKey = () => {
    return new Promise((resolve, reject) => {
      AP.context.getContext((res) => {
        if (res && res.jira) {
          resolve(res.jira.project.key);
        } else {
          reject("Project could not be fetched");
        }
      });
    });
  };
  const input = key || (await getKey());
  return AP.request(`/rest/api/3/project/${input}`)
    .then((response) => JSON.parse(response.body))
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Some error occurred fetching Project details");
      }
    })
    .catch((error) => {
      console.log(error);
      const newError = new Error(
        "Some error occurred fetching Project details"
      );
      throw newError;
    });
};
