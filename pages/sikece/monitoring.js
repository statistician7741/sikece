import React from 'react'
import { connect } from 'react-redux';
import BasicLayout from "../../layouts/sikece/BasicLayout";

import dynamic from 'next/dynamic';
const IndexComponent = dynamic(() => import("../../component/sikece/monitoring/index.Component"));


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
  const { socket: { socket }, master: { all_kab, all_kab_obj, all_kec_table_obj_m, all_kec, all_kec_obj, all_kec_table_arr_m, all_variable, all_variable_obj, all_table }, user: { penyDataCount, tahun_buku_monitoring, active_user } } = state
  return { socket, all_kab, all_kab_obj, all_kec, all_kec_obj, all_kec_table_arr_m, all_kec_table_obj_m, all_variable, all_variable_obj, all_table, penyDataCount, tahun_buku_monitoring, active_user }
}

export default connect(mapStateToProps)(Index)