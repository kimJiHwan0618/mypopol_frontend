const settingsConfig = {
  layout: {
    style: 'mainLayout', // layout1 layout2 layout3 MainLayout
    config: {}, // checkout default layout configs at app/theme-layouts for example  app/theme-layouts/layout1/Layout1Config.js
  },
  /*
   To make whole app auth protected by default set defaultAuth:['admin','staff','user']
   To make whole app accessible without authorization by default set defaultAuth: null
   *** The individual route configs which has auth option won't be overridden.
   */
  defaultAuth: ['ROLE_ADMIN', 'ROLE_MEMBER', 'ROLE_USER'],
  /*
    Default redirect url for the logged-in user,
   */
  loginRedirectUrl: '/dashboard/template',
};

export default settingsConfig;
