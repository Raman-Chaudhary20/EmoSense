const ImageKit = require("@imagekit/nodejs");

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function uploadFile({buffer, fileName, folder= ""}){
    const file = await client.files.upload({
        file: await ImageKit.toFile(Buffer.from(buffer)),
        fileName: fileName,
        folder
    })

    return file
}

module.exports = {uploadFile};