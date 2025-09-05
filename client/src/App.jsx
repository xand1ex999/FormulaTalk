import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import Home from "./pages/Home";
import Header from "./components/Header/Header.jsx";

function App() {
  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;
