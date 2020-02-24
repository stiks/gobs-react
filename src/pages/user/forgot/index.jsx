import React, { useState } from 'react';
import { connect } from 'dva';
import ForgotFrom from './components/Forgot';

import styles from '../login/style.less';

const { UserName, Submit } = ForgotFrom;

const Forgot = props => {
  const { submitting } = props;
  const [type, setType] = useState('account');

  const handleSubmit = values => {
    const { dispatch } = props;
    dispatch({
      type: 'login/forgot',
      payload: { ...values, type },
    });
  };

  return (
    <div className={styles.main}>
      <ForgotFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <UserName
          name="email"
          placeholder="Email address"
          rules={[
            {
              required: true,
              message: 'Please enter email address',
            },
          ]}
        />
        <Submit loading={submitting} style={{ float: 'right' }}>
          Submit
        </Submit>
      </ForgotFrom>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Forgot);
