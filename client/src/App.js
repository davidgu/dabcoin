import React, { Component } from 'react'
import Wallet from './Wallet'
import './App.css'
import 'semantic-ui-css/semantic.min.css';
import { Button } from 'semantic-ui-react'

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
    wallet.startMining()

    this.state = {
      wallet: wallet
    }
  }

  render () {
    return (
      <div className='Wallet'>
        <header className='Wallet-header'>
          <h1 className='Wallet-title'>DabCoin Wallet</h1>
        </header>
        <div className='Wallet-container'>
          <p>Balance: <code>10 dabcoins</code></p>
        </div>
        <div className='Wallet-container'>
          <Button color='green'>Dab</Button>
          <Button color='red'>Dab</Button>
          <Button color='black'>Dab</Button>
        </div>
      </div>
    )
  }
}

export default App
