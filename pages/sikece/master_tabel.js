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
      <BasicLayout {...this.props}>
        <IndexComponent {...this.props} />
      </BasicLayout>
    )
  }
}

function mapStateToProps(state) {
  const { socket: { socket }, user: { tahun_buku_monitoring }, master: { all_kab, all_kec, all_deskel, all_bab, all_subject, all_satuan, all_variable, all_variable_obj, all_table } } = state
  return { socket, tahun_buku_monitoring, all_kab, all_kec, all_deskel, all_bab, all_subject, all_satuan, all_variable, all_variable_obj, all_table }
}

export default connect(mapStateToProps)(Index)