import { userRegister } from '@/services/register';

const Model = {
  namespace: 'register',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(userRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.status };
    },
  },
};

export default Model;
