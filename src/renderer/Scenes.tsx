import React, { useState, useEffect } from "react";
import useScenesStore, { Scene, SceneNote, ScenesStore } from "./GlobalState/ScenesStore"; // Import the store and state type
import {
    AppBar,
    Toolbar,
    Typography,
    Menu,
    MenuItem,
    Button,
} from "@mui/material";

export interface SceneEditorProps {
    scene: number | null;
    handleCloseEditor: () => void;
}

const SceneEditor = ({ scene, handleCloseEditor }: SceneEditorProps) => {
    const scenes = useScenesStore((state: ScenesStore) => state.scenes); // Get scenes from the store
    const updateScene = useScenesStore(
        (state: ScenesStore) => state.updateScene,
    ); // Get updateScene function
    const selectedScene = scenes.find((s) => s.id === scene); // Find the selected scene

    const [sceneId, setSceneId] = useState(selectedScene?.id || "");
    const [brief, setBrief] = useState(selectedScene?.brief || "");
    const [shootDate, setShootDate] = useState(selectedScene?.shootDate || "");
    const [newTodo, setNewTodo] = useState("");

    const handleSave = () => {
        if (selectedScene) {
            updateScene(selectedScene.id, {
                id: Number(sceneId),
                brief: brief,
                shootDate: shootDate,
            });
        }
    };

    const handleAddTodo = () => {
        if (!selectedScene) return;
        if (newTodo.trim()) {
            updateScene(selectedScene?.id, {
                ...selectedScene,
                notes: [
                    ...(selectedScene?.notes || []),
                    {
                        content: newTodo.trim(),
                        complete: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    } as SceneNote,
                ],
            } as Scene); // Update the scene with the new todo
            setNewTodo("");
        }
    };

    const handleRemoveTodo = (index: number) => {
        if (!selectedScene) return;
        updateScene(selectedScene?.id, {
            ...selectedScene,
            notes: selectedScene?.notes?.filter((_, i) => i !== index),
        } as Scene); // Update the scene with the removed todo
    };

    const handleNoteComplete = (index: number, state: boolean) => {
        if (!selectedScene) return;
        updateScene(selectedScene?.id, {
            ...selectedScene,
            notes: selectedScene?.notes?.map((note, i) =>
                i === index ? { ...note, complete: state } : note,
            ),
        } as Scene); // Update the scene with the updated todo
    }

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
                        <h2 className="text-2xl font-bold mb-4">
                            Scene Details
                        </h2>
                        <div className="mb-4 flex flex-col md:flex-row md:space-x-4">
                            <div className="flex-1 mb-4 md:mb-0">
                                <label className="block font-bold mb-1">
                                    ID:
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
                                <label className="block font-bold mb-1">
                                    Brief:
                                </label>
                                <input
                                    type="text"
                                    className="border rounded p-2 w-full"
                                    value={brief}
                                    onChange={(e) => setBrief(e.target.value)}
                                    placeholder="Enter brief"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block font-bold mb-1">
                                    Shoot Date:
                                </label>
                                <input
                                    type="date"
                                    className="border rounded p-2 w-full"
                                    value={shootDate}
                                    onChange={(e) =>
                                        setShootDate(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="mb-4 flex flex-col justify-center md:flex-row md:space-x-4">
                            <button
                                className={`mb-4 px-4 py-2 rounded ${
                                    sceneId === "" || isNaN(Number(sceneId))
                                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                                onClick={handleSave}
                                disabled={sceneId === "" || isNaN(Number(sceneId))}
                            >
                                Save
                            </button>
                        </div>
                        <h3 className="text-xl font-bold mb-2">Notes</h3>
                        <ul className="mb-4 space-y-2">
                            {selectedScene.notes?.map((note, index) => (
                                <li
                                    key={index}
                                    className="flex items-center border border-gray-300 rounded p-2 mb-2"
                                >
                                    <input type="checkbox" className="mr-2"
                                        checked={note.complete}
                                        onChange={(e) => handleNoteComplete(index, e.target.checked)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="flex-grow">{note.content}</span>
                                    <button
                                        className="ml-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
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
                                placeholder="Add a new task"
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
    const scenes = useScenesStore((state: ScenesStore) => state.scenes); // Get scenes from the store
    const addScene = useScenesStore((state: ScenesStore) => state.addScene); // Get addScene function
    const [selectedScene, setSelectedScene] = useState<number | null>(null);
    const [modalScene, setModalScene] = useState<Scene | null>(null);

    const handleSelect = (id: number) => {
        setSelectedScene(id);
    };

    const handleAddScene = () => {
        const newScene = {
            id: scenes.length + 1,
            brief: `Scene ${scenes.length + 1}`,
            shootDate: null,
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
            <div className="grid grid-cols-4 gap-4 p-4">
                {scenes.map((scene: Scene) => (
                    <ScenesTile
                        key={scene.id}
                        scene={scene}
                        selectedScene={selectedScene}
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

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export interface ScenesTileProps {
    scene: Scene;
    selectedScene: number | null;
    handleSelect: (id: number) => void;
    onDoubleClick: () => void;
}

export const ScenesTile = ({
    scene,
    selectedScene,
    handleSelect,
    onDoubleClick,
}: ScenesTileProps) => {
    const removeScene = useScenesStore(
        (state: ScenesStore) => state.removeScene,
    );
    const updateScene = useScenesStore(
        (state: ScenesStore) => state.updateScene,
    );

    const [isEditing, setIsEditing] = useState(false);
    const [sceneId, setSceneId] = useState(String(scene.id));
    const [brief, setBrief] = useState(scene.brief);
    const [shootDate, setShootDate] = useState(String(scene.shootDate) || "");

    const handleRemoveScene = (id: number) => {
        removeScene(id);
    };

    const handleSave = () => {
        updateScene(scene.id, {
            id: Number(sceneId),
            brief: brief,
            shootDate: shootDate,
        });
        setIsEditing(false);
    };

    const style =
        scene.shootDate &&
        new Date(scene.shootDate).getTime() - new Date().getTime() <
            14 * 24 * 60 * 60 * 1000
            ? "shadow-[0px_0px_15px_4px_rgba(255,46,88,1)]"
            : scene.shootDate &&
                new Date(scene.shootDate).getTime() - new Date().getTime() <
                    21 * 24 * 60 * 60 * 1000
              ? "shadow-[0px_0px_15px_4px_rgba(255,163,72,1)]"
              : "";
    console.log(style);

    return (
        <div
            key={scene.id}
            className={`${style} group relative w-full aspect-square p-4 border rounded-lg shadow-md cursor-pointer transition-transform transform ${"hover:scale-105"} flex items-center justify-center ${
                selectedScene === scene.id
                    ? "bg-blue-500 text-white border-blue-700"
                    : "bg-white text-gray-800 border-gray-300"
            }`}
            onClick={() => handleSelect(scene.id)}
            onDoubleClick={onDoubleClick}
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button
                    className="p-1 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(scene.id);
                        setIsEditing(true);
                    }}
                >
                    <EditIcon />
                </button>
                <button
                    className="p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveScene(scene.id);
                    }}
                >
                    <DeleteIcon />
                </button>
            </div>
            {selectedScene === scene.id && isEditing ? (
                <div className="text-center">
                    <input
                        type="text"
                        className="text-lg font-bold bg-white text-black border rounded p-1 mb-2 w-16"
                        value={sceneId}
                        onChange={(e) => {
                            setSceneId(e.target.value);
                        }}
                    />
                    <textarea
                        className="text-sm bg-white text-black border rounded p-1 w-32 mb-2"
                        value={brief}
                        onChange={(e) => setBrief(e.target.value)}
                    />
                    <input
                        type="date"
                        className="text-sm bg-white text-black border rounded p-1 w-32"
                        value={shootDate}
                        onChange={(e) => setShootDate(e.target.value)}
                    />
                    <div className="mt-2">
                        <button
                            className={`px-2 py-1 rounded mr-2 ${
                                sceneId === "" || isNaN(Number(sceneId))
                                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSave();
                            }}
                            disabled={sceneId === "" || isNaN(Number(sceneId))}
                        >
                            Save
                        </button>
                        <button
                            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(false);
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h3 className="text-lg font-bold">Scene {scene.id}</h3>
                    <p className="text-sm">{scene.brief}</p>
                </div>
            )}
        </div>
    );
};

export const TopBar: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuType, setMenuType] = React.useState<string | null>(null);
    const [sortBy, setSortBy] = React.useState<"shootDate" | "id">("id");
    const sortSScenes = useScenesStore(
        (state: ScenesStore) => state.sortScenes,
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

    useEffect(() => {
        sortSScenes(sortBy);
    }, [sortBy]);

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Scenes
                </Typography>
                <select
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value as "shootDate" | "id")
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
                    <option value="id">Sort by ID</option>
                    <option value="shootDate">Sort by Shoot Date</option>
                </select>
                <Button
                    color="inherit"
                    onClick={(e) => handleMenuOpen(e, "file")}
                >
                    File
                </Button>
                <Button
                    color="inherit"
                    onClick={(e) => handleMenuOpen(e, "edit")}
                >
                    Edit
                </Button>
                <Button
                    color="inherit"
                    onClick={(e) => handleMenuOpen(e, "view")}
                >
                    View
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuType === "file"}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>New scene</MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        New production
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        Open production
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        Save production
                    </MenuItem>
                </Menu>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuType === "edit"}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>Undo</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Redo</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Cut</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Copy</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Paste</MenuItem>
                </Menu>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && menuType === "view"}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose}>Zoom In</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Zoom Out</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Full Screen</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Scenes;
