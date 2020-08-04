const express = require('express')
const router=express.Router()
const mongoose = require('mongoose')
const Post=mongoose.model('Post')
const requiredLogin = require('../middleware/requiredLogin')
const User=mongoose.model("User")
const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary');
const {cloud_name,api_key,api_secret}= require('../config/keys')


cloudinary.config({ 
    cloud_name: cloud_name, 
    api_key: api_key, 
    api_secret: api_secret 
});


router.get('/user/:id',requiredLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .populate("")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            else
            {
                res.json({user,posts})
            }
        })
    })
    .catch(err=>{
        return res.status(422).json({error:"User not found"})
    })
})


router.put('/follow',requiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $addToSet:{"followers":req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $addToSet:{"following":req.body.followId}
        },{new:true},
        (err,result)=>{
            if(err)
            {
                return res.status(422).json({error:err})
            }
        }).select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})


router.put('/unfollow',requiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{"followers":req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{"following":req.body.unfollowId}
        },{new:true},
        (err,result)=>{
            if(err)
            {
                return res.status(422).json({error:err})
            }
        }).select("-password")
        .then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/editpic',requiredLogin,(req,res)=>{
    cloudinary.v2.uploader.destroy(req.body.publicId).then
    (
        User.findByIdAndUpdate(req.user._id,{
            $set:{pic:req.body.pic}
        },{
            new:true,
        },
        (err,result)=>{
            if(err)
            {
                return res.status(422).json({error:"Pic cannot be updated"})
            }
            res.json(result)
        })
    )
})

router.put('/editname',requiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{name:req.body.name},
    },{
        new:true,
    },
    (err,result)=>{
        if(err)
        {
            return res.status(422).json({error:"name cannot changed"})
        }
        res.json(result)
    })
})

router.put('/removepic',requiredLogin,(req,res)=>{
    cloudinary.v2.uploader.destroy(req.body.publicId).then
    (
        User.findByIdAndUpdate(req.user._id,{
            $unset:{pic:""}
        },{new:true},
        (err,result)=>{
            if(err)
            {
                return res.status(422).json({error:"name cannot changed"})
            }
            res.json(result)
        })
    )
})

router.put('/about',requiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set:{about:req.body.about}
    },{new:true},(err,result)=>{
        if(err)
        {
            return res.status(422).json({error:"error cannot update"})
        }
        res.json(result)
    })
})

router.put('/save',requiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $addToSet:{"saved":req.body.item}
    },{new:true},(err,result)=>{
        if(err)
        {
            return res.status(422).json({error:"unable to save post"})
        }
    }).select("-password")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})

router.put('/unsave',requiredLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $pull:{"saved":req.body.item}
    },{new:true},(err,result)=>{
        if(err)
        {
            return res.status(422).json({error:"unable to save post"})
        }
    }).select("-password")
    .then(result=>{
        res.json(result)
    }).catch(err=>{
        return res.status(422).json({error:err})
    })
})

module.exports = router