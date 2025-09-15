const updateUserDto = require("../dto/request/updateUserDto");
const StatusCodes = require('http-status-codes');

class UserController{
    constructor(userService,safeHavenService){
        this.userService = userService
        this.safeHavenService = safeHavenService
    }

    async getUserProfile(req,res){
        try {
            const id = req.user.id
            const user = await this.userService.getUserById(id);
            res.status(StatusCodes.OK).json(user);
          } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
        }
    }
    async updateUser(req,res){
        try {
            const id = req.user.id
            const data = new updateUserDto({
                ...req.body,
                id
            })
            const user = await this.userService.updateUser(data);
            res.status(StatusCodes.OK).json(user);
          } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
        }
    }
    
}
module.exports = UserController