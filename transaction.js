require('dotenv').config()
const {Web3}= require('web3')

const apikey= process.env['apikey']
const node = `https://go.getblock.io/${apikey}/`
const web3= new Web3(node)

const accountTo='0xA1880877FCE7F26a8fE064d4CC51a26113e03c0F'

const privatekey=process.env['privatekey']
// Convert the private key to an account
const accountFrom=web3.eth.accounts.privateKeyToAccount(privatekey)

const createSignedTx=async(rawTx)=>{
    rawTx.from = accountFrom.address;
    rawTx.gas=await web3.eth.estimateGas(rawTx)
    rawTx.gasPrice = await web3.eth.getGasPrice()
    return await accountFrom.signTransaction(rawTx)
}

const sendSignedTx=async(signedTx)=>{
    web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(console.log)
}

const amountTo="0.01"
const rawTx={
    to:accountTo,
    value:web3.utils.toWei(amountTo,'ether')
}

createSignedTx(rawTx)
    .then(sendSignedTx)
    .catch(error => {
        console.error('Error:', error);
        // Handle the error appropriately
    });