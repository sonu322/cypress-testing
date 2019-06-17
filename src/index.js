import React from "react";
import ReactDOM from "react-dom";
import Toolbar from "./components/Toolbar";
import IssueTree from "./components/IssueTree";
import URLSearchParams from "@ungap/url-search-params";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";

const NoLicense = styled.div`
  color: ${colors.R500};
`;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: {
        issueType: [],
        linkType: [],
        priority: []
      }
    };
  }

  updateFilter(filter) {
    this.setState({
      filter: filter
    });
  }

  render() {
    const { filter } = this.state;
    return (
      <div>
        <Toolbar filter={data => this.updateFilter(data)} />
        <IssueTree filter={filter} />
      </div>
    );
  }
}

const searcher = new URLSearchParams(location.search);
const App = document.getElementById("app");

const LicenceContainer = () => {
  return <NoLicense>Error: you don't have valid license</NoLicense>;
};

if (searcher.has("lic") && "none" === searcher.get("lic")) {
  ReactDOM.render(<LicenceContainer />, App);
} else {
  ReactDOM.render(<Main />, App);
}
