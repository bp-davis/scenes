import { Scene } from "../../renderer/GlobalState/ScenesStore";

import { promises as fs } from "fs";
import { loadScenesFromFile, saveScenesToFile } from "./file";

test("Load empty file returns empty array", async () => {
    const got = await loadScenesFromFile({
        filePath: "not-a-file.txt"
    });
    expect(got).toStrictEqual([]);
});

test("Load single scene returns single scene", async () => {
    const filePath = "test/resources/one-scene.txt";
    const got = await loadScenesFromFile({ filePath });
    const want: Scene[] = [
        {
            num: "101",
            shootDate: new Date("7 August 2025 12:00:00").toISOString(),
            notes: [
                {
                    complete: false,
                    id: 1,
                    content: "John goes missing",
                },
                {
                    complete: false,
                    id: 2,
                    content: "Kate finds John",
                },
            ],
            brief: "John goes missing",
        }
    ];
    expect(got).toStrictEqual(want);
});

test("Save single scene matches single scene", async () => {
    const wantPath = "test/resources/one-scene.txt";
    const wantContent = await fs.readFile(wantPath, "utf-8");
    const scenes: Scene[] = [
        {
            num: "101",
            shootDate: new Date("7 August 2025 12:00:00").toISOString(),
            notes: [
                {
                    complete: false,
                    id: 1,
                    content: "John goes missing",
                },
                {
                    complete: false,
                    id: 2,
                    content: "Kate finds John",
                },
            ],
            brief: "John goes missing",
        }
    ];
    const result = await saveScenesToFile({
        filePath: "test/resources/output/one-scene.txt",
        scenes
    });
    expect(result).toBe(true);
    const gotContent = await fs.readFile("test/resources/output/one-scene.txt", "utf-8");
    expect(gotContent).toMatch(wantContent);
});

test("Save and load single scene matches original scene", async () => {
    const wantPath = "test/resources/output/save-load.txt";
    const want: Scene[] = [
        {
            num: "101",
            shootDate: new Date("7 August 2025 12:00:00").toISOString(),
            notes: [
                {
                    complete: false,
                    id: 1,
                    content: "John goes missing",
                },
                {
                    complete: false,
                    id: 2,
                    content: "Kate finds John",
                },
            ],
            brief: "John goes missing",
        }
    ];
    const result = await saveScenesToFile({
        filePath: wantPath,
        scenes: want
    });
    expect(result).toBe(true);
    const got = await loadScenesFromFile({
        filePath: wantPath
    })
    expect(got).toStrictEqual(want);
});
