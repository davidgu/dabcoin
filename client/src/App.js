import React, { Component } from 'react'
import Wallet from './Wallet'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import { Button } from 'semantic-ui-react'

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
      view: 0
    }
  }

  handleClick (event, data) {
    this.setState({ view: data.index })
    console.log(data)
  }

  render () {
    const views = [
      <div className='main'>
        <div className='Wallet-container'>
          <p>Balance: <code>10 dabcoins</code></p>
        </div>
        <div className='Wallet-container'>
          <Button index={1} color='green' onClick={this.handleClick}>Dab</Button>
          <Button index={2} color='red' onClick={this.handleClick}>Dab</Button>
          <Button index={3} color='black' onClick={this.handleClick}>Dab</Button>
        </div>
      </div>,
      <div className='send'>
        <p>You can't send yet</p>
      </div>,
      <div className='recieve'>
        <p>Your address is <code>{this.state.wallet.address}</code></p>
      </div>,
      <div className='mine'>
        <p>START DABBING</p>
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
