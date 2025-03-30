import { create } from "zustand";

export interface SceneNote {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    complete: boolean;
}

export interface Scene {
    id: number;
    brief: string | "";
    shootDate: string | null;
    notes?: SceneNote[];
}

export interface ScenesStore {
    scenes: Scene[];
    sortBy: "shootDate" | "id"; // New property to track the current sort key
    addScene: (scene: Scene) => void;
    removeScene: (id: number) => void;
    updateScene: (id: number, updatedScene: Partial<Scene>) => void;
    sortScenes: (key: "shootDate" | "id") => void; // New sortScenes method
}

const useScenesStore = create<ScenesStore>((set) => ({
    scenes: [
        {
            id: 1,
            brief: "John talks to Kate",
            shootDate: "2025-05-20",
            notes: [
                {
                    id: 1,
                    content: "This is a note",
                    createdAt: "2025-05-01",
                    updatedAt: "2025-05-02",
                    complete: false,
                },
            ],
        },
        {
            id: 2,
            brief: "John goes missing",
            shootDate: "2025-04-12",
            notes: [
                {
                    id: 2,
                    content: "This is another note",
                    createdAt: "2025-04-01",
                    updatedAt: "2025-04-02",
                    complete: true,
                },
            ],
        },
        {
            id: 3,
            brief: "Kate finds John",
            shootDate: "2025-04-25",
            notes: [
                {
                    id: 3,
                    content: "This is a third note",
                    createdAt: "2025-04-10",
                    updatedAt: "2025-04-11",
                    complete: false,
                },
            ],
        },
    ],
    sortBy: "id", // Default sort key
    addScene: (scene: Scene) =>
        set((state: ScenesStore) => {
            const updatedScenes = [...state.scenes, scene];
            const sortedScenes = updatedScenes.sort((a, b) => {
                if (state.sortBy === "shootDate") {
                    return (a.shootDate || "").localeCompare(b.shootDate || "");
                }
                return a.id - b.id;
            });
            return { scenes: sortedScenes };
        }),
    removeScene: (id: number) =>
        set((state: ScenesStore) => ({
            scenes: state.scenes.filter((scene) => scene.id !== id),
        })),
    updateScene: (id: number, updatedScene: Partial<Scene>) =>
        set((state: ScenesStore) => ({
            scenes: state.scenes.map((scene) =>
                scene.id === id ? { ...scene, ...updatedScene } : scene,
            ),
        })),
    sortScenes: (key: "shootDate" | "id") =>
        set((state: ScenesStore) => ({
            scenes: [...state.scenes].sort((a, b) => {
                if (key === "shootDate") {
                    return (a.shootDate || "").localeCompare(b.shootDate || "");
                }
                return a.id - b.id;
            }),
        })),
}));

export default useScenesStore;
