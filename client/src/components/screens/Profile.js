import React,{useEffect, useState,useContext} from 'react';
import {UserContext} from '../../App'
import Loading from './Loading'
import NoPostsFound from './NoPosts'

const Profile = () => {

    const [mypics,setPics] = useState(undefined)
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        })
    },[])
    


    
    return ( 
        <>
        {state === null ? <Loading /> :
        <div style={{maxWidth:"1100px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div style={{ paddingBottom:"10px" }}>
                    <img className="d-none d-sm-block" style={{ width:"240px",height:"240px",borderRadius:"120px"}} src={state.pic}/>
                    <img className="d-block d-sm-none" style={{ width:"100px",height:"100px",borderRadius:"50px"}} src={state.pic}/>
                </div>
                <div>
                    <h4 style={{textAlign:"center",marginBottom:"20px"}}>{state.name}</h4>
                    <div>
                        <div className="row">
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>{mypics === undefined ? "0" : mypics.length}</h6>
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>{state.followers.length}</h6>
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>{state.following.length}</h6>
                        </div>
                        <div className="row">
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>Posts</h6>
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>followers</h6>
                            <h6 className="col-3 col-md-4" style={{textAlign:"center"}}>following</h6>
                        </div>
                        <div className="badge badge-pill badge-primary d-none d-sm-block">
                        { state && state.about.split("\n").map((item)=>
                            <li key="item">{item}</li>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            { mypics===undefined ? <Loading/>: mypics.length===0 ?  <NoPostsFound
                    data="No posts to show. Create some posts."/>  :
                <div className="gallery">
                    {
                        mypics.map(
                            item=>{
                                return (
                                    <>
                                    <img key = {item._id} className="item col-10 d-sm-none" src={item.photo} alt={item.title}/>
                                    <img key = {item._id} className="item d-none d-sm-block d-md-block d-lg-block d-xl-block" src={item.photo} alt={item.title}/></>
                                );
                            }
                        )
                    }
                </div>
            }
        </div>
        }
        </>
     );
}
 
export default Profile;