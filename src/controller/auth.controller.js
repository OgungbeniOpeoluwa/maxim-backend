const StatusCodes = require('http-status-codes');


class AuthController{
    constructor(authService){
        this.authService = authService
    }

    async registerUser(req,res){
        try {
            const user = await this.authService.registerUser(req.body);
            res.status(StatusCodes.CREATED).json({
                message: "User registered successfully",
                userId: user.id
              }
              );
          } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
        }
    }
    async login(req,res){
        try {
            const {email,password} = req.body
            const accessToken = await this.authService.login(email,password);
            res.status(StatusCodes.OK).json({
                message: "Login successful",
                token: accessToken
              }
              );
          } catch (err) {
            res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
        }
    }
}

module.exports = AuthController