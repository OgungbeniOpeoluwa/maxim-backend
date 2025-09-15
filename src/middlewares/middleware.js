const errorMessage = require("../util/errormessage.util")
const constants = require("../util/constant.util")




const authenticate = (authService) => {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith(constants.Bearer+" ")) {
          return res.status(401).json({ message:errorMessage.ERROR_UNAUTHORIZED});
        }
  
        const token = authHeader.split(" ")[1];
        const decoded = await authService.verifyToken(token); 
        req.user = decoded; 
        next();
      } catch (err) {
        return res.status(401).json({ message: err.message || errorMessage.ERROR_INVALID_TOKEN });
      }
    };
  };
  
module.exports = authenticate;