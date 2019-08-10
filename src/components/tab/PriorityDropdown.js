import React, { Component } from "react";
import PropTypes from "prop-types";
import { PriorityAPI } from "../api";
import DropdownMenu, {
  DropdownItemGroupCheckbox,
  DropdownItemCheckbox
} from "@atlaskit/dropdown-menu";
import Spinner from "@atlaskit/spinner";

class PriorityDropdown extends Component {
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
    PriorityAPI().then(data => {
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
            trigger="Priority"
            shouldFlip={false}
            position="bottom right"
            isCompact={true}
          >
            <DropdownItemGroupCheckbox>
              {Object.keys(types).map(key => (
                <DropdownItemCheckbox
                  key={types[key].id}
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

PriorityDropdown.propTypes = {
  filter: PropTypes.func
};

export default PriorityDropdown;
