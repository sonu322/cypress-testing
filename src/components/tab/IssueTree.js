//@flow
import React, { Component } from "react";
import styled from "styled-components";
import ChevronDownIcon from "@atlaskit/icon/glyph/chevron-down";
import ChevronRightIcon from "@atlaskit/icon/glyph/chevron-right";
import Spinner from "@atlaskit/spinner";
import Button from "@atlaskit/button";
import { Item } from "@atlaskit/navigation-next";
import { colors } from "@atlaskit/theme";
import Lozenge from "@atlaskit/lozenge";
import { IssueLinkAPI } from "../api";
import { UUID, getStatusAppearance } from "../../util";
import IssueDetail from "./IssueDetail";

import Tree, {
  mutateTree,
  type RenderItemParams,
  type TreeItem,
  type TreeData,
  type ItemId
} from "@atlaskit/tree";

const PADDING_LEVEL = 30;

const SUB_TASKS = "Subtasks";
const PARENT = "Parent";

const Box = styled.span`
  display: flex;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
`;

const LinkTypeContainer = styled.div`
  display: flex;
  height: 32px;
  line-height: 32px;
  border: none;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: ${colors.N30}
  fill: ${colors.N30};
  padding-left: 6px;
  padding-right: 6px;
  font-weight: 500;
  text-transform: capitalize;
`;
const ItemWrapper = styled.div`
  display: flex;
  width: 270px;  
`;

const IconContainer = styled.span`
  display: flex;
  width: 16px;
  overflow: hidden;
  height: 16px;
`;

const Container = styled.div`
  display: flex;
`;

const SpinnerContainer = styled.span`
  display: flex;
  min-width: 24px;
  width: 24px;
  height: 32px;
  justify-content: center;
  font-size: 12px;
  line-height: 32px;
  padding-top: 8px;
`;

const InnerElem = styled.div`
  display: flex;
`;

const TextContent = styled.span`
  margin-left: 4px;
  font-weight: 500;
  vertical-align: middle;
`;


type State = {|
  tree: TreeData,
  fetched: boolean
|};

type Props = {
  filter: {|
    issueType: Array<string>,
    linkType: Array<string>,
    priority: Array<string>
  |},
  onRef: function
};

class IssueTree extends Component<Props, State> {
  _isMounted: boolean = false;

  root: TreeData = {
    rootId: "0",
    items: {
      "0": {
        id: "0",
        children: [],
        hasChildren: true,
        isExpanded: true,
        isChildrenLoading: false,
        data: {
          title: "Fake Root Node"
        }
      }
    }
  };

  state = {
    tree: mutateTree(this.root, "0", { isExpanded: true }),
    fetched: false
  };

  static formatIssueData(data: Object, parent: ItemId) {
    return {
      title: data.key,
      id: data.id,
      parent: parent,
      summary: data.fields.summary,
      type: data.fields.issuetype,
      priority: data.fields.priority,
      status: data.fields.status,
      isType: false
    };
  }

  static formatIssue(
    data: Object,
    parentTypeID: ?ItemId,
    parentIssueID: ?ItemId
  ) {
    let hasChildren = false;
    const ids = [];
    const typeMap = new Map();
    const items = [];
    const subTasks = [];
    const subTypeID = UUID(); //`${data.id}-0`;
    if (data.fields.subtasks.length > 0) {
      typeMap.set(SUB_TASKS, {
        id: subTypeID,
        children: subTasks,
        hasChildren: true,
        isChildrenLoading: false,
        isExpanded: true,
        data: {
          id: "-1",
          parent: data.id,
          title: SUB_TASKS,
          summary: "Issue Sub Tasks",
          isType: true
        }
      });
    }

    for (const issue of data.fields.subtasks) {
      if (issue.id !== parentIssueID) {
        const issueID = UUID(); //`${data.id}-${issue.id}`;
        subTasks.push(issueID);
        items.push({
          id: issueID,
          children: [],
          hasChildren: true,
          isChildrenLoading: false,
          isExpanded: false,
          data: IssueTree.formatIssueData(issue, subTypeID)
        });
      }
    }
    if (subTasks.length === 0) {
      typeMap.delete(SUB_TASKS);
    } else {
      hasChildren = true;
      ids.push(subTypeID);
    }

    if (data.fields.parent) {
      const parentIssueLinkID = UUID();
      const parentIssueTypeID = UUID();
      const parent = data.fields.parent;
      if (parent.id !== parentIssueID) {
        typeMap.set(PARENT, {
          id: parentIssueLinkID,
          children: [parentIssueTypeID],
          hasChildren: true,
          isChildrenLoading: false,
          isExpanded: true,
          data: {
            id: "-1",
            parent: data.id,
            title: PARENT,
            summary: "Issue parent",
            isType: true
          }
        });

        items.push({
          id: parentIssueTypeID,
          children: [],
          hasChildren: true,
          isChildrenLoading: false,
          isExpanded: false,
          data: IssueTree.formatIssueData(parent, parentIssueLinkID)
        });

        ids.push(parentIssueLinkID);
      }
    }

    const typeIDMap = new Map();
    const getTypeID = (id, inwards) => {
      const key = id + (inwards ? "-inwards" : "-outwards");
      if (!typeIDMap.has(key)) {
        typeIDMap.set(key, UUID());
      }
      return typeIDMap.get(key);
    };

    for (const { id, type, inwardIssue, outwardIssue } of data.fields
      .issuelinks) {
      if (
        type.id !== parentTypeID &&
        ((inwardIssue && inwardIssue.id !== parentIssueID) ||
          (outwardIssue && outwardIssue.id !== parentIssueID))
      ) {
        hasChildren = true;
        const inwards = inwardIssue ? true : false;
        const typeID = getTypeID(type.id, inwards); //`${data.id}-${type.id}`;
        if (!typeMap.has(typeID)) {
          typeMap.set(typeID, {
            id: typeID,
            children: [],
            hasChildren: true,
            isChildrenLoading: false,
            isExpanded: true,
            data: {
              id: type.id,
              parent: data.id,
              title: inwards ? type.inward : type.outward,
              name: data.name,
              summary: `${type.inward} <- ${type.outward}`,
              isType: true
            }
          });
          ids.push(typeID);
        }

        const map: Object = typeMap.get(typeID);
        if (inwardIssue) {
          const issueID = UUID(); //`${data.id}-${inwardIssue.id}`;
          map.children.push(issueID);
          items.push({
            id: issueID,
            children: [],
            hasChildren: true,
            isChildrenLoading: false,
            isExpanded: false,
            data: IssueTree.formatIssueData(inwardIssue, typeID)
          });
        }
        if (outwardIssue) {
          const issueID = UUID(); //`${data.id}-${outwardIssue.id}`;
          map.children.push(issueID);
          items.push({
            id: issueID,
            children: [],
            hasChildren: true,
            isChildrenLoading: false,
            isExpanded: false,
            data: IssueTree.formatIssueData(outwardIssue, typeID)
          });
        }
      }
    }

    for (const [key, value] of typeMap) {
      items.push(value);
    }

    return {
      children: items,
      data: {
        id: data.id,
        children: ids,
        hasChildren: hasChildren,
        isChildrenLoading: false,
        isExpanded: true,
        data: IssueTree.formatIssueData(data)
      }
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.onRef(this);
    IssueLinkAPI().then(data => {
      if (this._isMounted) {
        const value = IssueTree.formatIssue(data, null, null);
        this.root.items[data.id] = value.data;
        this.root.items["0"].children.push(data.id);
        for (const child of value.children) {
          this.root.items[child.id] = child;
        }
      }

      this.setState({
        tree: mutateTree(this.root, "0", { isExpanded: true }),
        fetched: true
      });
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.onRef(null);
  }

  static getIcon(
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void
  ) {
    if (item.isChildrenLoading) {
      return (
        <SpinnerContainer onClick={() => onCollapse(item.id)}>
          <Spinner size={16} />
        </SpinnerContainer>
      );
    }
    if (item.hasChildren) {
      return item.isExpanded ? (
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={() => onCollapse(item.id)}
        >
          <ChevronDownIcon label="" size={16} />
        </Button>
      ) : (
        <Button
          spacing="none"
          appearance="subtle-link"
          onClick={() => onExpand(item.id)}
        >
          <ChevronRightIcon label="" size={16} />
        </Button>
      );
    }

    return <Box />;
  }

  static getItemStyle(depth: number) {
    const style = {
      width: "300px",
      margin: ".5em 0",
      display: "flex",
      marginLeft: "0px"
    };

    style["marginLeft"] = PADDING_LEVEL * depth + "px";

    return style;
  }

  renderItem = ({
    item,
    onExpand,
    onCollapse,
    provided,
    depth
  }: RenderItemParams) => (
    <div
      style={IssueTree.getItemStyle(depth)}
      ref={provided.innerRef}
      {...provided.dragHandleProps}
    >
      {IssueTree.getIcon(item, onExpand, onCollapse)}
      {item.data && item.data.isType ? (
        <LinkTypeContainer>
          {item.data ? item.data.title : "No Name"}
        </LinkTypeContainer>
      ) : (
        <ItemWrapper>
          <Item
            after={() => <IssueDetail id={item.data ? item.data.id : null} />}
            before={() => (
              <span>
                <IconContainer>
                  <img
                    height={16}
                    width={16}
                    src={item.data ? item.data.type.iconUrl : ""}
                    title={
                      item.data
                        ? `${item.data.type.name} - ${item.data.type.description}`
                        : ""
                    }
                  />
                </IconContainer>
                <IconContainer>
                  <img
                    height={16}
                    width={16}
                    src={item.data ? item.data.priority.iconUrl : ""}
                    title={item.data ? item.data.priority.name : ""}
                  />
                </IconContainer>
              </span>
            )}
            text={
              <div>
                <Lozenge
                  maxWidth={100}
                  appearance={
                    item.data
                      ? getStatusAppearance(
                          item.data.status.statusCategory
                        )
                      : "default"
                  }
                >
                  {item.data ? item.data.status.name : ""}
                </Lozenge>
                <TextContent>{item.data ? item.data.title : ""}</TextContent>
              </div>
            }
            subText={item.data ? item.data.summary : ""}
            component={InnerElem}
            styles={styles => {
              styles.itemBase.cursor = "default";
              styles.itemBase.backgroundColor = colors.N20;
              styles.itemBase.fill = colors.N20;
              styles.itemBase.paddingLeft = 6;
              styles.itemBase.paddingRight = 6;
              styles.beforeWrapper.marginRight = 8;
              styles.afterWrapper.marginLeft = 8;
              return styles;
            }}
          />
        </ItemWrapper>
      )}
    </div>
  );

  onExpand = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, { isChildrenLoading: true })
    });

    const ntree = this.state.tree;
    const item = ntree.items[itemId];

    if (item.hasChildren && item.children.length > 0) {
      this.setState({
        tree: mutateTree(ntree, itemId, {
          isExpanded: true,
          isChildrenLoading: false
        })
      });
    } else if (item.hasChildren && item.children.length === 0) {
      IssueLinkAPI(item.data ? item.data.id : null).then(data => {
        let parent = (item.data || {}).parent;
        const parentType = parent ? ntree.items[parent] : null;
        parent = parent
          ? ((ntree.items[parent] || {}).data || {}).parent
          : null;
        const parentIssue = parent ? ntree.items[parent] : null;

        const parentTypeID = ((parentType || {}).data || {}).id;
        const parentIssueID = ((parentIssue || {}).data || {}).id;

        const value = IssueTree.formatIssue(data, parentTypeID, parentIssueID);

        for (const child of value.children) {
          if (!ntree.items[child.id]) {
            ntree.items[child.id] = child;
          }
        }

        item.hasChildren = value.data.hasChildren;
        item.children = value.data.children;

        this.setState({
          tree: mutateTree(ntree, itemId, {
            isExpanded: true,
            isChildrenLoading: false
          })
        });
      });
    }
  };

  onCollapse = (itemId: ItemId) => {
    const { tree }: State = this.state;
    this.setState({
      tree: mutateTree(tree, itemId, {
        isExpanded: false,
        isChildrenLoading: false
      })
    });
  };

  export() {
    const { tree } = this.state;
    const root = tree.items[tree.rootId];
    const rootChildren = root.children;

    const contents = [];

    const process = (item, indent) => {
      if (!item) return;
      const content = {
        indent: indent,
        key: '',
        link: '',
        summary: '',
        type: '',
        status: '',
        priority: ''
      };

      if (item.data) {
        const data = item.data;
        if (data.isType) {
          content.link = data.title;
        } else {
          content.key = data.title;
          content.summary = data.summary;
          content.type = data.type.name;
          content.status = data.status.name;
          content.priority = data.priority.name;
        }
      }

      contents.push(content);
      if (item.hasChildren) {
        const nextIndent = indent + 1;
        item.children.forEach(key => {
          process(tree.items[key], nextIndent);
        })
      }
    };

    process(tree.items[rootChildren[0]], 1);

    return contents;
  }

  render() {
    const { tree, fetched } = this.state;
    //const items: Object = tree.items;
    const hiddedTree = mutateTree(
      {
        rootId: "0",
        items: {
          "0": {
            id: "0",
            children: [],
            hasChildren: true,
            isExpanded: true,
            isChildrenLoading: false,
            data: {
              title: "Fake Root Node"
            }
          }
        }
      },
      "0",
      { isExpanded: true }
    );

    if (fetched) {
      const { linkType, issueType, priority } = this.props.filter;
      const root = tree.items[tree.rootId];
      const rootChildren = root.children;
      Object.keys(tree.items).forEach(key => {
        const item = JSON.parse(JSON.stringify(tree.items[key]));
        if (item.data) {
          const data = item.data;
          if (key == tree.rootId || rootChildren.includes(key)) {
            hiddedTree.items[key] = item;
          } else {
            if (data.isType) {
              if (
                linkType.length === 0 ||
                linkType.includes(data.id) ||
                data.id === "-1"
              ) {
                hiddedTree.items[key] = item;
              }
            } else {
              if (
                (issueType.length === 0 || issueType.includes(data.type.id)) &&
                (priority.length === 0 || priority.includes(data.priority.id))
              ) {
                hiddedTree.items[key] = item;
              }
            }
          }
        }
      });
    }

    const keys = Object.keys(hiddedTree.items);
    keys.forEach(key => {
      const item = hiddedTree.items[key];
      item.children = item.children.filter(i => keys.includes(i));
      if (item.children.length === 0 && item.isExpanded) {
        item.hasChildren = false;
      }
    });

    return (
      <Container>
        <Tree
          tree={hiddedTree}
          renderItem={this.renderItem}
          onExpand={this.onExpand}
          onCollapse={this.onCollapse}
          isDragEnabled={false}
        />
      </Container>
    );
  }
}

export default IssueTree;
