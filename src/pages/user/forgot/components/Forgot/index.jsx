import React from 'react';
import { Form } from 'antd';
import classNames from 'classnames';
import ForgotContext from './FotgotContext';
import LoginItem from './ForgotItem';
import LoginSubmit from '../../../login/components/Login/LoginSubmit';

import styles from './index.less';

const Forgot = props => {
  const { className } = props;

  return (
    <ForgotContext.Provider>
      <div className={classNames(className, styles.login)}>
        <Form
          form={props.from}
          onFinish={values => {
            if (props.onSubmit) {
              props.onSubmit(values);
            }
          }}
        >
          {props.children}
        </Form>
      </div>
    </ForgotContext.Provider>
  );
};

Forgot.Submit = LoginSubmit;
Forgot.UserName = LoginItem.UserName;

export default Forgot;
