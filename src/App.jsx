import { Router,Routes, Route, Link} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Navbar from "./components/navbar"
import PrivateRoute from "./components/PrivateRoute";
import { useAuth } from "./context/AuthContext"; 
import GuestRoute from "./components/GuestRoute";
import Profile from "./pages/Profile";
import EditProfile from "./pages/Edit-Profile";
import EditSkills from "./pages/Edit-Skills";
import SearchUsers from "./pages/SearchUsers";
import Requests from "./pages/Requests";
import Chat from "./pages/Chat";
import UserProfile from "./pages/UserProfile";

export default function App() {
  const { loading } = useAuth();
  if(loading)
  {
    return(
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading...
      </div>
    );
  }
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={
        <GuestRoute>
          <Register />
        </GuestRoute>
      } />
      <Route path="/login" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
       } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      <Route path="/profile" element= {
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="/edit-profile" element={
        <PrivateRoute>
          <EditProfile />
        </PrivateRoute>
      } />
      <Route path="/edit-skills" element={
        <PrivateRoute>
          <EditSkills />
        </PrivateRoute>
      } />

      <Route path="/search" element={
        <PrivateRoute>
          <SearchUsers />
        </PrivateRoute>
      } />
      <Route path = "/requests" element={
        <PrivateRoute>
          <Requests />
        </PrivateRoute>
      } />

      <Route path = "/chat" element = {
        <PrivateRoute>
          <Chat />
        </PrivateRoute>
      } />

      <Route path = "/profile/:userId" element = {
        <PrivateRoute>
          <UserProfile />
        </PrivateRoute>
      } />
      <Route path="*" element={<NotFound />} />

      
    </Routes>
    </>  
  );
}

