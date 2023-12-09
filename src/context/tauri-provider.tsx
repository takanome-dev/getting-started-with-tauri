import React, { useState, useEffect, useContext, createContext } from "react";
import * as tauriPath from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/api/fs";
import * as os from "@tauri-apps/api/os";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { APP_NAME, RUNNING_IN_TAURI } from "../utils/constants";

interface InitialState {
  loading: boolean;
  downloads: string | undefined;
  documents: string | undefined;
  appDocuments: string | undefined;
  osType: string | undefined;
  fileSep: string;
}

const initialState: InitialState = {
  loading: true,
  downloads: undefined,
  documents: undefined,
  appDocuments: undefined,
  osType: undefined,
  fileSep: "/",
};

const TauriContext = createContext(initialState);
export const useTauriContext = () => useContext(TauriContext);

export function TauriProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [downloads, setDownloadDir] = useState("");
  const [documents, setDocumentDir] = useState("");
  const [osType, setOsType] = useState("");
  const [fileSep, setFileSep] = useState("/");
  const [appDocuments, setAppDocuments] = useState("");

  useEffect(() => {
    if (RUNNING_IN_TAURI) {
      const callTauriAPIs = async () => {
        // Handle additional app launches (url, etc.)
        await listen("new-instance", ({ payload, ...eventObj }) => {
          appWindow.unminimize().then(() => appWindow.setFocus());
          // let args = payload?.args;
          // let cwd = payload?.cwd;
          // if (args?.length > 1) { }
        });
        setDownloadDir(await tauriPath.downloadDir());
        const _documents = await tauriPath.documentDir();
        setDocumentDir(_documents);
        const _osType = await os.type();
        setOsType(_osType);
        const _fileSep = _osType === "Windows_NT" ? "\\" : "/";
        setFileSep(_fileSep);
        await fs.createDir(APP_NAME, {
          dir: fs.BaseDirectory.Document,
          recursive: true,
        });
        setAppDocuments(`${_documents}${APP_NAME}`);
        setLoading(false);
        // show window if not using the window state plugin
        // https://github.com/tauri-apps/tauri/issues/1564
        invoke("show_main_window");
      };
      callTauriAPIs().catch(console.error);
    }
  }, []);

  const value = {
    loading,
    fileSep,
    downloads,
    documents,
    osType,
    appDocuments,
  };

  return (
    <TauriContext.Provider value={value}>{children}</TauriContext.Provider>
  );
}
