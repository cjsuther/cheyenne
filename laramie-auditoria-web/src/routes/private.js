import {
    HomeView,
    UnauthorizedView,
    PageNotFoundView,
    EventosView,
    AlertasView,
    IncidenciasView,
    EventoView,
    AlertaView,
    IncidenciaView,
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
    code: "unauthorized",
    path: "/unauthorized",
    component: UnauthorizedView,
    title: "Unauthorized",
    showHeader: false,
    nivelMenu: 0,
    children: []
  },
//not-found
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
  {
    index: 11,
    code: "auditoria_view",
    path: "/eventos",
    component: EventosView,
    title: "Eventos",
    showHeader: true,
    nivelMenu: 1,
    children: []
  },
  {
    index: 12,
    code: "auditoria_view",
    path: "/evento/:id",
    component: EventoView,
    title: "Evento",
    showHeader: false,
    nivelMenu: 2,
    children: []
  },
  {
    index: 13,
    code: "auditoria_view",
    path: "/alertas",
    component: AlertasView,
    title: "Alertas",
    showHeader: true,
    nivelMenu: 1,
    children: []
  },
  {
    index: 14,
    code: "auditoria_view",
    path: "/alerta/:id",
    component: AlertaView,
    title: "Alerta",
    showHeader: false,
    nivelMenu: 2,
    children: []
  },
  {
    index: 15,
    code: "auditoria_view",
    path: "/incidencias",
    component: IncidenciasView,
    title: "Incidencias",
    showHeader: true,
    nivelMenu: 1,
    children: []
  },
  {
    index: 16,
    code: "auditoria_view",
    path: "/incidencia/:id",
    component: IncidenciaView,
    title: "Incidencia",
    showHeader: false,
    nivelMenu: 2,
    children: []
  },
];
