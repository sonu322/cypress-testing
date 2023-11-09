export interface TreeNode {
  name: string;
  children: TreeNode[];
}

export interface Tree {
  roots: TreeNode[];
}

export interface Filter {
  priority?: string[];
  linkType?: string[];
  issueType?: string[];
}

export interface TreeTestCase {
  issueId: string;
  filter: Filter;
  expected: Tree;
}
