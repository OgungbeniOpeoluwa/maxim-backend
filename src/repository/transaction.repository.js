const transaction = require("../models/Transaction")


const createTransaction = async (transactionDto)=>{
    console.log(transactionDto)
    return await transaction.create({
        ...transactionDto,
      })
    
}

module.exports = {createTransaction}