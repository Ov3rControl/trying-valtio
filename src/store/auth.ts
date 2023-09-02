import { proxy, useSnapshot } from "valtio";
import z from "zod";
import { AuthResponseSchema } from "../schemas";

export type User = z.infer<typeof AuthResponseSchema> | null;

const state = proxy({
  user: null as User,
});

export const useAuth = () => {
  const snapshot = useSnapshot(state);
  return {
    user: snapshot.user,
    setUser: (newUser: User) => {
      state.user = newUser;
    },
    logout: () => {
      state.user = null;
    },
  };
};
