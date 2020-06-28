import { Avatar, Dropdown, Layout, Menu } from "antd";
const { Content, Footer, Header } = Layout;
import Link from "next/link";
import { LogoutOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons'
import { connect } from 'react-redux';

import { menu, kab, alamat } from '../../config/env.config'
import { setActiveUser } from "../../redux/actions/user.action"

import "./BasicLayout.less"

const LinkTo = ({ url, name }) => (
  <Link href={`${url}`}><a>{name}</a></Link>
);

const userMenu = (
  <Menu selectedKeys={[]}>
    <Menu.Item key="userCenter">
      <Link href='logout'>
        <a><div><LogoutOutlined /> Logout</div></a>
      </Link>
    </Menu.Item>
  </Menu>
);

class BasicLayout extends React.Component {
  componentDidMount() {
    if (this.props.socket) {
      !this.props.active_user.username && this.props.dispatch(setActiveUser(this.props.socket))
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.socket !== prevProps.socket) {
      this.props.dispatch(setActiveUser(this.props.socket))
    }
  }
  render() {
    const { active_user: { name, jenis_pengguna }, router } = this.props
    return (
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header>
          <Link href="/"><a><img className="logo" src={`/static/logo.png`} /></a></Link>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[this.props.router.asPath]}>
            {menu.map(m => m.user_type.includes(jenis_pengguna) ? <Menu.Item key={m.key}><LinkTo url={m.key} name={m.name} /></Menu.Item> : null)}
            <span className="right">
              <Dropdown overlay={userMenu} trigger={['click']}>
                <span className={`action account`}>
                  <Avatar className={'avatar'} icon={<UserOutlined />} />
                  {name? name:<LoadingOutlined /> }
              </span>
              </Dropdown>
            </span>
          </Menu>
        </Header>
        <Content
          className={"main-content"}
          style={router.pathname === "/sikece/monitoring"?{background: "none"}:undefined}
        >
          {this.props.children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <div>BPS {kab} ©{new Date().getFullYear()}</div>
          <div>{alamat}</div>
        </Footer>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { socket: { socket }, user: { active_user } } = state
  return { socket, active_user }
}

export default connect(mapStateToProps)(BasicLayout)