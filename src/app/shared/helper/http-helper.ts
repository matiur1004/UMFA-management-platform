export function convertAnyToParams(object: {}, separator = '.'): { [param: string]: string | string[] } {
  const params = {};

  for (const innerKey in object) {
    if (object.hasOwnProperty(innerKey) && object[innerKey] !== undefined && object[innerKey] !== null) {
      if (typeof object[innerKey] === 'object' && !Array.isArray(object[innerKey])) {
        const innerValue = object[innerKey];
        const paramsOut = convertAnyToParams(innerValue);
        for (const outerKey in paramsOut) {
          if (paramsOut.hasOwnProperty(outerKey)) {
            params[innerKey + separator + outerKey] = paramsOut[outerKey];
          }
        }
      } else if (Array.isArray(object[innerKey])) {
        for (let i = 0; i < object[innerKey].length; i++) {
          params[innerKey + '[' + i + ']'] = object[innerKey][i];
        }
      } else {
        params[innerKey] = object[innerKey];
      }
    }
  }

  return params;
}
