export const IssueTypeAPI = async () => {
  // used wrong url to test
  return AP.request("/rest/api/3/issuetypee")
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
export const IssueLinkAPI = async (
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
  const getKey = () => {
    return new Promise((resolve) => {
      AP.context.getContext((res) => {
        resolve(res.jira.issue.id);
      });
    });
  };
  const input = key || (await getKey());
  let queries = [];
  fields.forEach((field) => {
    queries.push(`fields=${field}`);
  });
  const queriesString = queries.join("&");
  // used wrong url to test
  let url = `/rest/api/3/issue/${input}s`;
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

export const IssueAPI = async (id) => {
  const response = await AP.request(`/rest/api/3/issue/${id}`);

  return Promise.resolve(JSON.parse(response.body));
};

export const FilterAPI = async () => {
  const response = await AP.request(`/rest/api/3/filter/search`);

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

/*
const _accumulator = (results, startIndex, maxResults, query, total) => {
  return new Promise((resolve, reject) => {
    const loop = offset => {
      query(offset, maxResults)
        .then(data => {
          if (data.length) {
            results.push(...data);
            if (!total || results.length < total) {
              loop(offset + maxResults);
            }
          } else {
            resolve(results);
          }
        })
        .catch(reject);
    };
    loop(startIndex); //starting collection
  });
};
*/

export const IssueSearchAPI = async (jql, start, max) => {
  const results = [];
  const query = () => {
    return new Promise((resolve, reject) => {
      const data = {
        fields: [
          "summay",
          "subtasks",
          "parent",
          "issuelinks",
          "issuetype",
          "priority",
          "status",
        ],
        startAt: start,
        maxResults: max,
        jql: jql,
      };

      AP.request({
        type: "POST",
        contentType: "application/json",
        url: `/rest/api/3/search`,
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

  //return _accumulator(results, start, 50, query, total);
};
