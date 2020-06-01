import { connect } from 'react-redux';
import { Alert, Button, Form, Input, Select, Layout } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { UserOutlined, LockOutlined } from '@ant-design/icons'

import Link from "next/link";

import { kab } from '../../config/env.config'

import "./login.less"

class Login extends React.Component {
    state = {
        errMsg: undefined,
        loading: false,
        tahun_anggaran: [new Date().getFullYear()]
    }

    componentDidMount = () => {
        this.input.focus()
        setTimeout(() => {
            const { socket } = this.props;
            if (socket) {
                socket.emit('api.socket.pok/s/getTahunAnggaran', (response) => {
                    console.log(response);
                    if (response.type === 200) this.setState({ tahun_anggaran: response.data });
                })
            }
        }, 100)
    }

    saveInputRef = input => this.input = input

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) return
            values.username = values.username.toLowerCase()
            // this.setState({ loading: true, errMsg: undefined }, () => {
            //     axios.post('/api/login', values)
            //         .then((response) => {
            //             if (response.data === 200) {
            //                 window.open('/', "_top")
            //                 return
            //             } else if (response.data === 422) {
            //                 this.setState({ errMsg: 'Username atau password salah.' })
            //             } else {
            //                 this.setState({ errMsg: response.data })
            //             }
            //             this.setState({ loading: false });
            //         })
            //         .catch((error) => {
            //             console.log(error);
            //             this.setState({ loading: false });
            //         });
            // })
        });
    };

    render() {
        const { errMsg, loading } = this.state
        return (
            <Layout style={{ background: "#fff", minHeight: '100vh' }}>
                <div className={'login_container'}>
                    <div className={'login_content'}>
                        <div className={'login_top'}>
                            <div className={'login_header'}>
                                <Link href="/">
                                    <div>
                                        <img src={`/static/sikece.png`} className={'login_logo'} />
                                    </div>
                                </Link>
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
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <FormItem>
                                    {/* {getFieldDecorator("username", {
                                        rules: [
                                            { required: true, message: "Mohon input username Anda." }
                                        ]
                                    })( */}
                                    <Form.Item name="username" noStyle>
                                        <Input
                                            prefix={
                                                <UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                                            }
                                            ref={this.saveInputRef}
                                            type="string"
                                            placeholder="username"
                                            size='large'
                                            autoComplete="off"
                                            disabled={loading}
                                        />
                                    </Form.Item>
                                    {/* )} */}
                                </FormItem>
                                <FormItem>
                                    {/* {getFieldDecorator("password", {
                                        rules: [
                                            { required: true, message: "Mohon input password Anda." }
                                        ]
                                    })( */}
                                    <Form.Item name="password" noStyle>
                                        <Input
                                            prefix={
                                                <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                                            }
                                            type="password"
                                            placeholder="password"
                                            size='large'
                                            autoComplete="off"
                                            disabled={loading}
                                        />
                                    </Form.Item>
                                    {/* )} */}
                                </FormItem>
                                <FormItem>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        size='large'
                                        className={'login_submit'}
                                        loading={this.state.loading}
                                        onClick={this.enterLoading}
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
                    {/* <div>{alamat}</div> */}
                </Layout.Footer>
            </Layout>
        )
    }
}

// const WrappedNormalLoginForm = Form.create()(Login);

function mapStateToProps(state) {
    const { socket } = state.socket
    return { socket }
}

export default connect(mapStateToProps)(Login)