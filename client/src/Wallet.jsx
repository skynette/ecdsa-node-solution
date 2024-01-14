import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
    async function onChange(evt) {
        const privateKey = evt.target.value;
        setPrivateKey(privateKey);

        // Generate public key
        const publicKey = secp.getPublicKey(privateKey);

        // Take the last 20 bytes to obtain eth like address
        const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
        setAddress(address)
        
        if (address) {
            const {
                data: { balance },
            } = await server.get(`balance/0x${address}`);
            setBalance(balance);
        } else {
            setBalance(0);
        }
    }

    return (
        <div className="container wallet">
            <h1>Your Wallet</h1>

            <label>
                Private Key
                <input placeholder="Enter the Private key" value={privateKey} onChange={onChange}></input>
            </label>
            <div>
                Address : {address && "0x"}{address}
            </div>
            <div className="balance">Balance: {balance}</div>
        </div>
    );
}

export default Wallet;
