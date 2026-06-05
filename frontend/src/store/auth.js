import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setUser: (user) =>
        set({ user, isAuthenticated: true }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),

      hasPermission: (modulo, accion) => {
        const user = get().user;
        if (!user) return false;
        if (user.superuser) return true;
        return (
          user.permisos?.some(
            (p) =>
              p.codigo === `${modulo}_${accion}` ||
              p.codigo === `${modulo}_admin`
          ) ?? false
        );
      },
    }),
    {
      name: 'cheyenne-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
