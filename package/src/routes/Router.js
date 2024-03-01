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
const ManageSales = lazy(() => import('../views/dashboard/manage-sales/ManageSales'));
const Reports = lazy(() => import('../views/dashboard/reports/Reports'));

/* ***Authentication**** */
const Login = lazy(() => import('../views/authentication/login/Login'));
const Error = lazy(() => import('../views/authentication/Error'));

/*****Routes******/

const ThemeRoutes = [
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
      { path: 'manage-sales', exact: true, element: <ManageSales /> },
      { path: 'reports', exact: true, element: <Reports /> },
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
