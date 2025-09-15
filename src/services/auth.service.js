const {comparePassword} = require("../util/util")
const jwt = require("jsonwebtoken")
const errorMessage = require("../util/errormessage.util")


class AuthService{
    constructor(userService,config){
        this.userService = userService
        this.config = config
    }
    async login(email,password){
        const user = await this.userService.getUserByEmail(email)
        if (!user){
            throw new Error(`${email} ${errorMessage.ERROR_DOESNT_EXISTS}`)
        }

        if(!await comparePassword(user.password,password)){
            throw new Error(errorMessage.ERROR_INVALID_PASSWORD)
        }

       const accessToken =  jwt.sign({id:user.id,email:user.email},this.config.AccessTokenSecret)
       return accessToken;

    }

    async registerUser(createUserDto){
        console.log(createUserDto)
        const user = await this.userService.createUser(createUserDto)
        return user;

    }

    async verifyToken(token){
        try {
            return jwt.verify(token, this.config.AccessTokenSecret);
        } catch (err) {
            console.log(err)
            throw new Error(errorMessage.ERROR_INVALID_TOKEN);
        }
    }
}

module.exports = AuthService