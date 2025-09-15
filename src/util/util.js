const bcrypt = require("bcrypt");


// function isValidEmail(email){
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
// }

async function hashedPassword(password){
   const value = await bcrypt.hash(password, 10)
   console.log(value)
 return value;
}

async function comparePassword(oldPassword,newPassword){
    const value = await bcrypt.compare(newPassword,oldPassword);
    return value;
}

function validate(schema, dto) {
    const { error, value } = schema.validate(dto, { abortEarly: false });
    if (error) {
      throw new Error(error.details.map(d => d.message).join(", "));
    }
    return value;
  }
  



module.exports = {hashedPassword,comparePassword,validate}