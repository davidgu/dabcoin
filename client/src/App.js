import React, { Component } from 'react'
import Wallet from './Wallet'
import './App.css'
import 'semantic-ui-css/semantic.min.css'
import { Button } from 'semantic-ui-react'
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
      dab: false
    }

    this.numCases = 21
    this.timeInterval = 3

    this.handleClick = this.handleClick.bind(this)
    this.handleDab = this.handleDab.bind(this)
    this.handleDeviceMotion = this.handleDeviceMotion.bind(this)
    this.updateBalance = this.updateBalance.bind(this)

    setInterval(this.updateBalance, 1000)
  }

  componentDidMount () {
    window.addEventListener('devicemotion', this.handleDeviceMotion)
    window.addEventListener('deviceorientation', this.handleDeviceOrientation)
  }

  componentWillUnmount () {
    window.removeEventListener('devicemotion', this.handleDeviceMotion)
    window.removeEventListener('deviceorientation', this.handleDeviceOrientation)
  }

  updateBalance () {
    this.state.wallet.getBalance().then(data => {
      this.setState({ balance: data })
    })
  }

  handleDeviceMotion (event) {
    let count = 0
    let maxAX, maxAY, maxAZ
    let dabData = []
    if (this.state.dab) {
      count++
      if (count % this.timeInterval === 0) {
        maxAX = event.acceleration.x.toFixed(2)
        maxAY = event.acceleration.y.toFixed(2)
        maxAZ = event.acceleration.z.toFixed(2)
        dabData.push([maxAX, maxAY, maxAZ])
        if (dabData.length >= this.numCases) {
          fetch('http://one.dabcoin.1lab.me:5000/mine', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'address': this.address,
              'dab_data': dabData
            })
          })
          this.setState({ dab: false })
          dabData = []
        }
      }
    }
  }

  handleDeviceOrientation (event, data) {
    console.log(event)
    console.log(data)
  }

  handleClick (event, data) {
    this.setState({ view: data.index })
  }

  handleDab (event, data) {
    this.setState({ dab: true })
  }

  render () {
    const back = <Button className='Wallet-container' index={0} onClick={this.handleClick}>Back to menu</Button>
    const views = [
      <div className='main'>
        <div className='Wallet-container'>
          <p>Balance: <code>{this.state.balance}</code></p>
        </div>
        <div className='Wallet-container'>
          <Button index={1} color='green' onClick={this.handleClick}>Dab</Button>
          <Button index={2} color='red' onClick={this.handleClick}>Dab</Button>
          <Button index={3} color='black' onClick={this.handleClick}>Dab</Button>
        </div>
      </div>,
      <div className='Wallet-container'>
        <p>You can't send yet</p>
        {back}
      </div>,
      <div className='Wallet-container'>
        <p>Your address is <code>{this.state.wallet.address}</code></p>
        {back}
      </div>,
      <div className='Wallet-container'>
        <Button color='green' onClick={this.handleDab}>Dab</Button>
        {back}
      </div>
    ]

    return (
      <div className='Wallet'>
        <header className='Wallet-header'>
          <h1 index={0} className='Wallet-title' onClick={this.handleClick} >DabCoin Wallet</h1>
          {this.state.dab.toString()}
        </header>
        {views[this.state.view]}
      </div>
    )
  }
}

export default App
