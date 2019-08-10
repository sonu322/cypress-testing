import React from "react";
import ReactDOM from "react-dom";
import Toolbar from "./components/tab/Toolbar";
import IssueTree from "./components/tab/IssueTree";
import URLSearchParams from "@ungap/url-search-params";
import LicenseContainer from "./components/LicenseContainer";
import { csv, download } from "./util";

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

  export(toolbar) {
    const content = this.tree.export();
    download("csv", csv(content, true));
    toolbar.exported();
  }

  render() {
    const { filter } = this.state;
    return (
      <div>
        <Toolbar
          filter={data => this.updateFilter(data)}
          export={ref => this.export(ref)}
        />
        <IssueTree filter={filter} onRef={ref => (this.tree = ref)} />
      </div>
    );
  }
}

const searcher = new URLSearchParams(location.search);
const App = document.getElementById("app");

if (searcher.has("lic") && "none" === searcher.get("lic")) {
  ReactDOM.render(<LicenseContainer />, App);
} else {
  ReactDOM.render(<Main />, App);
}
