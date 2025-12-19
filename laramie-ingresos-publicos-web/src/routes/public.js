import {
    LoginView
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
  }
];
