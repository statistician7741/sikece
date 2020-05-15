import { Avatar, Breadcrumb, Dropdown, Layout, Menu } from "antd";
const { Content, Footer, Header } = Layout;
import Link from "next/link";
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'

import "./BasicLayout.less"

const LinkTo = ({url, name}) => (
  <Link href={`${url}`}>{name}</Link>
);

const menu = (
  <Menu className={'menu'} selectedKeys={[]}>
    <Menu.Item key="userCenter">
      <Link href='logout'>
        <div><LogoutOutlined /> Logout</div>
      </Link>
    </Menu.Item>
  </Menu>
);


export default class BasicLayout extends React.Component {
  render() {
    return (
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header>
          <Link href="/"><a><img className="logo" src={`/static/logo.png`} /></a></Link>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1"><LinkTo url="monitoring" name="Monitoring" /></Menu.Item>
            <Menu.Item key="2"><LinkTo url="master_tabel" name="Master Tabel" /></Menu.Item>
            <Menu.Item key="3"><LinkTo url="approval" name="Approval Data" /></Menu.Item>
            <Menu.Item key="4"><LinkTo url="entri_data" name="Entri Data" /></Menu.Item>
            <Menu.Item key="5"><LinkTo url="master_pengguna" name="Master Pengguna" /></Menu.Item>
            <Menu.Item key="6"><LinkTo url="buku_panduan" name="Buku Panduan" /></Menu.Item>
            <span className="right">
              <Dropdown overlay={menu} trigger={['click']}>
                <span className={`action account`}>
                  <Avatar className={'avatar'} icon={<UserOutlined />} />
                Pengguna 1
              </span>
              </Dropdown>
            </span>
          </Menu>
        </Header>
        <Content
          style={{
            margin: "10px 16px",
            padding: 10,
            background: "#fff",
            minHeight: 280
          }}
        >
          {this.props.children}
        </Content>
        <Footer style={{ textAlign: "center" }}>
          BPS Kab. Buton ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    );
  }
}