import React,{useContext,useEffect, useState} from 'react';
import { UserContext } from '../../App';
import {Link} from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';
import M from 'materialize-css'
import Loading from './Loading';
import NoPostsFound from './NoPosts'


const SavedPosts = () => {
    const {state,dispatch} =useContext(UserContext)
    const [data,setData]=useState(undefined)
    const [com,setComment] = useState("")
    const [showbutton,setButton] = useState(true)
    const [showMoreIcon,setshowMoreIcon] = useState(true)

    useEffect(()=>{
        fetch('/showsavedposts',{
            method:"get",
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        })
        .then(res=>res.json())
        .then(result=>{
            setData(result.posts)
        })
    },[])


    const likePost = (id) =>{
        fetch('/like',{
            method:"put",
            headers:{
               "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id)
                {
                    return result
                }
                else return item
            })
            setData(newData)
        }).catch(err=>{
            console.log(err)
        })
    }

    const unlikePost = (id) =>{
        fetch('/unlike',{
            method:"put",
            headers:{
               "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id)
                {
                    return result
                }
                else return item
            })
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const deleteComment = (commentId,postId) =>{
        fetch('/deletecomment',{
            method:"put",
            headers:{
               "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                commentId:commentId,
                postId:postId
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id)
                {
                    return result
                }
                else return item
            })
            M.toast({html:"comment Deleted Successfully",classes:"#43a047 green darken-1"})
            setData(newData)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (postId)=>{
        setButton(false)
        if(com.length === 0)
        {
            setButton(true)
            return M.toast({html:"cannont post empty comment",classes:"#c62828 red darken-3"})
        }
        fetch('/comment',{
            method: "put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text:com
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.map(item=>{
                if(item._id===result._id)
                {
                    return result
                }
                else return item
            })
            setComment("")
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
        setButton(true)
    }


    const UnsavePost = (item) =>{
        fetch('/unsave',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                Authorization:"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                item
            })
        }).then(res=>res.json())
        .then(result=>{
            localStorage.setItem("user",JSON.stringify({...state,saved:result.saved}))
            dispatch({
                type:"SAVEORUNSAVEPOST",
                payload:{
                    saved:result.saved
                }
            })
            const newData = data.filter(item=>{
                return result.saved.includes(item._id);
            })
            setData(newData)
        })
    }

    return ( 
        <>
        {data ===undefined ? <Loading /> : data.length==0 ? <NoPostsFound
                    data="No posts to show. Save some posts."/>:
        <div className="home">
            {
                data.map(item=>{
                    return (
                    <div className="card home-card" key={item._id}>
                        <h5 style={{paddingLeft:"5%",paddingTop:"2%"}}><img style={{borderRadius:"50%", maxWidth:"30px"}} src={item.postedBy.pic} alt="..."></img><Link to={item.postedBy._id!== state._id ? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link></h5>
                        <div className="card-image">
                            <img src={item.photo} style={{width:"90%", height:"90%", left:"5%"}}/>
                        </div>
                        <div className="card-content">
                        <Tooltip title="like or unlike" style={{fontSize:"large"}}>
                            {item.likes.includes(state._id) ? 
                            <i className="material-icons" onClick={()=>{unlikePost(item._id)}} 
                            style={{color:"red"}}
                             >favorite</i>
                             :
                             <i className="material-icons" onClick={()=>{likePost(item._id)}} 
                             >favorite_border</i>
                            }
                        </Tooltip>
                        <Tooltip title="unsave post">
                            <i className="material-icons" style={{float:"right"}} onClick={()=>UnsavePost(item._id)}>bookmark</i>
                        </Tooltip>
                        <div>
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            <div>
                            {
                                item.comments.length===0 ? <h6>Be first to comment</h6> : 
                                    item.comments.slice(0,3).map(record=>{
                                        return(
                                            <div key={record._id} style={{marginTop:"3%"}}> 
                                            { record.postedBy._id === state._id && <Tooltip title="delete comment"><i className="material-icons" style={{float:"right",color:"red"}} onClick={()=>deleteComment(record._id,item._id)}>delete</i></Tooltip>}
                                            <p ><Link to ={ record.postedBy._id === state._id ? "/profile" : "/profile/"+record.postedBy._id }><span style={{fontFamily:"Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"}}> @{record.postedBy.name}-</span></Link> {record.text}</p>
                                            </div>
                                        )
                                    })
                            }
                            {showMoreIcon &&item.comments.length>3 && <Tooltip title="show more"><i className="fa fa-chevron-circle-down" onClick={()=>setshowMoreIcon(false)}></i></Tooltip>}
                            {
                                showMoreIcon==false &&
                                item.comments.slice(3,).map(record=>{
                                    return(
                                        <div key={record._id} style={{marginTop:"3%"}}> 
                                        { record.postedBy._id === state._id && <Tooltip title="delete comment"><i className="material-icons" style={{float:"right",color:"red"}} onClick={()=>deleteComment(record._id,item._id)}>delete</i></Tooltip>}
                                        <p ><Link to ={ record.postedBy._id === state._id ? "/profile" : "/profile/"+record.postedBy._id }><span style={{fontFamily:"Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"}}> @{record.postedBy.name}-</span></Link> {record.text}</p>
                                        </div>
                                    )
                                })
                            }
                            {showMoreIcon==false && item.comments.length>3 && <Tooltip title="show less"><i className="fa fa-chevron-circle-up" onClick={()=>setshowMoreIcon(true)}></i></Tooltip>}
                            </div>
                            </div>
                            <form style={{paddingTop:"2%"}} onSubmit={(e)=>{
                                e.preventDefault()
                            }}>
                            <div className="row">
                                <div className="input-field col-10 col-md-10">
                                    <input type="text" placeholder="Comment" value={com} onChange={(e)=>setComment(e.target.value)}/>
                                </div>
                                <div style={{paddingTop:"5%"}}>
                                
                                        { showbutton ?
                                        <Tooltip title="post comment">
                                        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={()=>makeComment(item._id)}>
                                        <i className="material-icons" style={{float:"right"}}>send</i>
                                        </button></Tooltip>
                                        :
                                        <button className="btn btn-primary" type="button" disabled>
                                            <span className="spinner-border spinner-border-sm" role="status"></span>
                                        </button>
                                        }
                                        
                                </div>
                            </div>
                            </form>
                           
                        </div>
                    </div>
                    )
                })
            }
            
        </div>
        }
        </>
     );
}
 
export default SavedPosts;