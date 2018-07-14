import { randomBytes } from 'crypto'
import secp256k1 from 'secp256k1'

class Wallet {
  constructor (privKey = null) {
    if (!privKey) {
      do {
        privKey = randomBytes(32)
      } while (!secp256k1.privateKeyVerify(privKey))
    }
    this.privKey = privKey
    this.pubKey = secp256k1.publicKeyCreate(privKey)
    window.localStorage.setItem('privKey', this.privKey.toString('base64'))
  }

  static inStorage () {
    return !!window.localStorage.getItem('privKey')
  }

  static loadFromStorage (password = null) {
    let privKey = Buffer.from(window.localStorage.getItem('privKey'), 'base64')
    return new Wallet(privKey)
  }

  get key () {
    return this.privKey
  }
}

export default Wallet
