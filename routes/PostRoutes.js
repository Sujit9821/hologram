import Express from "express";
import multer from "multer";
import timeago from "timeago.js"
import { verifyUser } from "../utils/verifyUser.js";
import Posts from "../models/Posts.js";
import Users from "../models/Users.js";
import fetch from "node-fetch";
import genError from "../utils/genError.js";

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
const app = Express();

app.post('/feedPost', verifyUser, upload.single('file'), async (req, res, next) => {
    let tags = req.body.tags.split('/');
    let user = await Users.findById(req.user._id);
    let location = [];
    if (req.body.defaultLocation) {
        location = [
            user.country,
            user.city,
            user.pincode,
            user.state,
            "World"
        ]
        if (user.area !== '') location.push(user.area);
    }
    else location = (req.body.location).split(',');
    let newPost = {
        "email": req.user.email,
        "photo": req.file.filename,
        "text": req.body.text,
        "tags": tags,
        "location": location
    }
    try {
        newPost = new Posts(newPost);
        newPost = await newPost.save();
        res.status(200).json(newPost);
    }
    catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.get('/allPost', verifyUser, async (req, res, next) => {
    try {
        let posts = await Posts.aggregate([
            {
                $match: {
                    "tags": {
                        $elemMatch: {
                            $eq: req.query.tag || '',
                        }
                    },
                    "location": {
                        $elemMatch: {
                            $eq: req.query.location || 'World',
                        }
                    }
                }
            },
            {
                $sort: {
                    createdAt: -1,
                }
            }
        ])
        posts = await Promise.all(posts.map(async post => {
            let user = await Users.findOne({ email: post.email });
            return {
                ...post,
                "photo": `/uploads/${post.photo}`,
                "createdAt": timeago.format(post.createdAt),
                "userprofile": user.img,
                "username": user.username
            }
        }))
        res.status(200).json(posts);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})


app.get('/posts/:email', verifyUser, async (req, res, next) => {
    try {
        let user = await Users.findOne({ email: req.params.email });
        if (!user) return next(genError(404, "No User Found!!"));
        let posts = await Posts.aggregate([
            {
                '$match': {
                    'email': req.params.email
                }
            }, {
                '$sort': {
                    'createdAt': -1
                }
            }
        ])
        posts = posts.map( post => {
            return {
                ...post,
                "photo": `/uploads/${post.photo}`,
                "createdAt": timeago.format(post.createdAt),
                "userprofile": user.img,
                "username": user.username
            }
        })
        res.status(200).json(posts);
    } catch (err) {
        next(genError(500, "Server Error!!"));
    }
})

app.post('/fetchApis', (req, res, next) => {
    fetch(req.body.url).then(response => response.json()).then(data => {
        res.status(200).json(data)
    }).catch(error => {
        next(genError(500, "Server Error!!"))
    });
})

export default app;