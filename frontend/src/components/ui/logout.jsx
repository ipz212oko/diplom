import { useAuth } from "@/providers/AuthProvider.jsx";
import { Button } from "@chakra-ui/react";

export function Logout({ children, ...props }) {
  const { logout } = useAuth();

  const logoutUser = () => {
    logout();
  }

  return <Button onClick={logoutUser} outline="none" {...props}>{children || "Вийти"}</Button>
}