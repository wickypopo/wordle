import { Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { supabase } from "./utils/supabase";
import { Toaster } from "react-hot-toast";
import Wordle from "./game/Wordle";
import ProtectedRoute from "./lib/ProtectedRoute";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wordle"
          element={
            <ProtectedRoute>
              <Wordle />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
