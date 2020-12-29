import { Dropdown, Layout, Menu, Spin, Tag } from "antd";
const { Content, Footer, Header, Sider } = Layout;
import Link from "next/link";
import { LogoutOutlined, UserOutlined, LoadingOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { connect } from 'react-redux';

import { menu, kab, alamat, jenisPengguna } from '../../config/env.config'
import { setActiveUser, toggleMenuCollapsed } from "../../redux/actions/user.action"

import "./BasicLayout.less"

const LinkTo = ({ url, name }) => (
  <Link href={`${url}`}><a style={{ color: "inherit" }}>{name}</a></Link>
);

const userMenu = (
  <Menu selectedKeys={[]}>
    <Menu.Item key="userCenter">
      <Link href='logout'>
        <a><div><LogoutOutlined /> Keluar</div></a>
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
    const { active_user: { name, profil, jenis_pengguna }, isMenuCollapsed, router, tahun_buku_monitoring } = this.props
    let myrouter = menu.filter(m => (m.user_type.includes(jenis_pengguna))).map(m => (m.key))
    return (
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Sider
          breakpoint="xs"
          trigger={null}
          collapsible
          collapsed={isMenuCollapsed}//this.props.sideMenuCollapsed}
        // collapsedWidth={0}
        >
          <Link href="/sikece/monitoring"><a><img className="logo" src={`/static/logo${!isMenuCollapsed?'':'5'}.png`} /></a></Link>
          <div style={{ textAlign: 'center' }}>
            <img src={`/static/${profil?profil:'institusi'}.png`} className={`user-profile${!isMenuCollapsed ? '':'-collapsed'}`} />
            {name ? (!isMenuCollapsed?<div className="user-name">{name}</div>:null) : <LoadingOutlined />}
            {jenis_pengguna ? (!isMenuCollapsed?<div className="jenis-pengguna">{jenisPengguna[jenis_pengguna]}</div>:null) : <LoadingOutlined />}
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.props.router.asPath]}>
            {menu.map(m => m.user_type.includes(jenis_pengguna) ? <Menu.Item key={m.key} icon={<m.icon />}><LinkTo url={m.key} name={m.name} /></Menu.Item> : null)}
          </Menu>
        </Sider>
        <Layout>
          <Header>
            {isMenuCollapsed ? <MenuUnfoldOutlined
              className="trigger"
              onClick={() => this.props.dispatch(toggleMenuCollapsed(!isMenuCollapsed))}
            /> : <MenuFoldOutlined
                className="trigger"
                onClick={() => this.props.dispatch(toggleMenuCollapsed(!isMenuCollapsed))}
              />}
            <span className="center" style={{marginLeft: 10}}><Tag color="#108ee9">KCDA Tahun {tahun_buku_monitoring}</Tag></span>
            {/* <span className="right">
              <Dropdown overlay={userMenu} trigger={['click']}>
                <span className={`action account`} style={{ color: 'white' }}> */}
            {/* <Avatar className={'avatar'} icon={<UserOutlined />} /> */}
            {/* <img src={`/static/profile-man.png`} className={'avatar'} />
                  {name ? name : <LoadingOutlined />}
                </span>
              </Dropdown>
            </span> */}
          </Header>
          <Content
            className={"main-content"}
            style={router.pathname === "/sikece/monitoring" ? { background: "none" } : undefined}
          >
            <Spin spinning={!jenis_pengguna}>
              {myrouter.includes(router.pathname) ? this.props.children : (jenis_pengguna ? `Maaf, Anda tidak memiliki hak untuk mengakses halaman ini. Mohon hubungi Seksi IPDS BPS ${kab}.` : null)}
            </Spin>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            <div>Badan Pusat Statistik {kab} ©{new Date().getFullYear()}</div>
            <div>{alamat}</div>
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  const { socket: { socket }, user: { active_user, isMenuCollapsed, tahun_buku_monitoring } } = state
  return { socket, active_user, isMenuCollapsed, tahun_buku_monitoring }
}

export default connect(mapStateToProps)(BasicLayout)