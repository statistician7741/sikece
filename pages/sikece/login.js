import { connect } from 'react-redux';
import { Alert, Button, Form, Input, Layout, Select } from 'antd';
const { Option } = Select
const FormItem = Form.Item;
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import axios from 'axios'

import { kab } from '../../config/env.config'

import "./login.less"

class Login extends React.Component {
    state = {
        errMsg: undefined,
        loading: false,
        username: undefined,
        password: undefined,
        tahun_buku: new Date().getFullYear(),
        years: [new Date().getFullYear()]
    }

    componentDidMount = () => {
        this.input.focus()
    }
    onChangeInput = (changedValues) => this.setState(changedValues)
    getAllYearsBab = (props) => {
        props.socket.emit('api.master_tabel.bab/getAllYearsBab', (response) => {
            if (response.type === 'ok') {
                this.setState({ years: response.data })
            } else {
                props.showErrorMessage(response.additionalMsg)
            }
        })
    }

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
    componentDidMount() {
        if (this.props.socket) {
            this.getAllYearsBab(this.props)
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.props.socket !== prevProps.socket) {
            this.getAllYearsBab(this.props)
        }
    }

    render() {
        const { errMsg, loading, years } = this.state
        return (
            <Layout style={{ minHeight: '100vh' }} className={'login_container'}>
                <Layout.Content>
                    <div className={'login_content'}>
                        <div className={'login_top'}>
                            <div className={'login_header'}>
                                <div>
                                    <img src={`/static/logo2.png`} className={'login_logo'} />
                                </div>
                            </div>
                            <div className={'welcome'}>SELAMAT DATANG DI</div>
                            <img src={`/static/logo3.png`} className={'login_logo2'} />
                            <div className={'login_desc'}>SISTEM INFORMASI KECAMATAN DALAM ANGKA</div>
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
                                <Form.Item
                                    name="tahun_buku"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Mohon pilih tahun buku',
                                        },
                                    ]}
                                    initialValue={new Date().getFullYear()}
                                >
                                    <Select
                                        placeholder="Pilih tahun buku"
                                        size='large'
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        showSearch
                                        allowClear
                                        disabled={loading}
                                    >
                                        {years.length ? years.map(y => (<Option value={y} key={y}>{y}</Option>)) : <Option value={new Date().getFullYear()} key="1">{new Date().getFullYear()}</Option>}
                                    </Select>
                                </Form.Item>
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
                </Layout.Content>
                <Layout.Footer className="dt" style={{ textAlign: "center", backgroundColor: "transparent" }}>
                    <div>Badan Pusat Statistik {kab} ©{new Date().getFullYear()}</div>
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