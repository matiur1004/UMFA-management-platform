export const getItemsDetails = (page: number, itemsPerPage: number, total: number = 0, items: string = 'items') => {
  let text = '';

  if (itemsPerPage) {
    let start = page * itemsPerPage - itemsPerPage + 1;
    let end = page * itemsPerPage;

    if (start > total) {
      start = total;
    }
    if (end > total) {
      end = total;
    }

    text = `Showing {0}-{1} of {2} ${items}`;
    text = text.replace('{0}', start.toString());
    text = text.replace('{1}', end.toString());
    text = text.replace('{2}', total.toString());
  } else {
    text = `Showing all {0} ${items}`.replace('{0}', total.toString());
  }

  return text;
};
