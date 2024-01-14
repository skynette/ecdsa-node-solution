import { useState } from "react";
import server from "./server";

// import ethereum library 
import * as secp from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak"

function Transfer({ address, setBalance, privateKey, setTransaction }) {
    const [sendAmount, setSendAmount] = useState("");
    const [recipient, setRecipient] = useState("");
    const [nonce, setNone] = useState(0);
    const [error, setError] = useState("");

    // for validate ethereum address
    const isValidAddress = (address) => /^0x[0-9a-fA-F]{40}$/.test(address);

    const setValue = (setter) => (evt) => setter(evt.target.value);

    async function transfer(evt) {
        evt.preventDefault();

        // Validate Ethereum address
        if (!isValidAddress(recipient)) {
            setError("Invalid address");
            return;
        }

        // Clear previous error
        setError("");

        // generate message hash
        const msgHash = keccak256(utf8ToBytes(recipient + sendAmount + JSON.stringify(nonce)))

        // sign message (transection)
        const signTxn = await secp.sign(msgHash, privateKey, { recovered: true });

        try {
            const {
                data: { balance },
            } = await server.post(`send`, {
                sender: `0x${address}`,
                amount: parseInt(sendAmount),
                recipient,
                nonce,
                signTxn
            });
            const dataTxn = {
                time: new Date().toLocaleString(),
                amount: parseInt(sendAmount),
                sender: `0x${address}`,
                recipient,
                nonce: parseInt(nonce)
            }

            // transaction 
            setTransaction(transaction => [...transaction, dataTxn]);
            setBalance(balance);
            setNone((preNonce) => preNonce + 1)
        } catch (ex) {
            alert(ex.response.data.message);
        }

    }

    return (
        <form className="container transfer" onSubmit={transfer}>
            <h1>Send Transaction</h1>

            <label>
                Send Amount
                <input
                    placeholder="1, 2, 3..."
                    value={sendAmount}
                    onChange={setValue(setSendAmount)}
                ></input>
            </label>

            <label>
                Recipient
                <input
                    placeholder="Type an address"
                    value={recipient}
                    onChange={setValue(setRecipient)}
                ></input>
            </label>

            {/* Display error message */}
            {error && <div style={{ color: "red" }}>{error}</div>}

            <input type="submit" className="button" value="Transfer" />
        </form>
    );
}

export default Transfer;
