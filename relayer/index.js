require('dotenv').config()
const express = require('express');
const {ethers} = require("ethers");
const cors = require("cors");
const fs = require("fs");
const abi = require('./Abi.json');



const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


async function sendTransaction (data) {
    try {   

        const {from, to, message} = data;
        
        const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);

        const encryptedKey = fs.readFileSync("./.encryptKey.json", "utf8");
        let wallet = await ethers.Wallet.fromEncryptedJson(encryptedKey, process.env.PRIVATE_KEY_PASSWORD);
        console.log(wallet)

        wallet = wallet.connect(provider);

        console.log('wallet con')

        const contract = new ethers.Contract(process.env.CHAT_CONTRACT_ADDRESS, abi, wallet);
        console.log('contract')
        const transaction = await contract.sendMessage(from, to, message);
        console.log('tx done')
        const reciept = await transaction.wait();
        console.log('tx wait')
        console.log(reciept)
        if(reciept.status){
            return {success: true, tx: transaction};
        } 

        else{return {success: false, tx: transaction}}


    } catch (error) {
        console.log(error)
    }
}

const verifyMessage = async (message, signature) => {
    const signer = ethers.verifyMessage(message, signature);
    return signer;
}

app.post('/send-tx', async(req, res) => {
    const data = req.body

    const message = JSON.stringify({
        from: data.from,
        to: data.to,
        message: data.message
    })

    const signer = verifyMessage(message, data.signature);

    console.log(data.signature);

    console.log((await signer).toString())

    if((await signer).toString() === data.from.toString()) {
        console.log('sending..')
        const transaction = await sendTransaction(data);
        console.log('sent')
        console.log(transaction)
        if(transaction) {
            res.send(transaction);
            console.log(transaction, "success")

        }else{
            res.send(transaction)
            console.log(transaction, "error again")
        }
    }else{
        res.send({message: "Invalid signature"})
    }
})

app.get('/', (req, res)=> {
    res.send("welcome home")
})


app.listen(process.env.PORT, ()=> {
    console.log("relayer serving on port:", process.env.PORT);
})