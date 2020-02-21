/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';

const errorHandler = async error => {
  const { response } = error;

  if (response && response.status) {
    const { status } = response;

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.match(/application\/json/i)) {
      const json = await response.json();

      if (json.message) {
        notification.error({
          message: `${response.statusText} (${status})`,
          description: json.message,
        });

        return response;
      }

      if (json.errors) {
        notification.error({
          message: `${response.statusText} (${status})`,
          description: json.errors,
        });

        return response;
      }

      if (json.error) {
        notification.error({
          message: `${response.statusText} (${status})`,
          description: json.error,
        });

        return response;
      }

      notification.error({
        message: `${response.statusText} (${status})`,
        description: response.statusText,
      });
    }

    if (status === 401) {
      notification.error({
        message: 'Authorisation required',
      });
      // @HACK
      /* eslint-disable no-underscore-dangle */
      /*
      window.g_app._store.dispatch({
        type: 'login/logout',
      });

      token.remove();
      */

      return response;
    }
  } else if (!response) {
    notification.error({
      message: 'Connection issue',
      description: 'Your network is unavailable or cannot connect to the server',
    });
  }

  return response;
};

const request = extend({
  errorHandler,
  prefix: '/api',
  credentials: 'include',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

export default request;
