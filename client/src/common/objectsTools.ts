export function removeUndefined(obj: any): any {
  Object.keys(obj).forEach(
    (key: string) => obj[key] === undefined && delete obj[key]
  );
  return obj;
}

export function toHHMMSS(sec_num: number): string {
  let hours = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);
  const pad = (n: number) => n < 10 ? `0${n}` : n;
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

interface AnyObject {
  [key: string]: any;
}

export function groupBy<T extends AnyObject>(array: T[], property: keyof T): { [key: string]: T[] } {
  return array.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as { [key: string]: T[] });
}

