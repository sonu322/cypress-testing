import React, { Component } from "react";
import Spinner from "@atlaskit/spinner";
import styled from "styled-components";
import Button from "@atlaskit/button";
import { IssueSearchAPI } from "../api";
import { colors } from "@atlaskit/theme";
import Lozenge from "@atlaskit/lozenge";
import { getStatusAppearance } from "../../util";

const Container = styled.div`
  padding: 4px;
`;

const BorderTr = styled.tr`
  border-bottom: 1px solid ${colors.N40};
`;

const TableContainer = styled.div`
  padding: 2px 5px;
  border: 1px solid ${colors.N10};
`;

const IssueContainer = styled.span`
  display: inline-flex;
  background-color: ${colors.N30}
  fill: ${colors.N30};
  padding: 4px;
  border: none;
  border-radius: 3px;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const Icon = styled.span`
  display: flex;
  width: 16px;
  overflow: hidden;
  height: 16px;
`;

const Key = styled.span`
  display: flex;
  background-color: ${colors.N10}
  fill: ${colors.N10};
  border-radius: 4px;
  padding: 0 4px;
  height: 16px;
  line-height: 1;
`;

const LinkName = styled.span`
  color: ${colors.N600}
  height: 16px;
  line-height: 1;
  font-weight: bold;
  margin-right: 5px;
  text-transform: capitalize;
`;

const ListItem = styled.div`
  margin-bottom: 3px;
`;

const ROWS_PER_PAGE = 20;

class TabularContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defined: false,
      fetching: false,
      jql: "",
      data: [],
      start: 0,
      gettingMore: false,
      noMore: false
    };
  }

  fetch() {
    const { jql, start, data } = this.state;
    IssueSearchAPI(jql, start, ROWS_PER_PAGE).then(result => {
      console.log(result);
      const { issues, total } = result;
      const updatedStart = start + ROWS_PER_PAGE;
      data.push(...issues);
      this.setState({
        gettingMore: false,
        start: updatedStart,
        fetching: false,
        data: data,
        noMore: issues.length === 0 || total < updatedStart ? true : false
      });
    });
  }

  more() {
    this.setState(
      {
        gettingMore: true
      },
      () => {
        this.fetch();
      }
    );
  }

  update(jql) {
    this.setState(
      {
        defined: true,
        fetching: true,
        jql: jql,
        start: 0
      },
      () => {
        this.fetch();
      }
    );
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.onRef(this);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.onRef(null);
  }

  renderKey(key) {
    const url = `${this.props.xdm}/browse/${key}`;
    return (
      <a target="_blank" href={url}>
        {key}
      </a>
    );
  }

  renderLinkName(link) {
    if (!link) {
      return "";
    }
    return <LinkName>{link} </LinkName>;
  }
  renderIssue(issue, link) {
    if (!issue) {
      return <em>n.a.</em>;
    }
    const { issuetype, priority, status } = issue.fields;
    return (
      <IssueContainer>
        {this.renderLinkName(link)}
        <Icon>
          <img
            height={16}
            width={16}
            src={issuetype.iconUrl}
            title={`${issuetype.name} - ${issuetype.description}`}
          />
        </Icon>
        <Icon>
          <img
            height={16}
            width={16}
            src={priority.iconUrl}
            title={`${priority.name}`}
          />
        </Icon>
        <Lozenge
          maxWidth={100}
          appearance={getStatusAppearance(status.statusCategory)}
        >
          {status.name}
        </Lozenge>
        <Key>{this.renderKey(issue.key)}</Key>
      </IssueContainer>
    );
  }

  renderIssues(issues) {
    if (!issues || issues.length === 0) {
      return <em>n.a.</em>;
    }

    return issues.map((issue, i) => (
      <ListItem key={i}>{this.renderIssue(issue)}</ListItem>
    ));
  }

  renderLink(link) {
    let issue;
    let name;
    if (link.outwardIssue) {
      issue = link.outwardIssue;
      name = link.type.outward;
    } else {
      issue = link.inwardIssue;
      name = link.type.inward;
    }

    return <div>{this.renderIssue(issue, name)}</div>;
  }
  renderLinks(links) {
    if (!links || links.length === 0) {
      return <em>n.a.</em>;
    }

    return links.map((link, i) => (
      <ListItem key={i}>{this.renderLink(link)}</ListItem>
    ));
  }

  render() {
    const { defined, fetching, data, gettingMore, noMore } = this.state;
    if (!defined) {
      return (
        <Container>
          <em>Please select filter to view table</em>
        </Container>
      );
    } else {
      if (fetching) {
        return (
          <Container>
            <Spinner size={24} />
          </Container>
        );
      } else {
        return (
          <Container>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Parent</th>
                    <th>Sub-Tasks</th>
                    <th>Links</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((issue, i) => (
                    <BorderTr key={i}>
                      <td>{this.renderIssue(issue)}</td>
                      <td>{this.renderIssue(issue.fields.parent)}</td>
                      <td>{this.renderIssues(issue.fields.subtasks)}</td>
                      <td>{this.renderLinks(issue.fields.issuelinks)}</td>
                    </BorderTr>
                  ))}
                </tbody>
              </table>
            </TableContainer>
            <Button
              isLoading={gettingMore}
              isDisabled={noMore}
              onClick={() => this.more()}
            >
              More
            </Button>
          </Container>
        );
      }
    }
  }
}

export default TabularContent;
