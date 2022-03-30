import React, { Component } from "react";
import styled from "styled-components";
import PageHeader from "@atlaskit/page-header";
import BottomBarContent from "./BottomBarContent";
import { colors } from "@atlaskit/theme";

const MainBar = styled.div`
  display: flex;
  background-color: ${colors.N20}
  padding: 10px;
  border-radius: 3px;
`;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateFilter = (data) => {
    this.props.filter(data);
  };

  bottomBar = (
    <MainBar>
      <BottomBarContent filter={(data) => this.updateFilter(data)} />
    </MainBar>
  );

  render() {
    return (
      <PageHeader bottomBar={this.bottomBar}>
        Links Explorer Traceability and Reports
      </PageHeader>
    );
  }
}

export default Header;
