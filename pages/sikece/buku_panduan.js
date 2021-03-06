import React from 'react'
import { connect } from 'react-redux';
import BasicLayout from "../../layouts/sikece/BasicLayout";

import dynamic from 'next/dynamic';
const IndexComponent = dynamic(() => import("../../component/sikece/buku_panduan/index.Component"));


class Index extends React.Component {
  static async getInitialProps({ req, res }) {
    return {}
  }

  render() {
    return (
      <BasicLayout {...this.props}>
        <IndexComponent  {...this.props}/>
      </BasicLayout>
    )
  }
}

function mapStateToProps(state) {
  const { socket: { socket }, user: { active_user } } = state
  return { socket, active_user }
}

export default connect(mapStateToProps)(Index)