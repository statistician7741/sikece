import React from 'react'
import { connect } from 'react-redux';
import BasicLayout from "../layouts/BasicLayout";

import dynamic from 'next/dynamic';

const TableMaster = dynamic(() => import("../component/TableMaster.component"));

class Index extends React.Component {
  static async getInitialProps({ req, res }) {
    return {}
  }

  render() {
    return (
      <BasicLayout>
        <TableMaster {...this.props} />
      </BasicLayout>
    )
  }
}

function mapStateToProps(state) {
  const { socket } = state.socket
  return { socket }
}

export default connect(mapStateToProps)(Index)