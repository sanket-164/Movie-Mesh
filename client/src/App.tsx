import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Search from "./pages/Search";
import Protect from "./components/Protect";
import Movie from "./pages/Movie";

function App() {
  const navigate = useNavigate();
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token, navigate]);

  return (
    <>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <Protect>
              <Search />
            </Protect>
          }
        />
        <Route
          path="/movie/:_id"
          element={
            <Protect>
              <Movie />
            </Protect>
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
