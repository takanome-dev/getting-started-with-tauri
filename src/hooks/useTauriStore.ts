import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Store } from "tauri-plugin-store-api";
import { useTauriContext } from "../context/tauri-provider";
import { APP_NAME } from "../utils/constants";

// interface Stores {
//   [key: string]: Store;
// }

// const stores = {};

// function getTauriStore(filename: string) {
//   if (!(filename in stores)) return stores[filename] = new Store(filename);
//   return stores[filename];
// }

export default function useTauriStore(
  key: string,
  defaultValue: string,
  storeName = "data.dat"
) {
  const [state, setState] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  const { fileSep, documents } = useTauriContext();
  const storePath = `${documents}${APP_NAME}${fileSep}${storeName}`;

  const store = new Store(storePath);

  useLayoutEffect(() => {
    store
      .get(key)
      .then(value => {
        setState((value as string) ?? defaultValue);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        store.get(key).then(() => {
          timeoutRef.current = setTimeout(() => store.save(), 1000);
        });

        return () => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
      });
  }, []);

  useEffect(() => {
    if (!loading) {
      clearTimeout(timeoutRef.current!);
      store.set(key, state).then(() => {
        timeoutRef.current = setTimeout(() => store.save(), 1000);
      });
    }
  }, [state]);

  return [state, setState, loading] as const;
}
