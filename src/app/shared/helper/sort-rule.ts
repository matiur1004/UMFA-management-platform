export const sortRule = (a, b) => {
  return (a > b) ? 1 : (a < b) ? -1 : 0;
};

export const getSortedSteps = (tariffSteps: any[]): any[] => {
  return [...tariffSteps].map(t => {
    const newItem = {...t};
    newItem.ranges.sort((a, b) => sortRule(a.from, b.from));
    newItem.ranges.sort((a, b) => sortRule(a.to, b.to));
    return newItem;
  });
};
