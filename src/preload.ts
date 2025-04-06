import { contextBridge, ipcRenderer } from "electron";
import { Scene } from "./renderer/GlobalState/ScenesStore";
import { IElectronAPI } from "./interface";

const ElectonAPI: IElectronAPI = {
    selectFileToLoad: () => {
        return ipcRenderer.invoke("select-file-to-load");
    },
    selectFileToSave: () => {
        return ipcRenderer.invoke("select-file-to-save");
    },
    loadScenesFromFile: ({ filePath }: { filePath: string }) => {
        return ipcRenderer.invoke("load-scenes-from-file", { filePath });
    },
    saveScenesToFile: ({ filePath, scenes }: { filePath: string, scenes: Scene[] }) => {
        return ipcRenderer.invoke("save-scenes-to-file", { filePath, scenes });
    },
};

contextBridge.exposeInMainWorld("electronAPI", ElectonAPI);
