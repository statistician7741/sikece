import { connect } from 'react-redux';
import { Alert, Button, Form, Input, Layout } from 'antd';
const FormItem = Form.Item;
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import axios from 'axios'
import Router from 'next/router'

import { kab } from '../../config/env.config'

import "./login.less"

class Login extends React.Component {
    state = {
        errMsg: undefined,
        loading: false,
        username: undefined,
        password: undefined
    }

    componentDidMount = () => {
        this.input.focus()
    }
    onChangeInput = (changedValues) => this.setState(changedValues)

    saveInputRef = input => this.input = input

    handleSubmit = values => {
        this.setState({ loading: true, errMsg: undefined }, () => {
            axios.post('/sikece/login', values)
                .then((response) => {
                    if (response.data === 'ok') {
                        window.open('/sikece', "_top")
                    } else if (response.data === 'error') {
                        this.setState({ loading: false, errMsg: 'Username atau password salah.' })
                    } else {
                        this.setState({ loading: false, errMsg: response.data })
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({ loading: false });
                });
        })
    };

    render() {
        const { errMsg, loading } = this.state
        return (
            <Layout style={{ background: "#fff", minHeight: '100vh' }}>
                <div className={'login_container'}>
                    <div className={'login_content'}>
                        <div className={'login_top'}>
                            <div className={'login_header'}>
                                <div>
                                    <img src={`/static/sikece.png`} className={'login_logo'} />
                                </div>
                            </div>
                            <div className={'login_desc'}>Sistem Informasi Kecamatan Dalam Angka</div>
                        </div>
                        <div className={'login_main'}>
                            {errMsg ? (
                                <Alert
                                    message={errMsg}
                                    type="error"
                                    showIcon
                                    closable
                                    onClose={this.onClose}
                                    style={{ marginBottom: '21px' }}
                                />
                            ) : null}
                            <Form onFinish={this.handleSubmit} className="login-form" onValuesChange={this.onChangeInput} >
                                <FormItem
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input username Anda',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={
                                            <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                                        }
                                        ref={this.saveInputRef}
                                        placeholder="username"
                                        size='large'
                                        autoComplete="off"
                                        disabled={loading}
                                    />
                                </FormItem>
                                <FormItem
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon input password Anda',
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={
                                            <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                                        }
                                        placeholder="password"
                                        size='large'
                                        autoComplete="off"
                                        disabled={loading}
                                    />
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        size='large'
                                        className={'login_submit'}
                                        loading={this.state.loading}
                                    >
                                        Masuk
                                    </Button>
                                </FormItem>
                            </Form>
                        </div>
                    </div>
                </div>
                <Layout.Footer style={{ textAlign: "center", background: "#fff" }}>
                    <div>BPS {kab} ©{new Date().getFullYear()}</div>
                </Layout.Footer>
            </Layout>
        )
    }
}

function mapStateToProps(state) {
    const { socket } = state.socket
    return { socket }
}

export default connect(mapStateToProps)(Login)