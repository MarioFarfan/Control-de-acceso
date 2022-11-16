const bycript = require('bcryptjs');

const helpers = {};

helpers.cifrar = async (contra) => {
    const salt = await bycript.genSalt(10);
    const hash = await bycript.hash(contra, salt);
    return hash;
};

helpers.comparar = async (contra, contraguardada) => {
    try {
        await bycript.compare(contra, contraguardada);
    } catch (e){
        console.log(e);
    }
};

module.exports = helpers;