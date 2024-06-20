const bcrypt = require('bcrypt');

hashPassword = (password)=>{
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
        if(err){
            console.error('Error hashing password:', error);
            throw new Error('Error hashing password');
        }
        else{
            return hashedPassword;
        }
    });
}

module.exports = hashPassword;

