import React from "react";
import ReactDOM from "react-dom";
import Toolbar from "./components/Toolbar";
import IssueTree from "./components/IssueTree";

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

const App = document.getElementById("app");

ReactDOM.render(<Main />, App);
