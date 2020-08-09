import React,{useEffect, useState,useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom'
import Loading from './Loading'
import NoPostsFound from './NoPosts';

const UserProfile = () => {

    const [profile,userProfile] = useState(null)
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [isfollow,setfollow] = useState(false)
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            userProfile(result)
        })
    },[])

    useEffect(()=>{
        const check = JSON.parse(localStorage.getItem("user"));
        var crosscheck;
        if (check.following.includes(userid)) {
            crosscheck = true;
        } else {
            crosscheck = false;
        }
        setfollow(crosscheck)
    })

    const followUser = ()=>{

        fetch("/follow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            userProfile((previouState)=>{
                return {
                    ...previouState,
                    user:{...previouState.user,
                        followers:[...previouState.user.followers,data._id]
                    }
                }
            })
        })
        setfollow(true)

    }

    const unfollowUser = ()=>{
        fetch("/unfollow",{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            userProfile((previouState)=>{
                const follower =  previouState.user.followers.filter(item=> item!==data._id)
                return {
                    ...previouState,
                    user:{...previouState.user,
                        followers:follower
                    }
                }
            })
        })
        setfollow(false)

    }

    return ( 
    <>
        {profile === null ? <Loading/> : profile.user===undefined ? <NoPostsFound data="No account found"/>:
        <div style={{maxWidth:"1100px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div style={{ paddingBottom:"10px",paddingTop:"40px"}}>
                    <img className="d-none d-sm-block" style={{ width:"240px",height:"240px",borderRadius:"120px"}} src={profile.user.pic}/>
                    <img className="d-block d-sm-none" style={{ width:"100px",height:"100px",borderRadius:"50px"}} src={profile.user.pic}/>
                </div>
                <div>
                    <h4 style={{textAlign:"center",marginBottom:"20px"}}>{profile.user.name}</h4>
                    <h6 style={{textAlign:"center",marginBottom:"20px"}}>{profile.user.email}</h6>
                    <div>
                        <div className="row">
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>{profile.posts.length}</h6>
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>{profile.user.followers.length}</h6>
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>{profile.user.following.length}</h6>
                        </div>
                        <div className="row">
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>Posts</h6>
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>followers</h6>
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>following</h6>
                        </div>
                        {isfollow ?
                            <button className="btn btn-danger col-11" style={{marginBottom:"10px"}}
                            onClick={()=>unfollowUser()}>
                                unfollow
                            </button>
                            :
                            <button className="btn waves-effect waves-light #64b5f6 blue darken-1 col-11" style={{marginBottom:"10px"}}
                            onClick={()=>followUser()}>
                                Follow
                            </button>
                        }
                        <div className="badge badge-pill badge-primary d-none d-sm-block col-sm-11">
                        { profile.user.about.split("\n").map((item)=>
                            <li key="item">{item}</li>
                        )}
                        </div>
                    
                    
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                        profile.posts.length === 0 ?
                            <NoPostsFound data="No posts to show"/>
                            :
                            profile.posts.map(
                                item=>{
                                    return  (
                                        <>
                                        <img key = {item._id} className="item col-10 d-sm-none" src={item.photo} alt={item.title}/>
                                        <img key = {item._id} className="item d-none d-sm-block d-md-block d-lg-block d-xl-block" src={item.photo} alt={item.title}/></>
                                    );
                                }
                            )
                }
            </div>
        </div>
        }
    </>
     );
}
 
export default UserProfile;