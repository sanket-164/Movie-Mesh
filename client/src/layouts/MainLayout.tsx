import { Outlet } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const MainLayout = () => {
  return (
    <>
      <SearchBar />
      <div className="bg-light">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
