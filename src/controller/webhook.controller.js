const StatusCodes = require('http-status-codes');

class WebhookController{
    constructor(webhookService){
        this.webhookService = webhookService
    }
    async getWebhook(req,res){
        try {
            res.status(StatusCodes.OK).json({
                message: "Webhook processed successfully"
            });
            console.log(req.body)
            const data = this.webhookService.processWebhook({
                ...req.body.data,type:req.body.type
            })
            console.log("Transaction saved:", data);
          } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
        }
    }
}
module.exports = WebhookController