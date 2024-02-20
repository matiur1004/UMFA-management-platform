export const setURL = function (...data) {
  const args = Array.prototype.slice.call(arguments, 1);
  let newUrl: string = data[0];
  args.forEach((arg, index) => newUrl = newUrl.replace(`{${index}}`, arg));
  return newUrl;
};
