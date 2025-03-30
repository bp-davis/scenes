import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

export const Homepage = () => {
    return(
        <div>
            <h1 className="bg-gray-500 text-center">Hello react in electron</h1>
            <h1>Homepage</h1>
        </div>
    )
}

const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
        </Routes>
      </Router>
    );
}

export default App;