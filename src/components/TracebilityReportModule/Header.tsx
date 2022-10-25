import React, { Component } from "react";
import styled from "styled-components";
import PageHeader from "@atlaskit/page-header";
import { colors } from "@atlaskit/theme";
import { Toolbar } from "./Toolbar";
const MainBar = styled.div`
  display: flex;
  background-color: ${colors.N20}
  padding: 10px;
  border-radius: 3px;
`;

// class Headerv extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   updateFilter = (data) => {
//     this.props.filter(data);
//   };

//   bottomBar = (
//     <MainBar>
//       <BottomBarContent filter={(data) => this.updateFilter(data)} />
//     </MainBar>
//   );

//   render() {
//     return (
//       <PageHeader bottomBar={this.bottomBar}>
//         Links Explorer Traceability and Reports
//       </PageHeader>
//     );
//   }
// }

// export default Header;

// import React from "react";

export const Header = () => {
  return (
    <PageHeader bottomBar={<Toolbar />}>
      Links Explorer Traceability and Reports
    </PageHeader>
  );
};
