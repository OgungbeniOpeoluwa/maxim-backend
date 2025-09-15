const userRepository = require("../repository/user.repository")
const {hashedPassword,validate} = require("../util/util")
const {createUserSchema,updateUserSchema} = require("../validator/validator_schema");


class UserService{

    async getUserByEmail(email){
        return userRepository.findByEmail(email)
    }


    async createUser(createUserDto){
       const value = validate(createUserSchema,createUserDto)
       console.log(value)

        const existUser = await userRepository.findByEmail(value.email)
        if (existUser){
            throw new Error("Email already exists");
        }
        
       const encryptPassword = await hashedPassword(value.password)


       const user = await userRepository.createUser({
        ...value,
        password: encryptPassword,
      });

       

        return this.mapUser(user);
    }

    async updateUser(updateUserDto){
        const value = validate(updateUserSchema,updateUserDto)
        const existUser = await userRepository.findById(value.id)
        if(!existUser){
            throw new Error("user doesn't exist")

        }
        if (updateUserDto.password) {
            updateUserDto.password = await hashedPassword(value.password);
        }
        const updatedUser = await userRepository.updateUser(value.id, value);
        return this.mapUser(updatedUser);


    }

    async getUserById(id){
        if (!id)throw new Error("id must be provided")
        const user = await userRepository.findById(id)
        if (!user) {
        throw new Error(`User with account number ${accountNumber} not found`);
        }
        return this.mapUser(user)
        
    }

    async getUserByAccountNumber(virtualAccountNumber){
        if (!virtualAccountNumber)throw new Error("virtualAccountNumber must be provided")
        const user = await userRepository.findByVirtualAccount(virtualAccountNumber)
        return user;
        
    }

    async updateUserWithVirtualAccountnumber(virtualAccountNumber,id){
        if (!virtualAccountNumber)throw new Error("virtualAccountNumber must be provided")
            const existUser = await userRepository.findById(id)
            if(!existUser){
                throw new Error("user doesn't exist")

            }
            existUser.virtualAccountNumber = virtualAccountNumber
            const updatedUser = await userRepository.updateUser(existUser.id,existUser);
            return this.mapUser(updatedUser);
        
    }

    mapUser(user) {
        const obj = user.toObject ? user.toObject() : user;
        console.log(obj)
        const { _id, password, __v, ...safeUser } = obj;
    
        return {
        ...safeUser,
        id: _id.toString(), 
        };
    }


   

    

}


    

module.exports = UserService;