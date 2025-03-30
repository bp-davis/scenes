export const Root = () => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-auto">
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-hidden">
                            <h2 className="text-2xl font-bold text-center mt-4">Welcome to Electron!</h2>
                            <p className="text-center mt-2">This is a simple Electron app.</p>    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}