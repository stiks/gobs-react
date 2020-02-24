import { stringify } from 'querystring';
import { router } from 'umi';
import { accountLogin, forgotPassword } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { notification } from 'antd';
import token from '@/utils/token';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.token_type === 'Bearer') {
        token.save(response.access_token);

        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        router.replace(redirect || '/');
      }
    },

    *forgot({ payload }, { call, put }) {
      const response = yield call(forgotPassword, payload);
      yield put({
        type: 'changeForgotPassword',
        payload: response,
      });

      if (response.status === 'ok') {
        notification.open({
          message: 'Reset',
          description: 'Forgot password request has been sent, you should receive email shortly',
          type: 'success',
        });

        router.replace('/user/login');
      }
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      // clear the token
      token.remove();

      // setAuthority to guest
      setAuthority('guest');

      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.authority);
      return { ...state, status: 'ok', type: payload.type };
    },
    changeForgotPassword(state, { payload }) {
      return { ...state, status: 'ok', type: payload.type };
    },
  },
};
export default Model;
