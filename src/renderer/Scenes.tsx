import React, { useState, useEffect } from "react";
import useScenesStore, {
    Scene,
    SceneNote,
    ScenesStore,
} from "./GlobalState/ScenesStore"; // Import the store and state type
import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    Button,
    TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import toast, { Toaster } from "react-hot-toast";

export interface SceneEditorProps {
    scene: string | null;
    handleCloseEditor: () => void;
}

const SceneEditor = ({ scene, handleCloseEditor }: SceneEditorProps) => {
    const scenes = useScenesStore((state: ScenesStore) => state.scenes);
    const updateScene = useScenesStore(
        (state: ScenesStore) => state.updateScene,
    );
    const selectedScene = scenes.find((s) => s.num === scene);

    const [sceneId, setSceneId] = useState(selectedScene?.num || "");
    const [brief, setBrief] = useState(selectedScene?.brief || "");
    const [shootDate, setShootDate] = useState(selectedScene?.shootDate || "");
    const [newTodo, setNewTodo] = useState("");

    const handleSave = () => {
        if (selectedScene) {
            updateScene(selectedScene.num, {
                num: sceneId,
                brief: brief,
                shootDate: shootDate,
            });
        }
    };

    const handleAddTodo = () => {
        if (!selectedScene) return;
        if (newTodo.trim()) {
            updateScene(selectedScene?.num, {
                ...selectedScene,
                notes: [
                    ...(selectedScene?.notes || []),
                    {
                        content: newTodo.trim(),
                        complete: false,
                    } as SceneNote,
                ],
            } as Scene); // Update the scene with the new todo
            setNewTodo("");
        }
    };

    const handleRemoveTodo = (index: number) => {
        if (!selectedScene) return;
        updateScene(selectedScene?.num, {
            ...selectedScene,
            notes: selectedScene?.notes?.filter((_, i) => i !== index),
        } as Scene); // Update the scene with the removed todo
    };

    const handleNoteComplete = (index: number, state: boolean) => {
        if (!selectedScene) return;
        updateScene(selectedScene?.num, {
            ...selectedScene,
            notes: selectedScene?.notes?.map((note, i) =>
                i === index ? { ...note, complete: state } : note,
            ),
        } as Scene); // Update the scene with the updated todo
    };

    const handleEditTodo = (index: number) => {
        if (!selectedScene) return;
        const noteToEdit = selectedScene.notes?.[index];
        if (noteToEdit) {
            setNewTodo(noteToEdit.content);
            handleRemoveTodo(index);
        }
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleCloseEditor();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return function cleanup() {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <>
            {selectedScene && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    onClick={handleCloseEditor}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-11/12 h-5/6 overflow-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-2 right-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                            onClick={handleCloseEditor}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6 text-gray-700 hover:text-gray-900"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                        <h2 className="text-2xl mb-4">Scene Details</h2>
                        <div className="mb-8 flex flex-col md:flex-row md:space-x-4">
                            <div className="flex-1 mb-4 md:mb-0">
                                <label className="block mb-1">
                                    Scene number
                                </label>
                                <input
                                    type="text"
                                    className="border rounded p-2 w-full"
                                    value={sceneId}
                                    onChange={(e) => setSceneId(e.target.value)}
                                    placeholder="Enter scene ID"
                                />
                            </div>
                            <div className="flex-1 mb-4 md:mb-0">
                                <label className="block mb-1">Summary</label>
                                <input
                                    type="text"
                                    className="border rounded p-2 w-full"
                                    value={brief}
                                    onChange={(e) => setBrief(e.target.value)}
                                    placeholder="Enter summary"
                                />
                            </div>
                            <div className="flex-1 mb-4 md:mb-0">
                                <label className="block mb-1">Shoot Date</label>
                                <input
                                    type="date"
                                    className="border rounded p-2 w-full"
                                    value={shootDate}
                                    onChange={(e) =>
                                        setShootDate(e.target.value)
                                    }
                                />
                                {shootDate && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        Selected Date:{" "}
                                        {new Date(
                                            shootDate,
                                        ).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                            <div className="flex-1 flex items-end">
                                <button
                                    className={`w-full px-2 py-2 pt-3 rounded ${
                                        sceneId === "" || isNaN(Number(sceneId))
                                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                    onClick={handleSave}
                                    disabled={
                                        sceneId === "" || isNaN(Number(sceneId))
                                    }
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl mb-2">Notes</h3>
                        <ul className="mb-4 space-y-2">
                            {selectedScene.notes?.map((note, index) => (
                                <li
                                    key={index}
                                    className="group flex items-center hover:border-gray-200/100 border border-gray-200/0 rounded p-2 mb-2"
                                >
                                    <input
                                        type="checkbox"
                                        className="ml-2 mr-3 transform scale-150"
                                        checked={note.complete}
                                        onChange={(e) =>
                                            handleNoteComplete(
                                                index,
                                                e.target.checked,
                                            )
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="flex-grow text-l">
                                        {note.content}
                                    </span>
                                    <button
                                        className="ml-2 p-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
                                        onClick={() => handleEditTodo(index)}
                                    >
                                        <EditIcon />
                                    </button>
                                    <button
                                        className="ml-2 p-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600"
                                        onClick={() => handleRemoveTodo(index)}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center">
                            <input
                                type="text"
                                className="border rounded p-2 flex-grow"
                                value={newTodo}
                                onChange={(e) => setNewTodo(e.target.value)}
                                placeholder="Add a new note"
                                onKeyUp={(e) => {
                                    if (e.key === "Enter") {
                                        handleAddTodo();
                                    }
                                }}
                            />
                            <button
                                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={handleAddTodo}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const Scenes: React.FC = () => {
    const scenes = useScenesStore((state: ScenesStore) => state.scenes);
    const addScene = useScenesStore((state: ScenesStore) => state.addScene);
    const removeAllScenes = useScenesStore(
        (state: ScenesStore) => state.removeAllScenes,
    );
    const [selectedScene, setSelectedScene] = useState<string | null>(null);
    const [modalScene, setModalScene] = useState<Scene | null>(null);
    const [showCompleted, setShowCompleted] = useState(false);
    const [sortBy, setSortBy] = React.useState<"shootDate" | "num">(
        (window.localStorage.getItem("sortBy") as "shootDate" | "num") || "num",
    );
    const sortScenes = useScenesStore((state: ScenesStore) => state.sortScenes);
    const [filterBy, setFilterBy] = useState<string>("");

    const loadCurrentWorkspace = async () => {
        removeAllScenes();
        const filePath = window.localStorage.getItem("currentWorkspace");
        if (!filePath) {
            return;
        }
        const scenes = await window.electronAPI.loadScenesFromFile({ filePath });
        if (scenes.length === 0) {
            return;
        } else {
            toast.success("Successfully restored workspace");
        }
        for (let scene of scenes) {
            addScene(scene);
        }
        sortScenes(sortBy);
    };

    useEffect(() => {
        const init = async () => {
            await loadCurrentWorkspace();
        };
        init();
    }, []);

    useEffect(() => {
        sortScenes(sortBy);
        window.localStorage.setItem("sortBy", sortBy);
    }, [sortBy]);

    const handleSelect = (num: string) => {
        setSelectedScene(num);
    };

    const handleAddScene = () => {
        const newScene = {
            num: String(scenes.length + 1),
            brief: `Scene ${scenes.length + 1}`,
            shootDate: null,
            notes: [],
        };
        addScene(newScene); // Use the store's addScene function
    };

    const handleDoubleClick = (scene: Scene) => {
        setModalScene(scene);
    };

    const handleCloseModal = () => {
        setModalScene(null);
    };

    return (
        <>
            <Toaster />
            <TopBar
                setShowCompleted={setShowCompleted}
                showCompleted={showCompleted}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filterBy={filterBy}
                setFilterBy={setFilterBy}
            />
            <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 p-4">
                {scenes
                    .filter((scene) => {
                        if (showCompleted) {
                            return true;
                        }
                        return !scene.notes?.every((note) => note.complete);
                    })
                    .filter((scene) => {
                        if (filterBy === "") {
                            return true;
                        }
                        return scene.brief
                            .toLowerCase()
                            .includes(filterBy.toLowerCase())
                            || scene.num
                            .toLowerCase()
                            .includes(filterBy.toLowerCase());
                    })
                    .map((scene: Scene) => (
                        <ScenesTile
                            key={scene.num}
                            scene={scene}
                            handleSelect={handleSelect}
                            onDoubleClick={() => handleDoubleClick(scene)}
                        />
                    ))}
                <div
                    className="w-full aspect-square p-4 border rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-105 flex items-center justify-center bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200"
                    onClick={handleAddScene}
                >
                    <div className="text-center text-4xl font-bold">+</div>
                </div>
            </div>
            {modalScene && (
                <SceneEditor
                    scene={selectedScene}
                    handleCloseEditor={handleCloseModal}
                />
            )}
        </>
    );
};

export interface ScenesTileProps {
    scene: Scene;
    handleSelect: (num: string) => void;
    onDoubleClick: () => void;
}

export const ScenesTile = ({
    scene,
    handleSelect,
    onDoubleClick,
}: ScenesTileProps) => {
    const removeScene = useScenesStore(
        (state: ScenesStore) => state.removeScene,
    );
    const [style, setStyle] = useState("");

    const handleRemoveScene = (num: string) => {
        removeScene(num);
    };

    useEffect(() => {
        if (!scene.shootDate) return;
        const shootDateTimestamp = new Date(scene.shootDate).getTime();
        const currentDateTimestamp = new Date().getTime();
        if (
            shootDateTimestamp - currentDateTimestamp <
            14 * 24 * 60 * 60 * 1000
        ) {
            setStyle("bg-red-500 shadow-[0px_0px_15px_1px_rgba(255,46,88,1)]");
        } else if (
            shootDateTimestamp - currentDateTimestamp <
            21 * 24 * 60 * 60 * 1000
        ) {
            setStyle(
                "bg-orange-500 shadow-[0px_0px_15px_1px_rgba(255,163,72,1)]",
            );
        } else {
            setStyle("shadow-md");
        }
    }, [scene.shootDate]);

    return (
        <div
            key={scene.num}
            className={`group relative w-full aspect-square p-4 border rounded-lg cursor-pointer transition-transform transform ${"hover:scale-105"} flex items-center justify-center bg-white text-gray-800 border-gray-300" ${style}`}
            onClick={() => handleSelect(scene.num)}
            onDoubleClick={onDoubleClick}
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(scene.num);
                        onDoubleClick();
                    }}
                >
                    <EditIcon />
                </button>
                <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveScene(scene.num);
                    }}
                >
                    <DeleteIcon />
                </button>
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold truncate">
                    Scene {scene.num}
                </h3>
                <p className="text-sm break-words line-clamp-3 overflow-hidden">
                    {scene.brief}
                </p>
            </div>
        </div>
    );
};

export interface TopBarProps {
    setShowCompleted: (show: boolean) => void;
    showCompleted: boolean;
    sortBy: "shootDate" | "num";
    setSortBy: (sortBy: "shootDate" | "num") => void;
    filterBy: string;
    setFilterBy: (filterBy: string) => void;
}

export const TopBar = ({
    setShowCompleted,
    showCompleted,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
}: TopBarProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuType, setMenuType] = React.useState<string | null>(null);
    const scenes = useScenesStore((state: ScenesStore) => state.scenes);
    const sortScenes = useScenesStore((state: ScenesStore) => state.sortScenes);
    const addScene = useScenesStore((state: ScenesStore) => state.addScene);
    const removeAllScenes = useScenesStore(
        (state: ScenesStore) => state.removeAllScenes,
    );

    const handleMenuOpen = (
        event: React.MouseEvent<HTMLElement>,
        type: string,
    ) => {
        setAnchorEl(event.currentTarget);
        setMenuType(type);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setMenuType(null);
    };

    const loadScenesFromFile = async () => {
        handleMenuClose();
        removeAllScenes();
        const filePath = await window.electronAPI.selectFileToLoad();
        if (!filePath) {
            toast.error("No file selected");
            return;
        }
        const scenes = await window.electronAPI.loadScenesFromFile({ filePath });
        if (scenes.length === 0) {
            toast.error("No scenes found in the file");
            return;
        } else {
            toast.success("Successfully loaded scenes from file");
            window.localStorage.setItem("currentWorkspace", filePath);
        }
        for (let scene of scenes) {
            addScene(scene);
        }
        sortScenes(sortBy);
    };

    const saveAsFile = async () => {
        handleMenuClose();
        const filePath = await window.electronAPI.selectFileToSave();
        if (!filePath) {
            toast.error("No file selected");
            return;
        }
        const success = await window.electronAPI.saveScenesToFile({
            filePath,
            scenes,
        });
        if (!success) {
            toast.error("Failed to save scenes to file");
            return;
        } else {
            toast.success("Successfully saved scenes to file");
            window.localStorage.setItem("currentWorkspace", filePath);
        }
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Scenes
                </Typography>
                <TextField
                    id="outlined-basic"
                    variant="filled"
                    size="small"
                    label="Search"
                    className="border-radius-4 bg-white rounded"
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                />
                <div
                    className="flex items-center pl-4 pr-4"
                >
                    <label style={{ marginRight: "0.5rem", color: "#fff" }}>
                        Show completed
                    </label>
                    <input
                        type="checkbox"
                        checked={showCompleted}
                        className="p-8"
                        onChange={(e) => {
                            setShowCompleted(e.target.checked);
                        }}
                        style={{ transform: "scale(1.2)" }}
                    />
                </div>
                <label style={{ marginRight: "0.5rem", color: "#fff" }}>
                    Sort by
                </label>
                <select
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value as "shootDate" | "num")
                    }
                    style={{
                        marginLeft: "auto",
                        marginRight: "1rem",
                        padding: "0.5rem",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        color: "#000", // Ensure text is readable
                    }}
                >
                    <option value="id">Scene number</option>
                    <option value="shootDate">Shoot date</option>
                </select>
                <Button
                    color="inherit"
                    onClick={(e) => handleMenuOpen(e, "file")}
                >
                    File
                </Button>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuType === "file"}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={loadScenesFromFile}>
                        Load from file...
                    </MenuItem>
                    <MenuItem onClick={saveAsFile}>Save as file...</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Scenes;
