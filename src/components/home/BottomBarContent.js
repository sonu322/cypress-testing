import React, { Component } from "react";
import Button, { ButtonGroup } from "@atlaskit/button";
import Spinner from "@atlaskit/spinner";
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem
} from "@atlaskit/dropdown-menu";
import { FilterAPI } from "../api";
import Page, { Grid, GridColumn } from "@atlaskit/page";
import { HelpLink } from "../../constants";
import styled from "styled-components";
import QuestionIcon from "@atlaskit/icon/glyph/question";

const AlignRight = styled.div`
  text-align: right;
`;

class BottomBarContent extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      fetched: false,
      options: [],
      selected: {
        name: "Select filter"
      }
    };
  }

  componentDidMount() {
    this._isMounted = true;
    FilterAPI().then(data => {
      if (this._isMounted) {
        this.setState({
          fetched: true,
          options: data
        });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  select(id) {
    const selects = this.state.options.filter(entry => entry.id === id);
    this.setState({
      selected: selects[0]
    });
  }
  apply() {
    this.props.filter(this.state.selected);
  }

  render() {
    const { fetched, options, selected } = this.state;
    if (!fetched) {
      return (
        <React.Fragment>
          <Spinner size="small" />
        </React.Fragment>
      );
    } else {
      return (
        <Page>
          <Grid spacing="compact" layout="fluid">
            <GridColumn medium={10}>
              <ButtonGroup>
                <DropdownMenu
                  triggerType="button"
                  trigger={selected.name}
                  shouldFlip={false}
                  position="bottom right"
                  triggerButtonProps={{
                    className: "toolbar-select"
                  }}
                >
                  <DropdownItemGroup>
                    {Object.keys(options).map(key => (
                      <DropdownItem
                        key={options[key].id}
                        id={options[key].id}
                        onClick={() => {
                          this.select(options[key].id);
                        }}
                      >
                        {options[key].name}
                      </DropdownItem>
                    ))}
                  </DropdownItemGroup>
                </DropdownMenu>
                <Button appearance="primary" onClick={() => this.apply()}>
                  Apply
                </Button>
              </ButtonGroup>
            </GridColumn>
            <GridColumn medium={2}>
              <AlignRight>
                <ButtonGroup>
                  <Button
                    appearance="default"
                    target="_blank"
                    href={HelpLink}
                    iconBefore={<QuestionIcon />}
                  />
                </ButtonGroup>
              </AlignRight>
            </GridColumn>
          </Grid>
        </Page>
      );
    }
  }
}

export default BottomBarContent;
