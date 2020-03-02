import request from '@/utils/request';
import token from '@/utils/token';

export async function queryUsers(params) {
  return request('/users', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token.get()}` },
    params,
  });
}

export async function removeUser(id) {
  return request(`/users/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token.get()}` },
  });
}

export async function addUser(params) {
  return request('/users', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.get()}` },
    data: { ...params },
  });
}

export async function updateUser(id, params) {
  return request(`/users/${id}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.get()}` },
    data: { ...params, method: 'update' },
  });
}
