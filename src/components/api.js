export const IssueTypeAPI = async () => {
  const response = await AP.request("/rest/api/3/issuetype");

  return Promise.resolve(JSON.parse(response.body));
};

export const LinkTypeAPI = async () => {
  const response = await AP.request("/rest/api/3/issueLinkType");

  return Promise.resolve(JSON.parse(response.body).issueLinkTypes);
};

export const PriorityAPI = async () => {
  const response = await AP.request("/rest/api/3/priority");

  return Promise.resolve(JSON.parse(response.body));
};

export const IssueLinkAPI = async (key) => {
  const getKey = () => {
    if (key) {
      return Promise.resolve(key);
    } else {
      return new Promise((resolve) => {
        AP.context.getContext((res) => {
          resolve(res.jira.issue.id);
        });
      });
    }
  };
  const input = await getKey();
  const response = await AP.request(
    `/rest/api/3/issue/${input}?fields=summary&fields=subtasks&fields=parent&fields=issuelinks&fields=issuetype&fields=priority&fields=status`
  );

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
