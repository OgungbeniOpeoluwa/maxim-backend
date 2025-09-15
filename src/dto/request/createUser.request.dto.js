class CreateUserDto{
    firstName
    lastName
    email
    password

    constructor(partial) {
        Object.assign(this, partial);
    }
  }
  
module.exports = CreateUserDto