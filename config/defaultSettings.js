const { AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } = process.env;

export default {
  navTheme: 'dark',
  primaryColor: '#1890ff',
  layout: 'sidemenu',
  contentWidth: 'Fluid',
  fixedHeader: false,
  autoHideHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  menu: {
    locale: true,
  },
  title: 'Gobs React UI',
  pwa: false,
  iconfontUrl: '',
  auth: {
    clientId: AUTH_CLIENT_ID || 'SecRetAuthKey',
    clientSecret: AUTH_CLIENT_SECRET || 'SecretSuper',
  },
};
