import { create } from "zustand";

export interface SceneNote {
    id: number;
    content: string;
    complete: boolean;
}

export interface Scene {
    num: string;
    brief: string | "";
    shootDate: string | null;
    notes: SceneNote[];
}

export interface ScenesStore {
    scenes: Scene[];
    sortBy: "shootDate" | "id"; // New property to track the current sort key
    addScene: (scene: Scene) => void;
    removeScene: (num: string) => void;
    updateScene: (num: string, updatedScene: Partial<Scene>) => void;
    sortScenes: (key: "shootDate" | "num") => void; // New sortScenes method
    removeAllScenes: () => void;
}

const useScenesStore = create<ScenesStore>((set) => ({
    scenes: [],
    sortBy: "id", // Default sort key
    addScene: (scene: Scene) =>
        set((state: ScenesStore) => {
            const updatedScenes = [...state.scenes, scene];
            const sortedScenes = updatedScenes.sort((a, b) => {
                if (state.sortBy === "shootDate") {
                    return (a.shootDate || "").localeCompare(b.shootDate || "");
                }
                return parseInt(a.num) - parseInt(b.num);
            });
            return { scenes: sortedScenes };
        }),
    removeScene: (num: string) =>
        set((state: ScenesStore) => ({
            scenes: state.scenes.filter((scene) => scene.num !== num),
        })),
    updateScene: (num: string, updatedScene: Partial<Scene>) =>
        set((state: ScenesStore) => ({
            scenes: state.scenes.map((scene) =>
                scene.num === num ? { ...scene, ...updatedScene } : scene,
            ),
        })),
    sortScenes: (key: "shootDate" | "num") =>
        set((state: ScenesStore) => {
            const newScenes = [...state.scenes].sort((a, b) => {
                if (key === "shootDate") {
                    if (a.shootDate === null && b.shootDate === null) {
                        return parseInt(a.num) - parseInt(b.num);
                    }
                    if (a.shootDate === null && b.shootDate !== null) {
                        return +1;
                    }
                    if (a.shootDate !== null && b.shootDate === null) {
                        return -1;
                    }
                    return new Date(a.shootDate || "") <
                        new Date(b.shootDate || "")
                        ? -1
                        : +1;
                }
                return parseInt(a.num) - parseInt(b.num);
            });
            return { ...state, scenes: newScenes };
        }),
    removeAllScenes: () => {
        set(() => ({
            scenes: [],
        }));
    },
}));

export default useScenesStore;
