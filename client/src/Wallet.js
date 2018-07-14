import { randomBytes } from 'crypto'
import cryptoHash from 'crypto-hashing'
import bs58check from 'bs58check'
import secp256k1 from 'secp256k1'

class Wallet {
  constructor (privKey = null) {
    if (!privKey) {
      do {
        privKey = randomBytes(32)
      } while (!secp256k1.privateKeyVerify(privKey))
    }
    this.privKey = privKey
    this.pubKey = secp256k1.publicKeyCreate(privKey, false)
    window.localStorage.setItem('privKey', this.privKey.toString('hex'))
  }

  static inStorage () {
    return !!window.localStorage.getItem('privKey')
  }

  static loadFromStorage (password = null) {
    let privKey = Buffer.from(window.localStorage.getItem('privKey'), 'hex')
    return new Wallet(privKey)
  }

  get address () {
    let hash = cryptoHash('hash160', this.pubKey)
    return 'dab' + bs58check.encode(hash)
  }

  sign (data) {
    if (data.length > 32) throw new Error('data must be less than or equal to 32 bytes')
    let paddedData = Buffer.concat([
      Buffer.alloc(32 - data.length, 0),
      data
    ])
    console.log('padded: ' + paddedData.toString('hex'))
    return secp256k1.sign(paddedData, this.privKey)
  }
}

export default Wallet
