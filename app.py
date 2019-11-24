import random

from flask import Flask, render_template, request, make_response, jsonify
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from pywallet import wallet
from emojaddress.address import EMOJI_UNICODE

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

import models


def generate_seed_emoji():
    # generates random seed emoji. much secure.
    words = []
    while len(words) < 12:
        emoji = random.choice(EMOJI_UNICODE)
        words.append(emoji)
    return ''.join(words)


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/generate/', methods=['POST'])
def generate_wallet_from_name():
    name = request.json.get('name')
    if name is None:
        return make_response(jsonify({'privateKey': 'No name provided'})), 401

    seed = generate_seed_emoji()

    # generate hierarchical deterministic wallet
    w = wallet.create_wallet(network="ETH", seed=seed)

    nw = models.Wallet(private_key=w.get('private_key'), address=w.get('address'), name=name)
    db.session.add(nw)
    db.session.commit()

    response_object = {
        'privateKey': w.get('seed')
    }

    return make_response(jsonify(response_object)), 201


@app.route('/name/', methods=['GET'])
def get_name_from_emoji():
    if request.args is None:
        return make_response(jsonify({'message': 'No name provided'})), 401

    emoji_unicodes = list(request.args.to_dict().values())

    seed = ''.join([emoji for emoji in emoji_unicodes])

    w = wallet.create_wallet(network="ETH", seed=seed)

    nw = models.Wallet.query.filter_by(address=w.get('address')).first()
    if nw is None:
        return make_response(jsonify({'nameResult': 'No name found for seed'})), 404

    response_object = {
        'nameResult': nw.name
    }

    return make_response(jsonify(response_object)), 200


if __name__ == '__main__':
    app.run()
