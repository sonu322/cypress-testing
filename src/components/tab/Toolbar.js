import React, { Component } from "react";
import PropTypes from "prop-types";
import IssueTypeDropdown from "./IssueTypeDropdown";
import LinkTypeDropdown from "./LinkTypeDropDown";
import PriorityDropdown from "./PriorityDropdown";
import Button, { ButtonGroup } from "@atlaskit/button";
import Page, { Grid, GridColumn } from "@atlaskit/page";
import styled from "styled-components";
import QuestionIcon from "@atlaskit/icon/glyph/question";
import ExportIcon from "@atlaskit/icon/glyph/export";
import { HelpLink } from "../../constants";
const AlignRight = styled.div`
  text-align: right;
`;

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issueType: [],
      linkType: [],
      priority: [],
      exporting: false,
    };
  }

  updateFilter() {
    const { issueType, linkType, priority } = this.state;
    this.props.filter({
      issueType,
      linkType,
      priority,
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

  export() {
    const { exporting } = this.state;
    if (!exporting) {
      this.setState({ exporting: true });
      this.props.export(this);
    }
  }

  exported() {
    this.setState({
      exporting: false,
    });
  }

  render() {
    const { exporting } = this.state;
    return (
      <Page>
        <Grid spacing="compact">
          <GridColumn medium={10}>
            <ButtonGroup>
              <IssueTypeDropdown
                filter={(data) => this.updateIssueTypeFilter(data)}
              />
              <LinkTypeDropdown
                filter={(data) => this.updateLinkTypeFilter(data)}
              />
              <PriorityDropdown
                filter={(data) => this.updatePriorityFilter(data)}
              />
            </ButtonGroup>
          </GridColumn>
          <GridColumn medium={2}>
            <AlignRight>
              <ButtonGroup>
                <Button
                  appearance="default"
                  iconBefore={<ExportIcon />}
                  onClick={() => this.export()}
                  isLoading={exporting}
                />
                <Button
                  appearance="default"
                  target="_blank"
                  href={HelpLink}
                  iconBefore={<QuestionIcon />}
                />
              </ButtonGroup>
            </AlignRight>
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}

Toolbar.propTypes = {
  filter: PropTypes.func,
};

export default Toolbar;
