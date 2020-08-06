import React,{useState,useEffect,useContext} from 'react';
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';
import M from 'materialize-css'
import Loading from './Loading'
import NoPostsFound from  './NoPosts'


const SubscribedPosts = () => {
    const [data,setData]=useState(undefined)
    const {state,dispatch} = useContext(UserContext)
    const [com,setComment] = useState("")
    const [showbutton,setButton] = useState(true)

    
    useEffect(()=>{
        fetch('/subpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
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
        console.log(commentId)
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
            setData(newData)
            setComment("")
        }).catch(err=>{
            console.log(err);
        })
        setButton(true)
    }


    
    return (
        <>
        {data ===undefined ? <Loading/>: data.length==0 ? 
            <NoPostsFound
            data="No posts to show. Follow some one."/>
         :
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
                            <h6>{item.likes.length} likes</h6>
                            <h6>{item.title}</h6>
                            <p>{item.body}</p>
                            {
                                item.comments.length===0 ? <h6>Be first to comment</h6> :
                                item.comments.map(record=>{
                                    return(
                                        <div key={record._id} style={{marginTop:"3%"}}> 
                                        { record.postedBy._id === state._id && <Tooltip title="delete comment"><i className="material-icons" style={{float:"right",color:"red"}} onClick={()=>deleteComment(record._id,item._id)}>delete</i></Tooltip>}
                                        <p key={record._id}><Link to ={ record.postedBy._id === state._id ? "/profile" : "/profile/"+record.postedBy._id }><span style={{fontFamily:"Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"}}> @{record.postedBy.name}-</span></Link>{record.text}</p>
                                        </div>
                                    )
                                })
                            }
                            <form style={{paddingTop:"2%"}} onSubmit={
                              (e)=>{
                                  e.preventDefault();
                              }  
                            }>
                            <div className="row">
                                <div className="input-field col-10 col-md-10">
                                    <input type="text" placeholder="Comment" value={com} onChange={(e)=>setComment(e.target.value)}/>
                                </div>
                                <div style={{paddingTop:"5%"}}>
                                
                                        { showbutton ?
                                        <Tooltip title="post comment">
                                        <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={
                                            ()=>makeComment(item._id)}>
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
 
export default SubscribedPosts;