
import { UserContext } from "@/providers/AuthProvider";
import { useContext } from "react";


export const useUser = () => useContext(UserContext);