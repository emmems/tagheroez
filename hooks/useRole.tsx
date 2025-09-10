"use client";

import { createContext, ReactNode, useContext } from "react";
import { APIMethod, checkPermissions } from "../lib/role.definition";

interface RoleContextType {
  role?: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
  role?: string;
}

export function RoleProvider({ children, role }: RoleProviderProps) {
  return (
    <RoleContext.Provider value={{ role }}>{children}</RoleContext.Provider>
  );
}

export function useRole(method: APIMethod) {
  const context = useContext(RoleContext);

  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }

  const { role } = context;

  const hasPermission = () => {
    if (role == null) return false;
    try {
      checkPermissions(method, role);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    hasPermission: hasPermission(),
    role,
  };
}
