const aws = require('aws-sdk')
const multer = require("multer")
const multerS3 = require("multer-s3")

const s3 = new aws.S3()
aws.config.update({region: 'us-west-1'})

const fileFilter = (req, file, cb) => {
    if (file.mimetype.includes("image/")) {
        cb(null, true)
    } else {
        cb(new Error("Invalid file type, only images allowed"), false)
    }
}

const uploader = multer({
    fileFilter,
    storage: multerS3({
        acl: "public-read",
        s3,
        bucket: 'myhowm.com-recipe-img',
        metadata: function(req, file, cb) {
            cb(null, {fieldName: file.fieldname})
        },
        key: function(req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

module.exports = uploader
