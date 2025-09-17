import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import Header from "./components/Header/Header.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import Profile from "./pages/Profile/Profile.jsx"
import Feed from "./pages/Feed/Feed.jsx";
import Chat from "./pages/Chat/Chat.jsx";
import FantasyPage from "./pages/FantasyPage/FantasyPage.jsx";
import AIHelper from "./components/AIHelper/AIHelper.jsx";

// For redirecting based on auth status
const RootRedirect = () => {
  const { user } = useAuth();
  return user ? <Navigate to="/feed" /> : <Navigate to="/auth" />;
};

const ConditionalAIHelper = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isChatPage = location.pathname === '/chat';
  return !isAuthPage && !isChatPage ? <AIHelper /> : null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
          <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="dark"
        />
        <Header/>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/feed" element={
            <RequireAuth>
              <Feed />
            </RequireAuth>
          }/>
          <Route path="/feed/posts/:postId" element={
            <RequireAuth>
              <Feed />
            </RequireAuth>
          }/>
          <Route path="/fantasy" element={
            <RequireAuth>
              <FantasyPage />
            </RequireAuth>
          }/>
          <Route path="/profile/:username" element={<Profile />}/>
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
        <ConditionalAIHelper/>
      </Router>
    </AuthProvider>
  );
}

export default App;
