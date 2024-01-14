const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
    '0x68d5bad4b3d146cfc938ac211788b632881c2c1b': 100,
    "0x2aa95511dae2e2c7e33b54675ebfc753826aea63": 100,
    "0x06730903c3260550f49cd5e64b02c64ddc7b38b4": 100,
};

app.get("/balance/:address", (req, res) => {
    const { address } = req.params;
    const balance = balances[address] || 0;
    res.send({ balance });
});

app.post("/send", async (req, res) => {
    const { sender, recipient, amount, nonce, signTxn } = req.body;

    setInitialBalance(sender);
    setInitialBalance(recipient);

    // retrieve signature and recovery bit 
    const [signature, recoveryBit] = signTxn;

    // convert signature to Uint8Array
    const formattedSignature = Uint8Array.from(Object.values(signature));

    //message hash
    const msgToBytes = utf8ToBytes(recipient + amount + JSON.stringify(nonce));
    const msgHash = toHex(keccak256(msgToBytes));

    // recover public key
    const publicKey = await secp.recoverPublicKey(msgHash, formattedSignature, recoveryBit);

    // verify transection 
    const verifyTx = secp.verify(formattedSignature, msgHash, publicKey)

    if (!verifyTx) {
        res.status(400).send({ message: "Invalid Transection" });
    }

    if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
    }
    else if (sender == recipient) {
        res.status(400).send({ message: "Please! Enter Another address" })
    }

    else if (recipient && amount) {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
    }
    else {
        res.status(400).send({ message: "Something Went Wrong !!" })
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);

});

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0;
    }
}
