import { useState, useEffect } from "react";
import { Serializiation } from "../types/serialization";

export const useLocalStorage = <T>(
    key: string,
    initialValue: T,
    serialization?: Serializiation<T>
): [T, (value: T) => void] => {
    const [value, setValue] = useState<T>(() => {
        const storedValue = localStorage.getItem(key);
        const parsedValue = storedValue ? JSON.parse(storedValue) : initialValue;
        if (serialization) {
            return serialization[1](parsedValue);
        }
        return parsedValue;
    });

    useEffect(() => {
        const handleStorageChange = (event: StorageEvent) => {
            if (event.storageArea === localStorage && event.key === key) {
                // console.log("useSessionStorage: storage change", event.newValue);
                setValue(JSON.parse(event.newValue!));
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [key]);

    const updateLocalStorage = (newValue: T) => {
        setValue(newValue);
        const newValueAsUnknow = serialization ? serialization[0](newValue) : newValue;
        const newData = JSON.stringify(newValueAsUnknow);
        localStorage.setItem(key, newData);

        //dispatch event to notify other components
        const storageEvent = new StorageEvent("storage", {
            key,
            newValue: newData,
            storageArea: localStorage,
        });
        window.dispatchEvent(storageEvent);
    };

    return [value, updateLocalStorage];
}
