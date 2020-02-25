import request from '@/utils/request';

export async function userRegister(params) {
  return request('/api/user/register', {
    method: 'POST',
    data: params,
  });
}
