import { ipcMain } from "electron";
import { loadScenesFromFile, saveScenesToFile, selectFileToLoad, selectFileToSave } from "./file";

export const registerHandlers = () => {
    ipcMain.handle("select-file-to-load", (event) => selectFileToLoad());
    ipcMain.handle("select-file-to-save", (event) => selectFileToSave());
    ipcMain.handle("load-scenes-from-file", (event, args) => loadScenesFromFile(args));
    ipcMain.handle("save-scenes-to-file", (event, args) => saveScenesToFile(args));
}