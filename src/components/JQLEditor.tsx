import React from 'react';
import Button from '@atlaskit/button';
// @ts-expect-error
const _AP: any = AP
const options = {
  jql: 'ORDER BY Rank ASC',
  // TODO: replace with a good placeholder filter
  header: 'Filter Issues with JQL Query',
  descriptionText: 'Enter query below',
  submitText: 'Use filter',
  cancelText: 'Cancel'
}

export const JQLEditor = ({ setSelectedFilterId }) => {
  const callback = function ({ jql }: { jql: string }) {
    console.log(jql);
    setSelectedFilterId(jql);
  };
  const openJQLEditor = () => {
    _AP.jira.showJQLEditor(options, callback);
  };
  return (
    <Button appearance="primary" onClick={openJQLEditor}>
      Use JQL Editor
    </Button>
  );
};
