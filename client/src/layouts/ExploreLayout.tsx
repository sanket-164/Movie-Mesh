import { Outlet } from "react-router-dom";
import ExploreBar from "../components/ExploreBar";

const ExploreLayout = () => {
  return (
    <>
      <ExploreBar />
      <div className="bg-light">
        <Outlet />
      </div>
    </>
  );
};

export default ExploreLayout;
