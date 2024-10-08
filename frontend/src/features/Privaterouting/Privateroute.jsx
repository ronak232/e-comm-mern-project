import { Navigate } from "react-router-dom";
import { useFirebaseAuth } from "../../hooks/firebase/firebase..config.jsx";

function Privateroute({ children }) {
  const { isUserLoggedIn } = useFirebaseAuth();

  return isUserLoggedIn ? children : <Navigate replace={true} to={"/login"} />;
}

export default Privateroute;
