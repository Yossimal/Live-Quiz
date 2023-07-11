import { useState, useEffect } from "react";
import { Serializiation } from "../types/serialization";

export const useSession = <T>(
  key: string,
  initialValue: T,
  serialization?: Serializiation<T>
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    const storedValue = sessionStorage.getItem(key);
    const parsedValue = storedValue ? JSON.parse(storedValue) : initialValue;
    if (serialization) {
      return serialization[1](parsedValue);
    }
    return parsedValue;
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.storageArea === sessionStorage && event.key === key) {
        // console.log("useSessionStorage: storage change", event.newValue);

        setValue(JSON.parse(event.newValue!));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  const updateSession = (newValue: T) => {
    setValue(newValue);
    const newValueAsUnknow = serialization ? serialization[0](newValue) : newValue;
    const newData = JSON.stringify(newValueAsUnknow);
    // console.log(newData,newValue)
    sessionStorage.setItem(key, newData);

    //dispatch event to notify other components
    const storageEvent = new StorageEvent("storage", {
      key,
      newValue: newData,
      storageArea: sessionStorage,
    });
    window.dispatchEvent(storageEvent);
  };

  return [value, updateSession];
};
