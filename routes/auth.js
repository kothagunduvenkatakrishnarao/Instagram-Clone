const express = require('express')
const router=express.Router()
const mongoose = require('mongoose')
const User=mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}= require('../config/keys')


router.post('/signup',(req,res)=>{
    const {name,email,password,pic} =req.body
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
    {
        return res.status(422).json({error:"please enter valid email!"})
    }
    if(!email || !password || !name)
    {
       return res.status(422).json({error:"please add all the fields!"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user=new User({
                email,
                password:hashedpassword,
                name,
                pic
            })
            user.save()
            .then(user=>{
                res.json({message:"saved succesfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
    }).catch(err=>{
        console.log(err)
    })
})



router.post('/signin',(req,res)=>{
    const {email, password} =req.body
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)))
    {
        return res.status(422).json({error:"please enter valid email!"})
    }
    if(!email || !password)
    {
        return res.status(422).json({error:"please provide all fields!"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser)
        {
            return res.status(422).json({error:"invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in!"})
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic,about,saved} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic,about,saved}})
            }
            else return res.status(422).json({error:"invalid email or password"})
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


module.exports=router