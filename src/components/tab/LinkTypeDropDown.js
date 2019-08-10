import React, { Component } from "react";
import PropTypes from "prop-types";
import { LinkTypeAPI } from "../api";
import DropdownMenu, {
  DropdownItemGroupCheckbox,
  DropdownItemCheckbox
} from "@atlaskit/dropdown-menu";
import Spinner from "@atlaskit/spinner";

class LinkTypeDropdown extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      links: [],
      selected: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    LinkTypeAPI().then(data => {
      if (this._isMounted) {
        const selected = data.issueLinkTypes.map(({ id }) => id);
        this.setState(
          {
            selected: selected,
            fetched: true,
            links: data.issueLinkTypes
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
    const { fetched, links, selected } = this.state;
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
            trigger="Link Types"
            shouldFlip={false}
            position="bottom right"
            isCompact={true}
          >
            <DropdownItemGroupCheckbox>
              {Object.keys(links).map(key => (
                <DropdownItemCheckbox
                  key={key}
                  id={links[key].id}
                  isSelected={selected.includes(links[key].id)}
                  onClick={() => {
                    this.click(links[key].id);
                  }}
                >
                  {links[key].name}
                </DropdownItemCheckbox>
              ))}
            </DropdownItemGroupCheckbox>
          </DropdownMenu>
        </React.Fragment>
      );
    }
  }
}

LinkTypeDropdown.propTypes = {
  filter: PropTypes.func
};

export default LinkTypeDropdown;
