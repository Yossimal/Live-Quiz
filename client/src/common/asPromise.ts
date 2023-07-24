

export default function asPromise<T>(val:T):Promise<T> {
  return new Promise((resolve, _) => {
    resolve(val);
  });
}