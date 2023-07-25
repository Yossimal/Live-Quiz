type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
type State<T> = [T, StateSetter<T>];
type PartialStateSetter<T> = (newValue: T) => void;
type PartialState<T> = [T, PartialStateSetter<T>];
