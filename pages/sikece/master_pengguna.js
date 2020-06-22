import React from 'react'
import { connect } from 'react-redux';
import BasicLayout from "../../layouts/sikece/BasicLayout";

import dynamic from 'next/dynamic';
const IndexComponent = dynamic(() => import("../../component/sikece/master_pengguna/index.Component"));


class Index extends React.Component {
  static async getInitialProps({ req, res }) {
    return {}
  }

  render() {
    return (
      <BasicLayout {...this.props}>
        <IndexComponent {...this.props} />
      </BasicLayout>
    )
  }
}

function mapStateToProps(state) {
  const { socket: { socket }, master: { all_kec, all_table, all_kab, all_kab_obj }, user: { all_user } } = state
  return { socket, all_user, all_kec, all_table, all_kab, all_kab_obj }
}

export default connect(mapStateToProps)(Index)