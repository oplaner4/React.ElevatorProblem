import About from 'app/pages/about/About';
import BuildingUsage from 'app/pages/building/BuildingUsage';
import PrepareData from 'app/pages/data/PrepareData';
import Home from 'app/pages/home/Home';

import { appAlertsAtom } from 'app/state/atom';
import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

export enum AppRouteGroup {
  Default = 0,
  User = 1,
}

export enum AppRoute {
  Default = 0,
  Home = 1,
  About = 2,
  PrepareData = 3,
  BuildingUsage = 4,
}

export interface AppRouteDefinition {
  path: string;
  element: React.ReactElement;
  inMenu: boolean;
  title: string;
  menuTitle: string | null;
  group: AppRouteGroup;
}

export const UseRoutes: Record<number, AppRouteDefinition> = {};

UseRoutes[AppRoute.Default] = {
  path: '/',
  element: <Home />,
  inMenu: false,
  title: 'Home',
  menuTitle: 'Home',
  group: AppRouteGroup.Default,
};

UseRoutes[AppRoute.Home] = {
  path: '/home',
  element: UseRoutes[AppRoute.Default].element,
  inMenu: true,
  title: UseRoutes[AppRoute.Default].title,
  menuTitle: UseRoutes[AppRoute.Default].menuTitle,
  group: AppRouteGroup.Default,
};

UseRoutes[AppRoute.About] = {
  path: '/about',
  element: <About />,
  inMenu: true,
  title: 'About',
  menuTitle: 'About',
  group: AppRouteGroup.Default,
};

UseRoutes[AppRoute.PrepareData] = {
  path: '/data',
  element: <PrepareData />,
  inMenu: true,
  title: 'Prepare data',
  menuTitle: 'Prepare data',
  group: AppRouteGroup.Default,
};

UseRoutes[AppRoute.BuildingUsage] = {
  path: '/usage',
  element: <BuildingUsage />,
  inMenu: false,
  title: 'Building usage',
  menuTitle: 'Building usage',
  group: AppRouteGroup.Default,
};

export const iterateThroughRoutes = (): AppRoute[] => {
  return Object.keys(UseRoutes)
    .filter((route) => !isNaN(Number(route)))
    .map((route) => Number(route) as AppRoute);
};

export interface AppRoutesProps {
  onChange: (route: AppRoute) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ onChange }: AppRoutesProps) => {
  const setAppAlerts = useSetRecoilState(appAlertsAtom);
  const location = useLocation();

  useEffect(() => {
    const route =
      Object.keys(UseRoutes)
        .map((k) => k as unknown as AppRoute)
        .find((r) => UseRoutes[r as AppRoute].path === location.pathname) ?? AppRoute.Default;

    onChange(route);

    setAppAlerts([]);
  }, [location, onChange, setAppAlerts]);

  return (
    <Routes>
      {iterateThroughRoutes().map((route) => {
        return <Route key={route} path={UseRoutes[route].path} element={UseRoutes[route].element} />;
      })}
    </Routes>
  );
};

export default AppRoutes;
