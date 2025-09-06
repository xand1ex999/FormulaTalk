import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import Home from "./pages/Home";
import Header from "./components/Header/Header.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Profile from "./pages/Profile/Profile.jsx"
import Feed from "./pages/Feed/Feed.jsx";

function App() {
  return (
    <>
    <AuthProvider>
      <Router>
        <Header/>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }/>
          <Route path="/profile/:username" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>}
             />
             <Route path="/feed" element={
            <RequireAuth>
              <Feed />
            </RequireAuth>
          }/>
        </Routes>
      </Router>
    </AuthProvider>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="dark"
    />
    </>
  );
}

export default App;
