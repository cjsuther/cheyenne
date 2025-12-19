import {
  ChangePasswordView,
    LoginView,
    LogoutView
} from '../views';

export const PublicRoutes = [
  {
    index: 10,
    path: "/login",
    component: LoginView,
    title: "Login",
    showHeader: false,
    nivelMenu: 0,
    children: []
  },
  {
    index: 20,
    path: "/logout",
    component: LogoutView,
    title: "Logout",
    showHeader: false,
    nivelMenu: 0,
    children: []
  },
  {
    index: 30,
    path: "/change-password/:token",
    component: ChangePasswordView,
    title: "Change Password",
    showHeader: false,
    nivelMenu: 0,
    children: []
  },
];
