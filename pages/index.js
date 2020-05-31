import React from 'react'
import Router from 'next/router'

export default class extends React.Component {
  static async getInitialProps({ req, res }) {
    if (res) {
      res.writeHead(302, {
        Location: `http://${req.hostname}/sikece/monitoring`
      })
      res.end()
    } else {
      Router.push("/sikece/monitoring")
    }
    return {}
  }
}