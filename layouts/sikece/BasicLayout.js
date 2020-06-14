import { Avatar, Breadcrumb, Dropdown, Layout, Menu } from "antd";
const { Content, Footer, Header } = Layout;
import Link from "next/link";
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'

import { menu, kab, alamat } from '../../config/env.config'

import "./BasicLayout.less"

const LinkTo = ({ url, name }) => (
  <Link href={`${url}`}><a>{name}</a></Link>
);

const userMenu = (
  <Menu selectedKeys={[]}>
    <Menu.Item key="userCenter">
      <Link href='login'>
        <a><div><LogoutOutlined /> Logout</div></a>
      </Link>
    </Menu.Item>
  </Menu>
);

export default class BasicLayout extends React.Component {
  render() {
    const user_type = 'admin';
    return (
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header>
          <Link href="/"><a><img className="logo" src={`/static/logo.png`} /></a></Link>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={[this.props.router.asPath]}>
            {menu.map(m => m.user_type.includes(user_type) ? <Menu.Item key={m.key}><LinkTo url={m.key} name={m.name} /></Menu.Item> : null)}
            <span className="right">
              <Dropdown overlay={userMenu} trigger={['click']}>
                <span className={`action account`}>
                  <Avatar className={'avatar'} icon={<UserOutlined />} />
                  {user_type} 1
              </span>
              </Dropdown>
            </span>
          </Menu>
        </Header>
        <Content
          className="main-content"
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