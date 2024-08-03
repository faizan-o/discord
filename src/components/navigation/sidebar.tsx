import ServerSidebar from "./server-sidebar";
import ServerActionsSidebar from "./server-details-sidebar/server-details-sidebar";

const Sidebar = () => {
  return (
    <div className="flex items-center w-full h-full">
      {<ServerSidebar />}
      {/*@ts-ignore */}
      {<ServerActionsSidebar />}
    </div>
  );
};

export default Sidebar;
