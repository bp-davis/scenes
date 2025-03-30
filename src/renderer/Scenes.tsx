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
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export interface SceneEditorProps {
    scene: number | null;
    handleCloseEditor: () => void;
}

const SceneEditor = ({ scene, handleCloseEditor }: SceneEditorProps) => {
    const scenes = useScenesStore((state: ScenesStore) => state.scenes);
    const updateScene = useScenesStore(
        (state: ScenesStore) => state.updateScene,
    );
    const selectedScene = scenes.find((s) => s.id === scene);

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
        }
      
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
                        <h2 className="text-2xl mb-4">
                            Scene Details
                        </h2>
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
                                <label className="block mb-1">
                                    Summary
                                </label>
                                <input
                                    type="text"
                                    className="border rounded p-2 w-full"
                                    value={brief}
                                    onChange={(e) => setBrief(e.target.value)}
                                    placeholder="Enter summary"
                                />
                            </div>
                            <div className="flex-1 mb-4 md:mb-0">
                                <label className="block mb-1">
                                    Shoot Date
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
                            <div className="flex-1 flex items-end">
                                <button
                                    className={`w-full px-2 py-2 pt-3 rounded ${
                                        sceneId === "" || isNaN(Number(sceneId))
                                            ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                    onClick={handleSave}
                                    disabled={sceneId === "" || isNaN(Number(sceneId))}
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
                                        onChange={(e) => handleNoteComplete(index, e.target.checked)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="flex-grow text-l">{note.content}</span>
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
    const [style, setStyle] = useState("");

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

    useEffect(() => {
        if (!scene.shootDate) return;
        const shootDateTimestamp = new Date(scene.shootDate).getTime();
        const currentDateTimestamp = new Date().getTime();
        if (shootDateTimestamp - currentDateTimestamp < 14 * 24 * 60 * 60 * 1000) {
            setStyle("bg-red-500 shadow-[0px_0px_15px_1px_rgba(255,46,88,1)]");
        } else if (
            shootDateTimestamp - currentDateTimestamp <
            21 * 24 * 60 * 60 * 1000
        ) {
            setStyle("bg-orange-500 shadow-[0px_0px_15px_1px_rgba(255,163,72,1)]");
        } else {
            setStyle("shadow-md");
        }
    }, [scene.shootDate]);

    return (
        <div
            key={scene.id}
            className={`group relative w-full aspect-square p-4 border rounded-lg cursor-pointer transition-transform transform ${"hover:scale-105"} flex items-center justify-center bg-white text-gray-800 border-gray-300" ${style}`}
            onClick={() => handleSelect(scene.id)}
            onDoubleClick={onDoubleClick}
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(scene.id);
                        onDoubleClick();
                    }}
                >
                    <EditIcon />
                </button>
                <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveScene(scene.id);
                    }}
                >
                    <DeleteIcon />
                </button>
            </div>
            <div className="text-center">
                <h3 className="text-lg font-bold">Scene {scene.id}</h3>
                <p className="text-sm">{scene.brief}</p>
            </div>
        </div>
    );
};

export const TopBar: React.FC = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [menuType, setMenuType] = React.useState<string | null>(null);
    const [sortBy, setSortBy] = React.useState<"shootDate" | "id">("id");
    const sortScenes = useScenesStore(
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
        sortScenes(sortBy);
    }, [sortBy]);

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Scenes
                </Typography>
                <div style={{ display: "flex", alignItems: "center", marginRight: "1rem" }}>
                    <label style={{ marginRight: "0.5rem", color: "#fff" }}>Show completed</label>
                    <input
                        type="checkbox"
                        onChange={(e) => {
                            // Add logic to handle "Show completed" toggle
                        }}
                        style={{ transform: "scale(1.2)" }}
                    />
                </div>
                <label style={{ marginRight: "0.5rem", color: "#fff" }}>Sort by</label>
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
                    <option value="id">Scene number</option>
                    <option value="shootDate">Shoot date</option>
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
