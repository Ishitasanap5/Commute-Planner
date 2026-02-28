// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "./context/AuthContext.jsx"
import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"
import Dashboard from "./pages/Dashboard.jsx"

function App() {
  const { token } = useContext(AuthContext)

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/dashboard/*" element={token ? <Dashboard /> : <Navigate to="/" />} />
    </Routes>
  )
}

export default App