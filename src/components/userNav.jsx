import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataStore";

function NavBar() {
  const { setUser } = useContext(DataContext);
  const navigate = useNavigate();
  return (
    <nav className="bg-blue-600 p-4 border my-8 ">
      <ul className="flex space-x-8">
        <li>
          <Link to="/user" className="text-white">
            Transactions
          </Link>
        </li>
        <li>
          <Link to="prices" className="text-white">
            Prices
          </Link>
        </li>

        <li>
          <Link to="profile" className="text-white">
            Profile
          </Link>
        </li>

        <li>
          <Link
            to="current"
            className="text-white"
            onClick={() => {
              localStorage.removeItem("user");
              setUser(null);
              navigate("/");
            }}
          >
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
