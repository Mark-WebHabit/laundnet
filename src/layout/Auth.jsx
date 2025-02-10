import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataStore";
import Header from "../components/Header";

function Auth() {
  const navigate = useNavigate();
  const { user } = useContext(DataContext);

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.isAdmin) {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  }, [user, navigate]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </main>
  );
}

export default Auth;
