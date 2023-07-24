export function removeUndefined(obj: any): any {
  Object.keys(obj).forEach(
    (key: string) => obj[key] === undefined && delete obj[key]
  );
  return obj;
}
