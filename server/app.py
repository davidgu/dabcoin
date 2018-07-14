import requests
import hashlib
import json
import base64
import pickle

from time import time
from uuid import uuid4
from flask import Flask, jsonify
from flask import request
from textwrap import dedent
from urllib.parse import urlparse
from ecdsa import VerifyingKey, SECP256k1
from flask_cors import CORS, cross_origin

class Blockchain(object):
    def __init__(self):
        self.chain = []
        self.current_transactions = []
        self.nodes = set()

        self.new_block(previous_hash=1, proof=100)
    
    def new_block(self, previous_hash, proof):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time(),
            'transactions': self.current_transactions,
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1]),
        }
        # Reset list of transactions
        self.current_transactions = []
        self.chain.append(block)
        return block

    def new_transaction(self, sender, recipient, amount):
        self.current_transactions.append({
            'sender': sender,
            'recipient': recipient,
            'amount': amount,
        })

        return self.last_block['index'] + 1

    @staticmethod
    def hash(block):
        """
        Hashes block and verifies if it is a valid dab
        """
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    @property
    def last_block(self):
        # Returns the last block in chain
        return self.chain[-1]

    def proof_of_work(self, last_proof):
        proof = 0
        while self.valid_proof(last_proof, proof) is False:
            proof += 1
        return proof

    @staticmethod
    def valid_proof(last_proof, proof):
        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"

    def register_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)

    def valid_chain(self, chain):
        last_block = chain[0]
        current_index = 1

        while current_index < len(chain):
            block = chain[current_index]
            if block['previous_hash'] != self.hash(last_block):
                return False
            if not self.valid_proof(last_block['proof'], block['proof']):
                return False
            last_block = block
            current_index += 1
        return True
    
    def resolve_conflicts(self):
        neighbors = self.nodes
        new_chain = None
        # Look for chains longer than ours from neighbors 
        max_length = len(self.chain)

        for node in neighbors:
            response = requests.get(f'http://{node}/chain')

            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']

                # If length is longer and new chain is valid, use it
                if length > max_length and self.valid_chain(chain):
                    max_length = length
                    new_chain = chain
        
        if new_chain:
            self.chain = new_chain
            return True

        return False

app = Flask(__name__)
node_identifier = str(uuid4()).replace('-', '')
blockchain = Blockchain()
CORS(app)
mlURL = 'http://178.128.239.183:5000/is_dab'

@app.route('/mine', methods=['POST'])
def mine():
    values = request.get_json()
    required = ['address']
    if not all(k in values for k in required):
        return 'Missing values', 404

    req = requests.post(mlURL, json=values['dab_data'])
    print(req.text)
    if req.text == '[[1.]]':
        print(values['dab_data'])
        last_block = blockchain.last_block
        last_proof = last_block['proof']
        proof = blockchain.proof_of_work(last_proof)

        # Reward miner
        blockchain.new_transaction(
            sender='0',
            recipient=values['address'],
            amount=1,
        )

        previous_hash = blockchain.hash(last_block)
        block = blockchain.new_block(proof, previous_hash)

        response = {
            'message': 'New block created',
            'index': block['index'],
            'transactions': block['transactions'],
            'proof': block['proof'],
            'previous_hash': block['previous_hash'],
        }
    else:
        response = {
            'message': 'That was not a dab!',
        }

    return jsonify(response), 200

@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    values = request.get_json()

    # Check if required fields are in the response
    # Sender: address of sender, hashed public_key
    # Signature is timestamp signed by private_key
    # required = ['sender', 'public_key','timestamp', 'signature', 'recipient', 'amount']
    required = ['sender', 'recipient', 'amount']
    if not all(k in values for k in required):
        return 'Missing values', 404

    if True:
        index = blockchain.new_transaction(values['sender'], values['recipient'], values['amount'])
        response = {'message': f'Transaction will be added to block {index}'}
    else:
        response = {'message': 'Transaction failed! Signature incorrect!'}
    return jsonify(response), 201

def verify_signature(public_key, data, signature):
    vk = VerifyingKey.from_string(bytes.fromhex(public_key), curve=SECP256k1)
    if vk.verify(bytes.fromhex(signature), bytes.fromhex(data)):
        print("Verified")
    else:
        print("Failed")


@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'chain': blockchain.chain,
        'length': len(blockchain.chain),
    }
    return jsonify(response), 200

@app.route('/nodes/register', methods=['POST'])
def register_nodes():
    values = request.get_json()
    nodes = values.get('nodes')

    if nodes is None:
        return 'Error, node list invalid', 400

    for node in nodes:
        blockchain.register_node(node)

    response = {
        'message': 'New nodes added',
        'total_nodes': list(blockchain.nodes),
    }
    return jsonify(response), 201

@app.route('/nodes/resolve', methods=['GET'])
def consensus():
    replaced = blockchain.resolve_conflicts()
    if replaced:
        response = {
            'message': 'Current chain replaced',
            'new_chain': blockchain.chain,
        }
    else:
        response = {
            'message': 'Chain authoritative',
            'chain': blockchain.chain
        }
    return jsonify(response), 200

@app.route('/balance/<string:address>', methods=['GET'])
def get_balance(address):
    bal = 0

    for block in blockchain.chain:
        transactions = block['transactions']
        for transaction in transactions:
            if transaction['sender'] == address:
                bal -= float(transaction['amount'])
            if transaction['recipient'] == address:
                bal += float(transaction['amount'])

    return str(bal)

def save_blockchain():
    with open('blockchain.pickle', 'wb') as fp:
        fp.write(pickle.dumps(blockchain))

def load_blockchain():
    with open('blockchain.pickle', 'rb') as fp:
        blockchain = pickle.loads(fp.read())
                