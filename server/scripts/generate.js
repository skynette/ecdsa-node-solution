const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak");

function generateKeys() {
    // public and private key object
    keys = {}

    for (let i = 0; i < 3; i++) {
        const privateKey = toHex(secp.utils.randomPrivateKey());
        const publicKeyHash = toHex(secp.getPublicKey(privateKey));
        const publicKey = secp.getPublicKey(privateKey);
        const address = '0x' + toHex(keccak256(publicKey.slice(1)).slice(-20));
        keys["key" + i] = [privateKey, publicKeyHash, address]
    }
    return keys
}
console.log(generateKeys())
// {
//   key0: [
//     'b28506f0032b47d2179520ec37fea9d29f81e7f00f5d2fcb57cb29db6955eb95',
//     '04fdcd1d4783d82459039d4c7e0ca141e99332f8db97c7e942fa768ceae6d9eaa764336c8434910130ceb86ed104c94a86c875b4fe8053e4cbe2adbc798ce99cb6',
//     '0x68d5bad4b3d146cfc938ac211788b632881c2c1b'
//   ],
//   key1: [
//     '00d88b78c1a797279e8a1fae992b662688dd6f6435f62cb227c0a5dd1e6e651f',
//     '04edeb79ca687975cc744e80d1a41f83402ab76ea40bc94cf4fc413ed08a89a530dbbefc8a49b9f637b53516e070ef10644146030e1f16a0ddedf2fcf6d625bc57',
//     '0x2aa95511dae2e2c7e33b54675ebfc753826aea63'
//   ],
//   key2: [
//     '842ec84b389c232ebacd57f3d4797246d21340e7d80ee490623214184033c8c5',
//     '04f1c06e38838304bfc042ac5710622fc79156c4808a8b954970530f5d1638d205490d200e5388c61f7043f246eba62d9e4d9bacbbac7068015c756dd1fc329be2',
//     '0x06730903c3260550f49cd5e64b02c64ddc7b38b4'
//   ]
// }