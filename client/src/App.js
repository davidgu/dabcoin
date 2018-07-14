import React, { Component } from 'react'
import Wallet from './Wallet'
import './App.css'

class App extends Component {
  constructor () {
    super()

    let wallet
    if (Wallet.inStorage()) wallet = Wallet.loadFromStorage()
    else wallet = new Wallet()

    console.log('Public key (uncompressed): ' + wallet.pubKey.toString('hex'))
    let timestamp = Buffer.from(Date.now().toString())
    console.log('Timestamp: ' + timestamp.toString('hex'))
    let signature = wallet.sign(timestamp).signature
    console.log('Signature: ' + signature.toString('hex'))


    this.state = {
      wallet: wallet
    }
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Welcome to DabCoin</h1>
        </header>
        <p className='App-intro'>
          Private Key: <code>{this.state.wallet.privKey.toString('hex')}</code>
        </p>
        <p className='App-intro'>
          Public Key: <code>{this.state.wallet.pubKey.toString('hex')}</code>
        </p>
        <p className='App-intro'>
          Address: <code>{this.state.wallet.address}</code>
        </p>
      </div>
    )
  }
}

export default App
