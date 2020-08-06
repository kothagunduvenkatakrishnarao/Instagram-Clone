const express = require('express')
const router=express.Router()
const mongoose = require('mongoose')
const Post=mongoose.model('Post')
const requiredLogin = require('../middleware/requiredLogin')
const cloudinary = require('cloudinary');
const {cloud_name,api_key,api_secret}= require('../config/keys')


cloudinary.config({ 
    cloud_name: cloud_name, 
    api_key: api_key, 
    api_secret: api_secret 
});


router.get('/allposts',requiredLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/subpost',requiredLogin,(req,res)=>{
    // if postedBy in following
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})

router.post('/createpost',requiredLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body || !pic)
    {
        return res.status(422).json({error:"please add all fields!"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/mypost',requiredLogin,(req,res)=>{
    Post.find({ postedBy: req.user._id})
    .populate("postedBy","_id name")
    .sort('-createdAt')
    .then(mypost=>{
        res.json({mypost})
    }).catch(err=>{
        console.log(err)
    })
})

router.put('/like',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $addToSet:{likes:req.user._id}
    },{
        new:true
    }).populate("postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/unlike',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).populate("postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.put('/comment',requiredLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    }).populate("comments.postedBy","_id name pic")
    .populate("postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requiredLogin,(req,res)=>{
    cloudinary.v2.uploader.destroy(req.body.publicId).then(
        Post.findOne({_id:req.params.postId})
        .populate("postedBy","_id")
        .exec((err,post)=>{
            if(err||!post)
            {
                return res.status(422).json({error:err})
            }
            if(post.postedBy._id.toString() === req.user._id.toString())
            {
                post.remove()
                .then(result=>{
                    res.json(result)
                }).catch(err=>{
                    console.log(err)
                })
            }
        })
    )
})

router.put('/deletecomment',requiredLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{comments:{_id:req.body.commentId}}
    },{
        new:true
    }).populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            res.json(result)
        }
    })

})

router.get('/showsavedposts',requiredLogin,(req,res)=>{
    Post.find({_id:{$in: req.user.saved}})
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name pic")
    .then(posts=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})

module.exports = router