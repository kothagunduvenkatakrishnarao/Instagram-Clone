import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'
const CreatePost = () => {
    const history= useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImg] = useState("")
    const [url,setUrl] = useState("")
    const [showButton,setButton] = useState(true);

    useEffect(()=>
    {
        if(url){
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url,
                })
            }).then(res=>res.json())
            .then(data=>{
                console.log(data)
                if(data.error){
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                }
                else
                {
                    M.toast({html:"created post successfully!",classes:"#43a047 green darken-1"})
                    setButton(true)
                    history.push('/')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    },[url])

    const postDetails = ()=>{
        setButton(false)
        const data=new FormData();
        if(title==="" || body==="" || image==="" )
        {
            setButton(true)
            return M.toast({html:"Must fill all the fields",classes:"#c62828 red darken-3"});
        }
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","krishna-cloud")
        fetch("https://api.cloudinary.com/v1_1/krishna-cloud/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        }).catch(err=>{
            console.log(err);
        })

    }


    return ( 
        <div className="card auth-card">
            <input tyep="text" placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}/>
            <input tyep="text" placeholder="body"
            value={body}
            onChange={(e)=>setBody(e.target.value)}/>
            <div className="file-field">
            <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImg(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
            {
                showButton ? 
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={
                    ()=>postDetails()
                    }>
                        Submit post
                </button>
                :
                <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    uploading...
                </button>

            }
        </div>
     );
}
 
export default CreatePost;