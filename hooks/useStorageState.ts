import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export async function setStorageItemAsync(key: string, value: string | null) {
  if (Platform.OS === "web") {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  } else {
    if (value == null) {
      await SecureStore.deleteItemAsync(key);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }
}

function useStorageState(
  key: string
): [[boolean, string | null], (value: [boolean, string | null]) => void] {
  const [state, setState] = useState<[boolean, string | null]>([true, null]);

  const setValue = useCallback(
    (value: [boolean, string | null]) => {
      setState([value[0], value[1]]);
      setStorageItemAsync(key, value[1]);
    },
    [key]
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      try {
        if (typeof localStorage !== "undefined") {
          setState([false, localStorage.getItem(key)]);
        }
      } catch (e) {
        console.error("Local storage is unavailable: ", e);
      }
    } else {
      SecureStore.getItemAsync(key).then((value) => {
        setState([false, value]);
      });
    }
  }, [key]);

  return [state, setValue];
}

export default useStorageState;
