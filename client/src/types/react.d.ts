type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;
type State<T> = [T, StateSetter<T>];
type ArrayStateSetter<T> = (newValue: T) => void;
type ArrayState<T> = [T, ArrayStateSetter<T>];
