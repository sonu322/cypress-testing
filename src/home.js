import React from "react";
import ReactDOM from "react-dom";
import URLSearchParams from "@ungap/url-search-params";
import LicenseContainer from "./components/LicenseContainer";
import Page, { Grid, GridColumn } from "@atlaskit/page";
import Header from "./components/home/Header";
import TabularContent from "./components/home/TabularContent";
import styled from "styled-components";

const FullWidthContainer = styled.div`
  width: 100%;
`;

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateFilter = (filter) => {
    const jql = "filter=" + filter.id;
    this.table.update(jql);
  };

  render() {
    const { filter } = this.state;
    return (
      <Page>
        <FullWidthContainer>
          <Grid spacing="compact" layout="fluid">
            <GridColumn>
              <Header filter={(filter) => this.updateFilter(filter)} />
            </GridColumn>
          </Grid>
          <Grid spacing="compact" layout="fluid">
            <GridColumn>
              <TabularContent
                xdm={this.props.xdm}
                onRef={(ref) => (this.table = ref)}
              />
            </GridColumn>
          </Grid>
        </FullWidthContainer>
      </Page>
    );
  }
}

const searcher = new URLSearchParams(location.search);
const App = document.getElementById("app");

if (searcher.has("lic") && "none" === searcher.get("lic")) {
  ReactDOM.render(<LicenseContainer />, App);
} else {
  const xdm = searcher.get("xdm_e");
  ReactDOM.render(<Main xdm={xdm} />, App);
}
