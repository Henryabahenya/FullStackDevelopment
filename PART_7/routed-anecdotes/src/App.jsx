import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import AnecdoteList from "./components/AnecdoteList";
import About from "./components/About";
import Footer from "./components/Footer";
import CreateNew from "./components/CreateNew";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <Router>
      <div>
        <h1>Software anecdotes</h1>
        <Menu />
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<AnecdoteList />} />
            <Route path="/create" element={<CreateNew />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </ErrorBoundary>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
