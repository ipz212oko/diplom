import { useNavigate } from "react-router";
import { useAuth } from "@/providers/AuthProvider.jsx";
import { Button } from "@chakra-ui/react";

export function Logout(props) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const logoutUser = () => {
    logout();
    navigate("/");
  }

  return <Button onClick={logoutUser} {...props}>Вийти</Button>
}