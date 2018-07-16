# DabCoin

Proof-of-dab based cryptocurrency. It's like proof of work, but you can only mine blocks if the data from your device accelerometer indicates that you are dabbing. Contains both blockchain technology and artificial intelligence, as well as other associated buzzwords. A collaboration with [Marcel O'Neil](https://github.com/marceloneil) and [Curtis Chong](https://github.com/curtischong). Marcel wrote the React based front end and web wallet, Curtis wrote the dab-or-not-dab classifier, and I wrote the cryptocurrency network nodes and the API for clients to interact with the network. Written in 7 hours for [TerribleHack XI](terriblehack.website). 

## Getting it Running
### Front End
### DabCoin Node
1. Set up a virtualenv
2. Install the dependencies specified in `server/requirements.txt`
3. Edit the variable named `mlURL` in `server/app.py` to specify the URL of the classifier server
4. Run the DabCoin node by executing `flask run` in the `server/` directory
### Classifier
1. Instructions for setting up the classifer can be found in [its repository](https://github.com/curtischong/dab_database)
