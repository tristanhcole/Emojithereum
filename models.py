import base64
from Crypto.Cipher import AES
from sqlalchemy.ext.hybrid import hybrid_property
from Crypto.Util.Padding import pad, unpad
from Crypto.Cipher import AES
BLOCK_SIZE = 32 # Bytes

from app import db


SECRET_KEY = b'1234567890123456'
cipher = AES.new(SECRET_KEY, AES.MODE_ECB)


class Wallet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), index=True, unique=True)

    address = db.Column(db.String(), index=True, unique=True)
    _encrypted_private_key = db.Column(db.String())

    @hybrid_property
    def private_key(self):
        return self.decrypt_private_key(self._encrypted_private_key)

    @private_key.setter
    def private_key(self, value):
        self.encrypted_private_key = self.encrypt_private_key(value)

    @staticmethod
    def decrypt_private_key(encrypted_private_key):
        return cipher.decrypt(base64.b64decode(encrypted_private_key))

    @staticmethod
    def encrypt_private_key(private_key):
        return base64.b64encode(cipher.encrypt(pad(private_key.encode('UTF-8'), BLOCK_SIZE)))

    def __repr__(self):
        return '<Wallet {}>'.format(self.name)

    def __init__(self, private_key, address, name):
        self.encrypted_private_key = self.encrypt_private_key(private_key)
        self.address = address
        self.name = name
