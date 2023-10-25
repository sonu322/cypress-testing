import { Tree, TreeNode } from "../types";
import s from "../selectors";

interface Item {
  name: string;
  level: number;
}

function constructTree(items: Item[]): Tree {
  const roots: TreeNode[] = [];
  const nodeStack: TreeNode[] = [];

  for (const item of items) {
    const treeNode: TreeNode = { name: item.name, children: [] };

    while (nodeStack.length > item.level) {
      nodeStack.pop();
    }

    if (nodeStack.length > 0) {
      nodeStack[nodeStack.length - 1].children.push(treeNode);
    } else {
      roots.push(treeNode);
    }

    nodeStack.push(treeNode);
  }

  return { roots };
}

export function verifyTree(el: string, expectedTree: Tree): void {
  const $element = Cypress.$(el);
  const items = Cypress.$(s.lxpTreeItem, $element);
  const nodes = [];
  items.each((index, node) => {
    const itemKeyNode = Cypress.$(s.issueKeyClassName, node);
    let itemName = "";
    if(itemKeyNode.length > 0){
      itemName = itemKeyNode[0].textContent;
    } else {
      itemName = node.textContent;
    }
    nodes.push({
      name: itemName,
      level: Number(node.dataset.itemLevel)
    });
  });
  console.log("nodes: ", nodes);
  const actualTree: Tree = constructTree(nodes);
  console.log("actual Tree: ", JSON.stringify(actualTree));
  console.log("expected Tree: ", JSON.stringify(expectedTree));
  expect(actualTree).to.deep.equal(expectedTree);
}