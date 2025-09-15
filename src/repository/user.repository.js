const user = require("../models/user")


const createUser = async (userDto)=>{
    console.log(userDto)
    return await user.create({
        ...userDto,
      })
    
}

const updateUser = async (id, updateDto) => {
    return await user.findByIdAndUpdate(
      id,
      { $set: updateDto },  
      { new: true }      
    );
  };


const findById = async (id) =>{
    return user.findById(id)
    
}


const findByEmail = async (email) =>{
    return user.findOne({email})
    
}


const findByVirtualAccount = async (virtualAccountNumber) =>{
    return user.findOne({virtualAccountNumber})
    
}
module.exports = {createUser,updateUser,findById,findByEmail,findByVirtualAccount}