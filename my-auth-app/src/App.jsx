import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import Signup from "./Signup";

function Home() {
  return <h1>Home (public page)</h1>;
}

function Profile() {
  const { user, logout } = useAuth();
  return (
    <>
      <h2>Profile — {user.email}</h2>
      <p>Roles: {user.roles.join(", ")}</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}

function AdminPanel() {
  const { user } = useAuth();
  return <h2>Admin Panel — hello {user.email} 👑</h2>;
}

function Nav() {
  const { user, logout } = useAuth();
  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      <Link to="/profile">Profile</Link> |{" "}
      <Link to="/admin">Admin</Link> |{" "}
      {user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Nav />
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* any logged-in user */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* admin only — RBAC */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}