module.exports = {
  jiraUsername: "sonu",
  jiraPassword: "admin",
  baseURL: "http://localhost:8080",
  firstissueID: "PM-1",
  secondissueID: "PM-8",
  thirdissueID: "PM-6",
  firstIssueURL: function () {
  return this.baseURL + "/browse/" + this.firstissueID;
  },
};
