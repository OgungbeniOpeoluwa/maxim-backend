const StatusCodes = require('http-status-codes');

class BankingController{
    constructor(safeHavenService){
        this.safeHavenService = safeHavenService
    }
    async createVirtualAccount(req,res){
        try {
            const id = req.user.id
            const accountNumber = await this.safeHavenService.createVirtualAccount(id)
            res.status(StatusCodes.OK).json({
                message:"Virtual account created successfully",
                virtualAccountNumber:accountNumber
            });
          } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
        }
    }
}
module.exports = BankingController