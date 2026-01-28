import { Outlet } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const MainLayout = () => {
  return (
    <>
      <SearchBar />
      <Outlet />
    </>
  );
};

export default MainLayout;
