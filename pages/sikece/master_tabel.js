import React from 'react'
import { connect } from 'react-redux';
import BasicLayout from "../../layouts/sikece/BasicLayout";

import dynamic from 'next/dynamic';
const IndexComponent = dynamic(() => import("../../component/sikece/master_tabel/index.Component"));


class Index extends React.Component {
  static async getInitialProps({ req, res }) {
    return {}
  }

  render() {
    return (
      <BasicLayout>
        <IndexComponent />
      </BasicLayout>
    )
  }
}

function mapStateToProps(state) {
  const { socket } = state.socket
  return { socket }
}

export default connect(mapStateToProps)(Index)