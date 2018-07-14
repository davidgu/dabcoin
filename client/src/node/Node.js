import 'whatwg-fetch'

class Node {
  constructor (host = '127.0.0.1', port = 5000, ssl = false) {
    this.url = `http${ssl ? 's' : ''}://${host}:${port}`
  }
}

export default Node
