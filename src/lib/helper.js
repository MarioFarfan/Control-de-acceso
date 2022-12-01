const bcrypt = require('bcryptjs');

const helpers = {};

helpers.cifrar = async (contra) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(contra, salt);
    return hash;
};

helpers.comparar = async (contra, contraguardada) => {
    try {
        return await bcrypt.compare(contra, contraguardada);
    } catch (e){
        console.log('Error: ' + e);
    }
};

module.exports = helpers;