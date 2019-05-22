import React, { Component } from "react";
import PropTypes from "prop-types";
import IssueTypeDropdown from "./IssueTypeDropdown";
import LinkTypeDropdown from "./LinkTypeDropDown";
import PriorityDropdown from "./PriorityDropdown";
import { ButtonGroup } from "@atlaskit/button";

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issueType: [],
      linkType: [],
      priority: []
    };
  }

  updateFilter() {
    const { issueType, linkType, priority } = this.state;
    this.props.filter({
      issueType,
      linkType,
      priority
    });
  }

  updateIssueTypeFilter(issueType) {
    this.setState({ issueType }, () => {
      this.updateFilter();
    });
  }

  updateLinkTypeFilter(linkType) {
    this.setState({ linkType }, () => {
      this.updateFilter();
    });
  }

  updatePriorityFilter(priority) {
    this.setState({ priority }, () => {
      this.updateFilter();
    });
  }

  render() {
    return (
      <div className="toolbar">
        <ButtonGroup>
          <IssueTypeDropdown
            filter={data => this.updateIssueTypeFilter(data)}
          />
          <LinkTypeDropdown filter={data => this.updateLinkTypeFilter(data)} />
          <PriorityDropdown filter={data => this.updatePriorityFilter(data)} />
        </ButtonGroup>
      </div>
    );
  }
}

Toolbar.propTypes = {
  filter: PropTypes.func
};

export default Toolbar;
