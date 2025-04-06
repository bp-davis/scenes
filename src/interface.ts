import { Scene } from "./renderer/GlobalState/ScenesStore";

export interface IElectronAPI {
    selectFileToLoad: () => Promise<string>;
    selectFileToSave: () => Promise<string>;
    loadScenesFromFile: ({ filePath }: { filePath: string}) => Promise<Scene[]>;
    saveScenesToFile: ({ filePath, scenes }: { filePath: string, scenes: Scene[] }) => Promise<boolean>;
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}