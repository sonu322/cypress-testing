//@flow
import React, { Component } from "react";
import InlineDialog from "@atlaskit/inline-dialog";
import MoreIcon from "@atlaskit/icon/glyph/more";
import CrossIcon from "@atlaskit/icon/glyph/cross";
import Button from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import { IssueAPI } from "../api";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";
import Page, { Grid, GridColumn } from "@atlaskit/page";

const ModalContainer = styled.div`
  width: 300px;
  height: 160px;
  overflow: auto;
`;

const DetailContainer = styled.div`
  margin-top: 2px;
  background-color: ${colors.N20};
  padding: 2px;
  border-radius: 3px;
`;

const CloseIconPosition = styled.span`
  float: right;
`;

const HeaderContainer = styled.div`
  padding: 0 4px;
`;

const DetailHeading = styled.div`
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.N300};
`;

const DetailBody = styled.div`
  color: ${colors.N600};
`;

const SpinnerWrapper = styled.div`
  text-align: center;
  vertical-align: middle;
`;

type State = {
  issue: Object,
  fetched: boolean,
  open: boolean
};

type Props = {
  id: ?string
};

export default class IssueDetail extends Component<Props, State> {
  _isMounted = false;
  state = {
    issue: {},
    fetched: false,
    open: false
  };

  open = () => {
    IssueAPI(this.props.id).then(data => {
      if (this._isMounted) {
        this.setState({
          fetched: true,
          issue: data
        });
      }
    });
  };

  close = () => {
    this.setState({
      fetched: false,
      issue: {}
    });
  };

  toggle = () => {
    const { open } = this.state;
    this.setState({
      open: !open
    });

    open ? this.close() : this.open();
  };

  getContent = () => {
    const { fetched, issue, open } = this.state;
    const fields = issue.fields;
    return (
      <ModalContainer>
        <CloseIconPosition>
          <Button
            spacing="none"
            appearance="subtle-link"
            onClick={() => {
              this.setState({ open: false });
              this.close();
            }}
          >
            <CrossIcon size="small" />
          </Button>
        </CloseIconPosition>
        {!fetched || !open ? (
          <SpinnerWrapper>
            <Spinner size="small" />
          </SpinnerWrapper>
        ) : (
          <div>
            <HeaderContainer>
              <h4>{issue.key}</h4>
              <div>{fields.summary}</div>
            </HeaderContainer>
            <Page>
              <Grid spacing="compact">
                <GridColumn medium={6}>
                  <DetailContainer>
                    <DetailHeading>Status</DetailHeading>
                    <DetailBody>{fields.status.name}</DetailBody>
                  </DetailContainer>
                </GridColumn>
                <GridColumn medium={6}>
                  <DetailContainer>
                    <DetailHeading>Priority</DetailHeading>
                    <DetailBody>{fields.priority.name}</DetailBody>
                  </DetailContainer>
                </GridColumn>
              </Grid>
              <Grid spacing="compact">
                <GridColumn medium={6}>
                  <DetailContainer>
                    <DetailHeading>Reporter</DetailHeading>
                    <DetailBody>{fields.reporter.name}</DetailBody>
                  </DetailContainer>
                </GridColumn>
                <GridColumn medium={6}>
                  <DetailContainer>
                    <DetailHeading>Assignee</DetailHeading>
                    <DetailBody>
                      {fields.assignee ? (
                        fields.assignee.name
                      ) : (
                        <em>Unassigned</em>
                      )}
                    </DetailBody>
                  </DetailContainer>
                </GridColumn>
              </Grid>
            </Page>
          </div>
        )}
      </ModalContainer>
    );
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div>
        <InlineDialog
          onClose={() => {
            this.setState({ open: false });
            this.close();
          }}
          onContentBlur={() => {
            this.setState({ open: false });
            this.close();
          }}
          placement="right"
          content={this.getContent()}
          isOpen={this.state.open}
        >
          <Button spacing="none" appearance="subtle-link" onClick={this.toggle}>
            <MoreIcon size="small" />
          </Button>
        </InlineDialog>
      </div>
    );
  }
}
