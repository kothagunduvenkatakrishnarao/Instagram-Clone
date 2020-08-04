import React,{useEffect, useState,useContext} from 'react';
import {UserContext} from '../../App'

const Profile = () => {

    const [mypics,setPics] = useState(undefined)
    const {state,dispatch} = useContext(UserContext)
    var data;
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
        {state === null ? <div><h2>Loading</h2></div> :
        <div style={{maxWidth:"1100px",margin:"0px auto"}}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div style={{ paddingBottom:"10px" }}>
                    <img className="d-none d-md-block" style={{ width:"240px",height:"240px",borderRadius:"120px"}} src={state.pic}/>
                    <img className="d-sm-block d-md-none" style={{ width:"140px",height:"140px",borderRadius:"70px"}} src={state.pic}/>
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
                        <div className="row d-none d-sm-block" style={{border:"2px solid green",borderRadius:"10px"}}>
                        { state && state.about.split("\n").map((item)=>
                            <li>{item}</li>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            { mypics===undefined ? <h2 className="loading">Loading</h2> : mypics.length==0 ? <h2 className="loading">No Posts to Show</h2> :
                <div className="gallery">
                    {
                        mypics.map(
                            item=>{
                                return (
                                    <img key = {item._id} className="item" src={item.photo} alt={item.title}/>
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