import { lazy } from 'react';

const TemplatesDashboard = lazy(() => import('./TemplateDashboard'));

const config = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'dashboard/template',
      element: <TemplatesDashboard />,
    },
  ],
};

export default config;
