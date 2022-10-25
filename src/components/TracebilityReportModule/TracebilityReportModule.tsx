import React, { useState } from "react";
import ReactDOM from "react-dom";
import URLSearchParams from "@ungap/url-search-params";
import LicenseContainer from "./components/LicenseContainer";
import Page, { Grid, GridColumn } from "@atlaskit/page";
import TabularContent from "../home/TabularContent";
import styled from "styled-components";
import {Header} from './Header'
import { TracebilityContext } from "./tracebilityContext";
const FullWidthContainer = styled.div`
  width: 100%;
`;

// class Main extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }

//   updateFilter = (filter) => {
//     const jql = "filter=" + filter.id;
//     this.table.update(jql);
//   };

//   render() {
//     const { filter } = this.state;
//     return (
//       <Page>
//         <FullWidthContainer>
//           <Grid spacing="compact" layout="fluid">
//             <GridColumn>
//               <Header filter={(filter) => this.updateFilter(filter)} />
//             </GridColumn>
//           </Grid>
//           <Grid spacing="compact" layout="fluid">
//             <GridColumn>
//               <TabularContent
//                 xdm={this.props.xdm}
//                 onRef={(ref) => (this.table = ref)}
//               />
//             </GridColumn>
//           </Grid>
//         </FullWidthContainer>
//       </Page>
//     );
//   }
// }


export const TracebilityReportModule = () => {
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);
  const tracebilityContextValue = {
    selectedFilterId,
    setSelectedFilterId
  }
  return (
    <TracebilityContext.Provider value={tracebilityContextValue}>
    <Page>
      <FullWidthContainer>
      <Header />
      </FullWidthContainer>
    </Page>
    </TracebilityContext.Provider>
  )
}