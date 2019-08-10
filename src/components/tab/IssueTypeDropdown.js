import React, { Component } from "react";
import PropTypes from "prop-types";
import { IssueTypeAPI } from "../api";
import DropdownMenu, {
  DropdownItemGroupCheckbox,
  DropdownItemCheckbox
} from "@atlaskit/dropdown-menu";
import Spinner from "@atlaskit/spinner";

class IssueTypeDropdown extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      types: [],
      selected: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    IssueTypeAPI().then(data => {
      if (this._isMounted) {
        const selected = data.map(({ id }) => id);
        this.setState(
          {
            selected: selected,
            fetched: true,
            types: data
          },
          () => {
            this.props.filter(this.state.selected);
          }
        );
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  click = id => {
    const { selected } = this.state;
    let updated = [];
    if (selected.includes(id)) {
      updated = selected.filter((item, index) => item != id);
    } else {
      updated = [...selected, id];
    }
    this.setState(
      {
        selected: updated
      },
      () => {
        this.props.filter(this.state.selected);
      }
    );
  };

  render() {
    const { fetched, types, selected } = this.state;
    if (!fetched) {
      return (
        <React.Fragment>
          <Spinner size="small" />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <DropdownMenu
            triggerType="button"
            trigger="Issue Types"
            shouldFlip={false}
            position="bottom right"
            isCompact={true}
          >
            <DropdownItemGroupCheckbox>
              {Object.keys(types).map(key => (
                <DropdownItemCheckbox
                  key={key}
                  id={types[key].id}
                  isSelected={selected.includes(types[key].id)}
                  onClick={() => {
                    this.click(types[key].id);
                  }}
                >
                  {types[key].name}
                </DropdownItemCheckbox>
              ))}
            </DropdownItemGroupCheckbox>
          </DropdownMenu>
        </React.Fragment>
      );
    }
  }
}

IssueTypeDropdown.propTypes = {
  filter: PropTypes.func
};

export default IssueTypeDropdown;
