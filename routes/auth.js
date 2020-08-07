const express = require('express')
const router=express.Router()
const mongoose = require('mongoose')
const User=mongoose.model('User')
const bcrypt = require('bcryptjs')
const jwt=require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer= require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const Verifier = require('email-verifier')

const {JWT_SECRET,API_KEY_MAILER,API_KEY_MAILCHECK,SEND_MAIL,SEND_REDIRECTION}= require('../config/keys')


let verifier = new Verifier(API_KEY_MAILCHECK);
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:API_KEY_MAILER
    }
}))


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
    verifier.verify(email, (err, result) => {
        if (err)
        {
            return res.status(422).json({error:err})
        }
        else if(result.smtpCheck ==='false')
        {
            return res.status(422).json({error:"This email doesn't exists!...."});
        }
        User.findOne({email:email})
        .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists"})
        }
        crypto.randomBytes(64,(err,buffer)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            const token=buffer.toString("hex");
            bcrypt.hash(password,12)
            .then(hashedpassword=>{
            const user=new User({
                email,
                password:hashedpassword,
                name,
                pic,
                isVerified:token,
                isVerifiedExpire: Date.now()+1800000
            })
            user.save()
            .then(user=>{
                console.log(user)
                transporter.sendMail({
                    to:user.email,
                    from:SEND_MAIL,
                    subject:"email verification",
                    html:`
                    <p>Verify Your Insta-clone Account</p>
                    <h5><a href="${SEND_REDIRECTION}/verification/${token}">click here</a> to verify your Account</h5>
                    <h5>The link will only work for 1/2hr</h5>
                    `
                },(err,result)=>{
                    if(err){console.log(err);
                        return ;
                    }
                    else{console.log(result)}
                })
                    res.json({message:"Verification mail has set to your mail!..."})
                })
                .catch(err=>{
                    console.log(err)
                })
            })
        }
    })
    }).catch(err=>{
        console.log(err)
    })
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
        else if(savedUser.isVerified!==undefined)
        {
            return res.status(422).json({error:"Please Verify Your Account Before Login!..."})
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

router.post('/resetpass',(req,res)=>{
    crypto.randomBytes(64,(err,buffer)=>{
        if(err)
        {
            console.log(err)
        }
        else
        {
            const token = buffer.toString("hex")
            User.findOne({email:req.body.email})
            .then(user=>{
                if(!user)
                {
                    return res.status(422).json({error:"User doesn't exists"})
                }
                user.resetToken  = token;
                user.expireToken = Date.now() + 1800000;
                user.save().then((result)=>{
                    transporter.sendMail({
                        to:user.email,
                        from:SEND_MAIL,
                        subject:"Reset Password",
                        html:`
                        <p>You are requested to reset password</p>
                        <h5><a href="${SEND_REDIRECTION}/reset/${token}">click here</a> to reset</h5>
                        `
                    })
                    res.json({message:"check your email to reset password"})
                })
            })
        }
    })
})

router.post('/newpassword',(req,res)=>{
    const {password1,token}=req.body
    User.findOne({resetToken:token,expireToken:{$gt:Date.now()}})
    .then((user)=>{
        if(!user)
        {
            return res.status(422).json({error:"Try again session has expired!.."})
        }
        bcrypt.hash(password1,12).then(hashedpassword=>{
            user.password = hashedpassword,
            user.resetToken = undefined,
            user.expireToken = undefined
            user.save()
            .then((record)=>{
                res.json({message:"password updated successfully!...."})
            })
        })
    }).catch((err)=>{
        console.log(err);
    })
})

router.put('/verifymyaccount',(req,res)=>{
    const {token}=req.body
    console.log(token)
    User.findOne({isVerified:token,isVerifiedExpire:{$gt:Date.now()}})
    .then((user)=>{
        if(!user)
        {
            return res.status(422).json({error:"Try again session has expired!.."})
        }
        user.isVerified = undefined,
        user.isVerifiedExpire = undefined
        user.save()
        .then((record)=>{
            res.json({message:"Verification success!.."})
        })
    }).catch((err)=>{
        console.log(err);
    })
})



router.post('/resendverification',(req,res)=>{
    crypto.randomBytes(64,(err,buffer)=>{
        if(err)
        {
            console.log(err)
            return ;
        }
        else{
            const token  = buffer.toString("hex");
            User.findOne({email:req.body.email})
            .then(user=>{
                if(!user)
                {
                    return res.status(422).json({error:"No user found!..."})
                }
                else if(user.isVerifiedExpire===undefined)
                {
                    return res.status(422).json({message:"User is already Verified!..."})
                }
                else{
                    user.isVerified=token,
                    user.isVerifiedExpire=Date.now()+1800000
                    user.save()
                    .then(user=>{
                        transporter.sendMail({
                            to:user.email,
                            from:SEND_MAIL,
                            suject:"Verification mail",
                            html:`
                            <p>Verify Your Insta-clone Account</p>
                            <h5><a href="${SEND_REDIRECTION}/verification/${token}">click here</a> to verify your Account</h5>
                            <h5>The link will only work for 1/2hr</h5>
                            `
                        },(err,result)=>{
                            if(err)
                            {
                                console.log(err);
                                return ;
                            }
                            else{
                                console.log(result);
                            }
                        })
                        res.json({message:"Verification mail has set to your mail!..."})
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }
    })
    
})

module.exports=router