import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Protect from "./components/Protect";
import SearchLayout from "./layouts/SearchLayout";
import ExploreLayout from "./layouts/ExploreLayout";
import Search from "./pages/Search";
import Movie from "./pages/Movie";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import MyMovies from "./pages/MyMovies";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route element={<ExploreLayout />}>
          <Route path="/explore" element={<Explore />} />
          <Route path="/movies/:movieId" element={<Movie />} />
        </Route>

        <Route element={<SearchLayout />}>
          <Route
            path="/search"
            element={
              <Protect>
                <Search />
              </Protect>
            }
          />
          <Route
            path="/search/:movieId"
            element={
              <Protect>
                <Movie />
              </Protect>
            }
          />
          <Route
            path="/my-movies"
            element={
              <Protect>
                <MyMovies />
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
