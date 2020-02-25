import { connect } from 'dva';
import { UploadOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import { Button, Input, Upload, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component, Fragment } from 'react';

import '@ant-design/compatible/assets/index.css';
import styles from './BaseView.less';

const FormItem = Form.Item;

const AvatarView = ({ avatar }) => (
  <Fragment>
    <div className={styles.avatar_title}>
      <FormattedMessage id="settings.basic.avatar" defaultMessage="Avatar" />
    </div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar" />
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined />
          <FormattedMessage id="settings.basic.change-avatar" defaultMessage="Change avatar" />
        </Button>
      </div>
    </Upload>
  </Fragment>
);

class BaseView extends Component {
  view = undefined;

  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;

    if (currentUser) {
      Object.keys(form.getFieldsValue()).forEach(key => {
        const obj = {};
        obj[key] = currentUser[key] || null;
        form.setFieldsValue(obj);
      });
    }
  };

  getAvatarURL() {
    const { currentUser } = this.props;

    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }

      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }

    return '';
  }

  getViewDom = ref => {
    this.view = ref;
  };

  handlerSubmit = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields(err => {
      if (!err) {
        message.success(
          formatMessage({
            id: 'settings.basic.update.success',
          }),
        );
      }
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      currentUser,
    } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem
              label={formatMessage({
                id: 'settings.basic.email',
              })}
            >
              {getFieldDecorator('email', {
                initialValue: currentUser.email || undefined,
                rules: [
                  {
                    required: true,
                    message: formatMessage(
                      {
                        id: 'settings.basic.email-message',
                      },
                      {},
                    ),
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem
              label={formatMessage({
                id: 'settings.basic.firstName',
              })}
            >
              {getFieldDecorator('firstName', {
                initialValue: currentUser.firstName || undefined,
                rules: [{ required: true }],
              })(<Input />)}
            </FormItem>
            <FormItem
              label={formatMessage({
                id: 'settings.basic.lastName',
              })}
            >
              {getFieldDecorator('lastName', {
                initialValue: currentUser.lastName || undefined,
                rules: [{ required: true }],
              })(<Input />)}
            </FormItem>
            <Button type="primary" onClick={this.handlerSubmit}>
              <FormattedMessage id="settings.basic.update" defaultMessage="Update Information" />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()} />
        </div>
      </div>
    );
  }
}

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(Form.create()(BaseView));
