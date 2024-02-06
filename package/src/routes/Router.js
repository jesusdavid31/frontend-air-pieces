import { lazy } from "react";
import { Navigate } from "react-router-dom";

/* ****Public Pages***** */
const LandingPage = lazy(() => import('../views/public/landing-page/LandingPage'));

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout.js"));
const BlankLayout = lazy(() => import('../layouts/blank-layout/BlankLayout'));
/****End Layouts*****/

/*****Pages******/
const ManageProducts = lazy(() => import('../views/dashboard/manage-products/ManageProducts'));

/* ***Authentication**** */
const Login = lazy(() => import('../views/authentication/login/Login'));
const Error = lazy(() => import('../views/authentication/Error'));

/*****Routes******/

const ThemeRoutes = [
  // {
  //   path: '/',
  //   element: <FullLayout />,
  //   children: [
  //     { path: '/', element: <Navigate to='dashboards/dashboard1' /> },
  //     { path: 'dashboards/dashboard1', exact: true, element: <Dashboard1 /> },
  //     { path: 'tables/basic-table', element: <BasicTable /> },
  //     { path: '/form-layouts/form-layouts', element: <FormLayouts /> },
  //     { path: '/form-elements/autocomplete', element: <ExAutoComplete /> },
  //     { path: '/form-elements/button', element: <ExButton /> },
  //     { path: '/form-elements/checkbox', element: <ExCheckbox /> },
  //     { path: '/form-elements/radio', element: <ExRadio /> },
  //     { path: '/form-elements/slider', element: <ExSlider /> },
  //     { path: '/form-elements/switch', element: <ExSwitch /> },
  //   ],
  // },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: 'landing-page', element: <LandingPage /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/dashboard',
    element: <FullLayout />,
    children: [
      // { path: '/', element: <Navigate to="/manage-products" /> }, esto da error
      { path: 'manage-products', exact: true, element: <ManageProducts /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: '404', element: <Error /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default ThemeRoutes;
