import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Col, Input, Popover, Progress, Row, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './style.less';

const FormItem = Form.Item;
const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="register.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="register.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="register.strength.short" />
    </div>
  ),
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: true,
    help: '',
  };

  interval = undefined;

  componentDidUpdate() {
    const { register, form } = this.props;
    const account = form.getFieldValue('mail');

    if (register.status === 'ok') {
      message.success('Registration success');
      router.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    let count = 59;
    this.setState({
      count,
    });
    this.interval = window.setInterval(() => {
      count -= 1;
      this.setState({
        count,
      });

      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          dispatch({
            type: 'register/submit',
            payload: { ...values },
          });
        }
      },
    );
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;

    if (value && value !== form.getFieldValue('password')) {
      callback(
        formatMessage({
          id: 'register.password.twice',
        }),
      );
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;

    if (!value) {
      this.setState({
        help: formatMessage({
          id: 'register.password.required',
        }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });

      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }

      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;

        if (value && confirmDirty) {
          form.validateFields(['confirm'], {
            force: true,
          });
        }

        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, help, visible } = this.state;
    return (
      <div className={styles.main}>
        <h3>
          <FormattedMessage id="register.register.register" />
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={10}>
            <Col span={12}>
              <FormItem>
                {getFieldDecorator('firstName', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'register.firstName.required',
                      }),
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({
                      id: 'register.firstName.placeholder',
                    })}
                  />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem>
                {getFieldDecorator('lastName', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'register.lastName.required',
                      }),
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({
                      id: 'register.lastName.placeholder',
                    })}
                  />,
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'register.email.required',
                  }),
                },
                {
                  type: 'email',
                  message: formatMessage({
                    id: 'register.email.wrong-format',
                  }),
                },
              ],
            })(
              <Input
                size="large"
                style={{ width: '250px' }}
                placeholder={formatMessage({
                  id: 'register.email.placeholder',
                })}
              />,
            )}
          </FormItem>
          <FormItem help={help}>
            <Popover
              getPopupContainer={node => {
                if (node && node.parentNode) {
                  return node.parentNode;
                }

                return node;
              }}
              content={
                <div
                  style={{
                    padding: '4px 0',
                  }}
                >
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <FormattedMessage id="register.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{
                width: 240,
              }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  style={{ width: '250px' }}
                  placeholder={formatMessage({
                    id: 'register.password.placeholder',
                  })}
                />,
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'register.confirm-password.required',
                  }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                style={{ width: '250px' }}
                placeholder={formatMessage({
                  id: 'register.confirm-password.placeholder',
                })}
              />,
            )}
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: true,
                      message: formatMessage({
                        id: 'register.verification-code.required',
                      }),
                    },
                  ],
                })(
                  <Input
                    size="large"
                    placeholder={formatMessage({
                      id: 'register.verification-code.placeholder',
                    })}
                  />,
                )}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={!!count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count
                    ? `${count} s`
                    : formatMessage({
                        id: 'register.register.get-verification-code',
                      })}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <Row>
            <Col span={12}>
              <Button
                size="large"
                loading={submitting}
                className={styles.submit}
                type="primary"
                htmlType="submit"
              >
                <FormattedMessage id="register.register.register" />
              </Button>
            </Col>
            <Col span={12}>
              <Link className={styles.login} to="/user/login">
                <FormattedMessage id="register.register.sign-in" />
              </Link>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export default connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))(Form.create()(Register));
