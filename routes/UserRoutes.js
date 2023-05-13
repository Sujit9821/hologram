import Express from "express";
import { verifyUser } from "../utils/verifyUser.js";
import Users from "../models/Users.js";
import genError from "../utils/genError.js";
import multer from "multer";
// import multerS3 from "multer-s3"
// import AWS from "aws-sdk"
// import { AWSKEY, AWSPASSWORD } from "../private.js";
const app = Express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './client/build/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
    }
})

const upload = multer({ storage: storage })


// const s3 = new AWS.S3({
//     accessKeyId: AWSKEY,
//     secretAccessKey: AWSPASSWORD
// });

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'mydbms',
//         contentType: multerS3.AUTO_CONTENT_TYPE,
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString() + '-' + file.originalname)
//         }
//     })
// })

app.get('/User/:email', verifyUser, async (req, res, next) => {
    try {
        let user = await Users.findOne({ email: req.params.email });
        if (!user) return next(genError(400, "No User found!"));
        res.status(200).json(user);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.post('/updateBio', verifyUser, async (req, res, next) => {
    try {
        let data = await Users.findOneAndUpdate({ email: req.user.email }, req.body, { new: true });
        res.status(200).json(data._doc);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})


app.post('/updateProfileImg', verifyUser, upload.single('file'), async (req, res, next) => {
    try {
        let data = await Users.findOneAndUpdate({ email: req.user.email }, { img: `/uploads/${req.file.filename}` }, { new: true });
        res.status(200).json(data._doc);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})


app.post('/updateBGImg', verifyUser, upload.single('file'), async (req, res, next) => {
    try {
        let data = await Users.findOneAndUpdate({ email: req.user.email }, { bg: `/uploads/${req.file.filename}` }, { new: true });
        res.status(200).json(data._doc);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

export default app;