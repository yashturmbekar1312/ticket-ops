import { useAppSelector } from "./redux";
import { UserRole } from "../types";

export const useAuth = () => {
  const { user, token, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated: !!token && !!user,
    userRole: user?.role as UserRole | undefined,
  };
};

export const useRole = () => {
  const { user } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = (): boolean => {
    return user?.role === "IT Admin";
  };

  const isManager = (): boolean => {
    return user?.role === "Manager";
  };

  const isHR = (): boolean => {
    return user?.role === "HR";
  };

  const isEmployee = (): boolean => {
    return user?.role === "Employee";
  };

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isManager,
    isHR,
    isEmployee,
    currentRole: user?.role,
  };
};
