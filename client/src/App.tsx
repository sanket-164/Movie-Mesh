import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Protect from "./components/Protect";
import MainLayout from "./layouts/MainLayout";
import Search from "./pages/Search";
import Movie from "./pages/Movie";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<MainLayout />}>
          <Route
            path="/search"
            element={
              <Protect>
                <Search />
              </Protect>
            }
          />
          <Route
            path="/movie/:movieId"
            element={
              <Protect>
                <Movie />
              </Protect>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
