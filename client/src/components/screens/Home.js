import React,{useState,useEffect,useContext} from 'react';
import Loading from './Loading'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';
import M from 'materialize-css'
import NoPostsFound from  './NoPosts'


const Home = () => {
    const [data,setData]=useState(undefined)
    const {state,dispatch} = useContext(UserContext)
    const [com,setComment] = useState("")
    const [showbutton,setButton] = useState(true)
    const [showMoreIcon,setshowMoreIcon] = useState(true)

    useEffect(()=>{
        fetch('/allposts',{
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
            setButton(true)
            M.toast({html:"comment posted!",classes:"#43a047 green darken-1"})
        }).catch(err=>{
            console.log(err);
        })
        
    }

    const deletePost = (postid,publicId) =>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                'Authorization':"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                publicId
            })
        }).then(res=>res.json())
        .then(result=>{
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }


    const SavePost = (item) =>{
        fetch('/save',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                Authorization:"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                item
            })
        }).then(res=>res.json())
        .then(data=>{
            localStorage.setItem("user",JSON.stringify({...state,saved:data.saved}))
            dispatch({
                type:"SAVEORUNSAVEPOST",
                payload:{
                    saved:data.saved
                }
            })
        })
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
        })
    }

    function disPlayContent() {
        return (
            <div className="home">
                {
                    data.map(item=>{
                        return (
                        <div className="card home-card" key={item._id}>
                            <h3 style={{paddingLeft:"5%",paddingTop:"2%"}}><img style={{borderRadius:"50%", maxWidth:"30px"}} src={item.postedBy.pic} alt="..."></img><Link to={item.postedBy._id!== state._id ? "/profile/"+item.postedBy._id : "/profile"}>   {item.postedBy.name}</Link> {item.postedBy._id === state._id && 
                            <Tooltip title="delete post"><i className="material-icons" style={{float:"right",color:"red",marginRight:"5%"}} onClick={()=>deletePost(item._id,item.photo.split('/')[7].split('.')[0])}>delete</i></Tooltip>}</h3>
                            <div className="card-image" style={{alignSelf:"center"}}>
                                <img src={item.photo} style={{maxWidth:"90%",maxHeight:"450px",left:"5%"}} onDoubleClick={()=>{!item.likes.includes(state._id) && likePost(item._id)}}/>
                            </div>
                            <div className="card-content">
                                <Tooltip title="like or unlike">
                                {item.likes.includes(state._id) ? 
                                <i className="material-icons" onClick={()=>{unlikePost(item._id)}} 
                                style={{color:"red"}}
                                >favorite</i>
                                :
                                <i className="material-icons" onClick={()=>{likePost(item._id)}} 
                                >favorite_border</i>
                                }
                                </Tooltip>
                                {state.saved.includes(item._id) ?
                                    <Tooltip title="unsave post">
                                        <i className="material-icons" style={{float:"right"}}  onClick={()=>{UnsavePost(item._id)}}>bookmark</i>
                                    </Tooltip>
                                    :
                                    <Tooltip title="save post">
                                        <i className="material-icons" style={{float:"right"}}  onClick={()=>{SavePost(item._id)}}>bookmark_border</i>
                                    </Tooltip>
                                }
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
                                {showMoreIcon &&item.comments.length>3 && <Tooltip title="show more"><i className="fa fa-chevron-circle-down offset-6" onClick={()=>setshowMoreIcon(false)}></i></Tooltip>}
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
                                {showMoreIcon==false && item.comments.length>3 && <Tooltip title="show less"><i className="fa fa-chevron-circle-up offset-6" onClick={()=>setshowMoreIcon(true)}></i></Tooltip>}
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
                                        </button>
                                        </Tooltip>
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
        );
    }



    return ( 
        <>
        { data===undefined ? <Loading/> : data.length==0 ? <NoPostsFound
                    data="No posts to show."/>:
                    disPlayContent()
        }
        </>
     );
}
 
export default Home;


