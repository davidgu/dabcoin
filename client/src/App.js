import React, { Component } from 'react'
import Wallet from './Wallet'
import './App.css'

class App extends Component {
  constructor () {
    super()

    let wallet
    if (Wallet.inStorage()) wallet = Wallet.loadFromStorage()
    else wallet = new Wallet()

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
          Private Key: <code>{this.state.wallet.key.toString('hex')}</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App
