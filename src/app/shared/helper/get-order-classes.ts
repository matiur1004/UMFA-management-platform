export const getOrderClasses = (orderIndex: number, asc: number, desc: number): string[] => {
  const classArr: string[] = [];
  (orderIndex !== asc && orderIndex !== desc) ? classArr.push('inactive') : classArr.push('');
  (orderIndex === desc) ? classArr.push('dnm-icon-sort-up') : classArr.push('');
  (orderIndex !== desc) ? classArr.push('dnm-icon-sort-down') : classArr.push('');
  return classArr;
};

export const getActiveOrderClass = (orderIndex: number, asc: number, desc: number): string => {
  return (orderIndex === asc || orderIndex === desc) ? 'active' : '';
};

export const setDescOrAsc = (currentOrder: number, order: number): number => {
  return (currentOrder === order || (currentOrder === (order * -1))) ? currentOrder * -1 : order;
};

export const getSortValue = (currentOrder, nextOrder) => {
  return (currentOrder === nextOrder || (currentOrder === (nextOrder * -1))) ? currentOrder * -1 : nextOrder;
};
