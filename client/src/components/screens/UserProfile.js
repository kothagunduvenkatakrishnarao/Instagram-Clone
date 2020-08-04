import React,{useEffect, useState,useContext} from 'react';
import {UserContext} from '../../App';
import {useParams} from 'react-router-dom'

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
        {profile === null ? <h2 className="loading">Loading</h2> : 
        <div style={{maxWidth:"1100px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style={{ width:"160px",height:"160px",borderRadius:"80px"}}
                    src={profile.user.pic}/>
                </div>
                <div>
                    <h4>{profile.user.name}</h4>
                    <h4>{profile.user.email}</h4>
                    <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                        <h6>{profile.posts.length} posts</h6>
                        <h6>{profile.user.followers.length} followers</h6>
                        <h6>{profile.user.following.length} following</h6>
                    </div>
                    {isfollow ?
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1 "
                    onClick={()=>unfollowUser()}>
                        unfollow
                    </button>
                    :
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser()}>
                        Follow
                    </button>
                    }
                </div>
            </div>
            <div className="gallery">
                {
                    profile.posts.map(
                        item=>{
                            return  <img key = {item._id} className="item" src={item.photo} alt={item.title}/>
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