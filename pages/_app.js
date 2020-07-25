import App, { Container } from 'next/app'
import Head from 'next/head'
import { initStore } from '../redux/store'
import io from "socket.io-client";
import { message, notification } from 'antd'
import { DisconnectOutlined } from '@ant-design/icons'
import { Provider } from 'react-redux'
import React from 'react'
import { setSocket } from '../redux/actions/socket.action'
import withRedux from "next-redux-wrapper";
import { kab } from '../config/env.config'
import dynamic from 'next/dynamic'

import style from './_app.less';

const Widget = dynamic(
  () => import('../Component/sikece/general/WidgetChat.Component'),
  { ssr: false }
)

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    pageProps.router = router;

    return { pageProps }
  }

  showInfoMessage = (msg) => {
    message.info(msg);
  }

  showSuccessMessage = (msg) => {
    message.success(msg);
  }

  showWarningMessage = (msg) => {
    message.warning(msg);
  }

  showErrorMessage = (msg) => {
    message.error(msg);
  }

  handleOnDisconnect = () => {
    notification.open({
      message: 'Koneksi terputus',
      description: 'Koneksi ke server terputus, mohon periksa internet Anda.',
      icon: <DisconnectOutlined />,
      duration: 0
    });
  };

  handleOnConnect = () => {
    notification.destroy()
  };

  handleNewUserMessage = (newMessage) => {
    this.props.store.getState().socket.socket.emit('sendChat', { msg: newMessage, from: undefined });
  }

  componentDidMount = () => {
    if (!this.props.store.getState().socket.socket) {
      const socket = io.connect(`http://${window.location.hostname}`, { secure: false });
      this.props.store.dispatch(setSocket(socket))
      socket.on('disconnect', this.handleOnDisconnect)
      socket.on('connect', this.handleOnConnect)
    }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Provider store={store}>
        <div>
          <Head>
            <title>SIKECE - BPS {kab}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
          </Head>
          <Component
            {...pageProps}
            showSuccessMessage={this.showSuccessMessage}
            showErrorMessage={this.showErrorMessage}
            showInfoMessage={this.showInfoMessage}
            showWarningMessage={this.showWarningMessage}
          />
          {/* <Widget
            title="Chat SIKECE"
            subtitle="Kirimkan pesan Anda ke kami"
            senderPlaceHolder="Ketikkan pesan Anda..."
            showCloseButton={true}
            badge={1}
            handleNewUserMessage={this.handleNewUserMessage}
          /> */}
        </div>
      </Provider>
    )
  }
}

export default withRedux(initStore)(MyApp);