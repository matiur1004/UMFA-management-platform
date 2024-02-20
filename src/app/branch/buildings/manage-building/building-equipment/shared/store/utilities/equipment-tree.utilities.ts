import {EquipmentTreeModel} from "@models";

export const getAllEquipmentsFromTree = (equipments: EquipmentTreeModel[], level = 0, parent: EquipmentTreeModel = null): EquipmentTreeModel[] => {
  let list = [];
  equipments.forEach((el, i) => {
    el.level = level;
    el.index = i;
    if (parent) {
      el.parentLocation = parent.location;
    }
    list.push(el);
  });
  equipments.forEach(el => {
    if (el.children && el.children.length) {
      list = list.concat(getAllEquipmentsFromTree(el.children, level + 1, el));
    }
  });
  return list;
}

export const collectLocations = (list: EquipmentTreeModel[]): any[] => {
  const locationList: any[] = [];
  if (list && list.length) {
    list.forEach(el => {
      if (!locationList.some(locItem => el.location && locItem.id === el.location.locationId)) {
        locationList.push({
          id: el.location && el.location.locationId,
          name: el.location && el.location.locationName
        });
      }
    });
  }
  return locationList;
}

export const collectNodes = (list: EquipmentTreeModel[]): any[] => {
  const nodeList = [{id: '', name: 'All', nodeType: ''}];
  if (list && list.length) {
    list.forEach(el => {
      const nodes = el.nodes;
      nodes.forEach(nodeEl => {
        if (!nodeList.some(node => node.id === nodeEl.id)) {
          nodeList.push({
            id: nodeEl.id,
            name: nodeEl.name,
            nodeType: nodeEl['nodeType']
          });
        }
      });
    });
  }
  return nodeList;
}
