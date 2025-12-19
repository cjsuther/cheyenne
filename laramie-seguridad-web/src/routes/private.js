import {
    HomeView,
    WelcomeView,
    UnauthorizedView,
    UsuariosView,
    UsuarioPerfilesView,
    PerfilesView,
    PerfilPermisosView,
    PageNotFoundView
} from '../views';

export const PrivateRoutes = [
  {
    index: 0,
    code: "home",
    path: "/",
    component: HomeView,
    title: "Home",
    showHeader: true,
    nivelMenu: 0,
    children: []
  },
  {
    index: 5,
    code: "welcome",
    path: "/welcome",
    component: WelcomeView,
    title: "Welcome",
    showHeader: false,
    nivelMenu: 0,
    children: []
  },
  {
    index: 10,
    code: "unauthorized",
    path: "/unauthorized",
    component: UnauthorizedView,
    title: "Unauthorized",
    showHeader: false,
    nivelMenu: 0,
    children: []
  },
  {
    index: 20,
    code: "usuario_GET",
    path: "/usuarios",
    component: UsuariosView,
    title: "Usuarios",
    showHeader: true,
    nivelMenu: 1,
    children: []
  },
  {
    index: 25,
    code: "usuario_GET",
    path: "/usuario/perfiles/:idUsuario",
    component: UsuarioPerfilesView,
    title: "Perfiles del Usuario",
    showHeader: true,
    nivelMenu: 0,
    children: []
  },
  {
    index: 30,
    code: "perfil_GET",
    path: "/perfiles",
    component: PerfilesView,
    title: "Perfiles",
    showHeader: true,
    nivelMenu: 1,
    children: []
  },
  {
    index: 35,
    code: "perfil_GET",
    path: "/perfil/permisos/:idPerfil",
    component: PerfilPermisosView,
    title: "Permisos del Perfil",
    showHeader: true,
    nivelMenu: 0,
    children: []
  },
  {
    index: 999,
    code: "not-found",
    path: "*",
    component: PageNotFoundView,
    title: "Página no encontrada",
    showHeader: false,
    nivelMenu: 0,
    children: []
  },
];
