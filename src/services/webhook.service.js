const transactionRepository = require("../repository/transaction.repository");

class Webhook{
    constructor(userService){
        this.userService = userService
    }

    async processWebhook(webhookData){
        const user = await this.userService.getUserByAccountNumber(webhookData.virtualAccount);
        if (!user) {
            throw new Error(`User with account number ${accountNumber} not found`);
        }
        const transaction = await transactionRepository.createTransaction({
            ...webhookData,
            type: webhookData.type,
            user:user
        })
        return transaction;


    }
}

module.exports=Webhook