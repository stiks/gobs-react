import React, { useState } from 'react';
import { Alert, Checkbox } from 'antd';
import { Link } from 'umi';
import { connect } from 'dva';
import LoginFrom from './components/Login';

import styles from './style.less';

const { UserName, Password, Submit } = LoginFrom;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');

  const handleSubmit = values => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        {status === 'error' && loginType === 'account' && !submitting && (
          <LoginMessage content="账户或密码错误（admin/ant.design）" />
        )}

        <UserName
          name="username"
          placeholder="Username"
          rules={[
            {
              required: true,
              message: 'Please enter username',
            },
          ]}
        />
        <Password
          name="password"
          placeholder="Password"
          rules={[
            {
              required: true,
              message: 'Please enter password',
            },
          ]}
        />
        <div>
          <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
            Remember me
          </Checkbox>
          <Link className={styles.register} style={{ float: 'right' }} to="/user/forgot">
            Forgot password
          </Link>
        </div>
        <Submit loading={submitting}>Submit</Submit>
        <div className={styles.other}>
          <Link className={styles.register} to="/user/register">
            Register
          </Link>
        </div>
      </LoginFrom>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
