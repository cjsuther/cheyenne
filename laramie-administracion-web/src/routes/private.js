import {
    HomeView,
    UnauthorizedView,
    ExpedientesView,
    PersonasFisicasView,
    PersonaFisicaView,
    PersonasJuridicasView,
    PersonaJuridicaView,
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
    code: "expediente_GET",
    path: "/expedientes",
    component: ExpedientesView,
    title: "Expedientes",
    showHeader: true,
    nivelMenu: 1,
    children: []
  },
  {
    index: 30,
    path: "",
    component: null,
    title: "Personas",
    showHeader: true,
    nivelMenu: 1,
    children: [31,33]
  },
  {
    index: 31,
    code: "persona-fisica_GET",
    path: "/personas-fisicas",
    component: PersonasFisicasView,
    title: "Personas Físicas",
    showHeader: true,
    nivelMenu: 2,
    children: []
  },
  {
    index: 32,
    code: "persona-fisica_GET",
    path: ["/persona-fisica/:mode", "/persona-fisica/:mode/:id"],
    component: PersonaFisicaView,
    title: "Persona Física",
    showHeader: true,
    nivelMenu: 0,
    children: []
  },
  {
    index: 33,
    code: "persona-juridica_GET",
    path: "/personas-juridicas",
    component: PersonasJuridicasView,
    title: "Personas Jurídicas",
    showHeader: true,
    nivelMenu: 2,
    children: []
  },
  {
    index: 34,
    code: "persona-juridica_GET",
    path: ["/persona-juridica/:mode", "/persona-juridica/:mode/:id"],
    component: PersonaJuridicaView,
    title: "Persona Jurídica",
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
