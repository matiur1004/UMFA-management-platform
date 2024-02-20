export interface TreeModel {
  id: string;
  children: TreeModel[];
}

export const getTreeChildrenIds = (tree: TreeModel, childrenIds: Set<string> = null): Set<string> => {
  if (childrenIds == null) {
    childrenIds = new Set<string>();
  }
  if (tree && tree.children.length) {
    for (const subTree of tree.children) {
      if (subTree.children && subTree.children.length > 0) {
        getTreeChildrenIds(subTree, childrenIds);
      }
      childrenIds.add(subTree.id);
    }
  }

  return childrenIds;
};
