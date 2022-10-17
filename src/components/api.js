export const IssueTypeAPI = async () => {
  const response = await AP.request("/rest/api/3/issuetype");

  return Promise.resolve(JSON.parse(response.body));
};

export const LinkTypeAPI = async () => {
  const response = await AP.request("/rest/api/3/issueLinkType");
  const data = JSON.parse(response.body).issueLinkTypes;
  if (data && data.issueLinkTypes) {
    return Promise.resolve(data.issueLinkTypes);
  } else {
    const error = new Error("Some error occured fetching Link types");
    return Promise.reject(error);
  }
};

export const PriorityAPI = async () => {
  const response = await AP.request("/rest/api/3/priority");

  return Promise.resolve(JSON.parse(response.body));
};

export const IssueFieldsAPI = async () => {
  const response = await AP.request("/rest/api/3/field");
  return Promise.resolve(JSON.parse(response.body));
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
  let url = `/rest/api/3/issue/${input}`;
  if (queriesString.length > 0) {
    url = url + "?" + queriesString;
  }
  const response = await AP.request(url);

  return Promise.resolve(JSON.parse(response.body));
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
  const response = await AP.request(`/rest/api/3/project/${input}`);

  return Promise.resolve(JSON.parse(response.body));
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
