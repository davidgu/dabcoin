import React, { Component } from 'react'
import Wallet from './Wallet'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import { Button, Input } from 'semantic-ui-react'
import QRCode from 'qrcode.react'
import QrReader from 'react-qr-reader'
import 'whatwg-fetch'

class App extends Component {
  constructor (props) {
    super(props)

    let wallet
    if (Wallet.inStorage()) wallet = Wallet.loadFromStorage()
    else wallet = new Wallet()

    // console.log('Public key (uncompressed): ' + wallet.pubKey.toString('hex'))
    // let timestamp = Buffer.from(Date.now().toString())
    // console.log('Timestamp: ' + timestamp.toString('hex'))
    // let signature = wallet.sign(timestamp).signature
    // console.log('Signature: ' + signature.toString('hex'))
    // wallet.startMining()

    this.state = {
      wallet: wallet,
      view: 0,
      balance: 'Pending...',
      qr: false
    }

    this.numCases = 21
    this.timeInterval = 3

    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSend = this.handleSend.bind(this)
    this.handleScan = this.handleScan.bind(this)
    this.handleQr = this.handleQr.bind(this)
    this.updateBalance = this.updateBalance.bind(this)

    setInterval(this.updateBalance, 1000)
  }

  updateBalance () {
    this.state.wallet.getBalance().then(data => {
      this.setState({ balance: data })
    })
  }

  handleClick (event, data) {
    this.setState({ view: data.index })
  }

  handleChange (event, data) {
    let newState = {}
    newState[data.id] = event.target.value
    this.setState(newState)
  }

  handleSend (event, data) {
    this.state.wallet.send(this.state.recipient, this.state.amount)
    this.setState({ recipient: null, amount: null })
  }

  handleMiner (event, data) {
    event.preventDefault()
    window.location = window.location + 'miner.html'
  }

  handleError (err) {
    console.error(err)
  }

  handleScan (data) {
    if (data) {
      this.setState({ recipient: data, qr: false })
    }
  }

  handleQr (event, data) {
    this.setState({ qr: !this.state.qr })
  }

  render () {
    const back = <Button className='Wallet-container' index={0} onClick={this.handleClick}>Back to menu</Button>
    const qr = (
      <QrReader
        delay={300}
        onError={this.handleError}
        onScan={this.handleScan}
        style={{ width: '20%' }}
      />
    )
    const views = [
      <div className='main'>
        <div className='Wallet-container'>
          <p>Balance: <code>{this.state.balance}</code></p>
        </div>
        <div className='Wallet-container'>
          <Button index={1} color='green' onClick={this.handleClick}>Dab</Button>
          <Button index={2} color='red' onClick={this.handleClick}>Dab</Button>
          <Button index={3} color='black' onClick={this.handleMiner}>Dab</Button>
        </div>
      </div>,
      <div className='Wallet-container'>
        {this.state.qr ? qr : null}
        <Input className='Wallet-container' id='recipient' value={this.state.recipient} onChange={this.handleChange} placeholder='DabCoin address' />
        <br />
        <Input className='Wallet-container' id='amount' value={this.state.amount} onChange={this.handleChange} placeholder='Amount' />
        <br />
        <Button className='Wallet-container' icon='qrcode' onClick={this.handleQr} />
        <Button className='Wallet-container' color='green' disabled={!(this.state.recipient && this.state.amount)} onClick={this.handleSend}>Dab</Button>
        <br />
        {back}
      </div>,
      <div className='Wallet-container'>
        <p>Your address is <code>{this.state.wallet.address}</code></p>
        <QRCode value={this.state.wallet.address} />
        <br />
        {back}
      </div>
    ]

    return (
      <div className='Wallet'>
        <header className='Wallet-header'>
          <h1 index={0} className='Wallet-title' onClick={this.handleClick} >DabCoin Wallet</h1>
        </header>
        {views[this.state.view]}
      </div>
    )
  }
}

export default App
