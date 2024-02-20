//returns deep property value of object according to path
export function resolveNestedProperties(path: string, obj: Object) {
  return path.split('.').reduce(
    (prev, curr) => {
      return prev ? prev[curr] : null
    }, obj || this);
}
