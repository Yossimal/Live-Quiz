type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type OptionalNullable<T> = Optional<Nullable<T>>;
type FullFunciton<RET, ARGS extends any[]> = (...args: ARGS) => RET;