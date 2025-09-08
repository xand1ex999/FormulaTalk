import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import Header from "./components/Header/Header.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Profile from "./pages/Profile/Profile.jsx"
import Feed from "./pages/Feed/Feed.jsx";
import Chat from "./components/Chat/Chat.jsx";

// For redirecting based on auth status
const RootRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/feed" /> : <Navigate to="/auth" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/feed" element={
            <RequireAuth>
              <Feed />
            </RequireAuth>
          }/>
          <Route path="/profile/:username" element={<Profile />}/>
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </Router>
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
    </AuthProvider>
  );
}

export default App;
