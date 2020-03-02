import request from '@/utils/request';

export async function userRegister(params) {
  return request('/account/register', {
    method: 'POST',
    data: params,
  });
}
