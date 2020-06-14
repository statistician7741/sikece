import React from 'react'
import { connect } from 'react-redux';
import BasicLayout from "../../layouts/sikece/BasicLayout";
import { getKab } from "../../redux/actions/master.action"

import dynamic from 'next/dynamic';
const IndexComponent = dynamic(() => import("../../component/sikece/master_tabel/index.Component"));


class Index extends React.Component {
  static async getInitialProps({ req, res }) {
    return {}
  }

  componentDidUpdate(prevProps) {
    if (this.props.socket !== prevProps.socket) {
      this.props.dispatch(getKab(this.props.socket))
    }
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
  const { socket: { socket }, master: { all_kab } } = state
  return { socket, all_kab }
}

export default connect(mapStateToProps)(Index)