import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataStore";
import NavBar from "../components/userNav";
function User() {
  const navigate = useNavigate();
  const { user } = useContext(DataContext);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }

    if (user?.isAdmin) {
      navigate("/admin");
    }
  }, [user]);

  return (
    <main className="min-h-screen w-full border flex items-center justify-center bg-gray-100 flex-col overflow-x-scroll">
      <NavBar />
      <Outlet />
    </main>
  );
}

export default User;
