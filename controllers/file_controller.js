const {
    uploadFile,
    getFileUrl
} = require('../helpers/file_functions')


const uploadFileFunc = async (req, res) => {
    try {
        const { file } = req.payload
        const resp = await uploadFile(file, '/test')
        return {
            success: true,
            data: resp
        }
    } catch (err) {
        console.error(err);
        return h.response({
            success: false,
            message: err.message
        }).code(200);
    }
}


const getFile = async (req, res) => {
    try {
        const { path } = req.payload
        return {
            success: true,
            data: {
                ...await getFileUrl(path, 3600)
            }
        }
    } catch (err) {
        console.error(err);
        return h.response({
            success: false,
            message: err.message
        }).code(200);
    }
}


module.exports = {
    uploadFileFunc,
    getFile
}