import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Protect from "./components/Protect";

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
              <div>Search Page</div>
            </Protect>
          }
        />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
