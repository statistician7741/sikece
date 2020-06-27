import React from 'react'
import { connect } from 'react-redux';
import BasicLayout from "../../layouts/sikece/BasicLayout";

import dynamic from 'next/dynamic';
const IndexComponent = dynamic(() => import("../../component/sikece/persetujuan/index.Component"));


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
  const { socket: { socket }, user: { active_user }, master: { all_kec, all_kec_obj, all_kec_table_obj, all_deskel, all_variable, all_variable_obj, all_table } } = state
  return { socket, active_user, all_kec, all_kec_obj, all_kec_table_obj, all_deskel, all_variable, all_variable_obj, all_table }
}

export default connect(mapStateToProps)(Index)