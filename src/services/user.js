import request from '@/utils/request';
import token from '@/utils/token';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/account/profile', {
    headers: { Authorization: `Bearer ${token.get()}` },
    method: 'GET',
  });
}

export async function queryNotices() {
  return request('/api/notices');
}
