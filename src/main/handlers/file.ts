import { dialog } from "electron";
import { Scene } from "../../renderer/GlobalState/ScenesStore";
import { promises as fs } from "fs";

export const selectFileToLoad = async (): Promise<string> => {
    try {
        const result = await dialog.showOpenDialog({
            properties: ["openFile"],
        });
        if (result.canceled) {
            console.log("User canceled the file selection.");
            return "";
        }
        const filePath = result.filePaths[0];
        return filePath;
    } catch (error) {
        console.error("Error selecting file:", error);
        return "";
    }
};

export const selectFileToSave = async (): Promise<string> => {
    try {
        const result = await dialog.showSaveDialog({
            properties: ["showOverwriteConfirmation"],
        });
        if (result.canceled) {
            console.log("User canceled the file selection.");
            return "";
        }
        const filePath = result.filePath;
        return filePath;
    } catch (error) {
        console.error("Error selecting file:", error);
        return "";
    }
};

export const loadScenesFromFile = async ({
    filePath,
}: {
    filePath: string,
}) => {
    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const fileLines = fileContent.split("\n");
        let scenes: Scene[] = [];
        let scene: Scene | null = null;
        let episodeNumber = null;
        for (let line of fileLines) {
            line = line.trim();
            if (line.length === 0) continue;
            if (line.indexOf("EPISODE") !== -1) {
                const components = line.split(" ");
                episodeNumber = components[components.length - 1];
            }
            if (episodeNumber === null) continue;
            if (line.startsWith(episodeNumber)) {
                if (scene) {
                    scenes.push(scene);
                }
                scene = {} as Scene;
                const components = line.split(" ");
                const sceneNumber = components[0];
                scene.brief = "";
                scene.num = sceneNumber;
                scene.notes = [];
                scene.shootDate = null;
                if (line.indexOf("-") !== -1) {
                    const dateComponents = line.split("-");
                    let date = dateComponents[1];
                    if (date.indexOf("/") !== -1) {
                        date = date.split("/")[0];
                    }
                    try {
                        date = `12:00:00 ${date} ${new Date().getFullYear()}`;
                        const parsed = new Date(date);
                        scene.shootDate = parsed.toISOString();
                    } catch (err) {
                        scene.shootDate = null;
                    }
                } else {
                    scene.shootDate = null;
                }
            } else {
                if (!scene) continue;
                scene.notes?.push({
                    id: scene.notes.length + 1,
                    content: line,
                    complete: false,
                });
                if (scene.notes?.length === 1) {
                    scene.brief = line;
                }
            }
        }
        if (scene) {
            scenes.push(scene);
        }
        let newScenes: Scene[] = [];
        for (let i = 0; i < scenes.length; ++i) {
            let scene = scenes[i];
            if (newScenes.find((s) => s.num === scene.num)) continue;
            for (let j = i; j < scenes.length - 1; ++j) {
                if (i === j || scene.num !== scenes[j].num) continue;
                try {
                    scene.notes = (scene.notes ?? []).concat(
                        scenes[j].notes ?? [],
                    );
                } catch (err) {
                    scene.notes = [];
                }
            }
            newScenes.push(scene);
        }
        return newScenes;
    } catch (error) {
        return [];
    }
};

export const saveScenesToFile = async ({
    filePath,
    scenes,
}: {
    filePath: string,
    scenes: Scene[],
}): Promise<boolean> => {
    scenes.sort((a, b) => parseInt(a.num) - parseInt(b.num));
    let fileContent = "";
    let episodeNumber = null;
    for (let scene of scenes) {
        let numString = scene.num.toString();
        numString = numString.replace(/\D/g, "");
        let ep = parseInt(numString.substring(0, numString.length - 2));
        if (episodeNumber !== ep) {
            episodeNumber = ep;
            fileContent += `EPISODE ${episodeNumber}\n\n`;
        }
        fileContent += `${scene.num}`;
        if (scene.shootDate) {
            const date = new Date(scene.shootDate);
            fileContent += ` - ${date.getDate()} ${date.toLocaleString("default", { month: "long" })}\n`;
        } else {
            fileContent += `\n`;
        }
        for (let note of scene.notes) {
            fileContent += `${note.content}\n`;
        }
        fileContent += "\n";
    }
    await fs.writeFile(filePath, fileContent);
    return true;
};
