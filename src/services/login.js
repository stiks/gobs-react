import request from '@/utils/request';
import defaultSettings from '@/../config/defaultSettings';

export async function accountLogin(params) {
  return request('/auth/token', {
    method: 'POST',
    data: {
      grant_type: 'password',
      client_id: defaultSettings.auth.clientId,
      client_secret: defaultSettings.auth.clientSecret,
      ...params,
    },
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
