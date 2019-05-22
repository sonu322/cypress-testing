const IssueTypeAPI = async () => {
  const response = await AP.request("/rest/api/3/issuetype");

  return Promise.resolve(JSON.parse(response.body));
};

const LinkTypeAPI = async () => {
  const response = await AP.request("/rest/api/3/issueLinkType");

  return Promise.resolve(JSON.parse(response.body));
};

const PriorityAPI = async () => {
  const response = await AP.request("/rest/api/3/priority");

  return Promise.resolve(JSON.parse(response.body));
};

const IssueLinkAPI = async key => {
  const getKey = () => {
    if (key) {
      return Promise.resolve(key);
    } else {
      return new Promise(resolve => {
        AP.context.getContext(res => {
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

const IssueAPI = async id => {
  const response = await AP.request(`/rest/api/3/issue/${id}`);

  return Promise.resolve(JSON.parse(response.body));
};

export { PriorityAPI, IssueTypeAPI, LinkTypeAPI, IssueLinkAPI, IssueAPI };
