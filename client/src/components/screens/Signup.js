import React,{useState,useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom';
import M from 'materialize-css'

const Signup = () => {
    const history= useHistory()
    const [name,setName]= useState("")
    const [password,setPassword]= useState("")
    const [email,setEmail]= useState("")
    const [image,setImage]= useState("")
    const [showpassword,setShowPassword]=useState(false)
    const [url,setUrl]= useState(undefined)
    const [showButton,setButton] = useState(true);

     
    useEffect(()=>{
        if(url){
            uploadFields();
        }
        
    },[url])
    
    const uploadPic = ()=>{
        const data=new FormData();
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

    const uploadFields = ()=>{
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                email,
                password,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                setButton(true)
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else
            {
                M.toast({html:data.message,classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    const PostData = ()=>{
        setButton(false)
        if(image)
        {
            uploadPic();
        }
        else{
            uploadFields();
        }
    }

    return ( 
        <div >
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input 
                type="text" 
                placeholder="name" 
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
                <input
                type="email" 
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <div style={{display:"inline"}}>
                <input 
                className="col-10"
                type={showpassword ? "text":"password"} 
                placeholder="password" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                {showpassword ?
                <i className="material-icons col-2" onClick={()=>{
                    setShowPassword(!showpassword);
                }}>visibility</i>
                :
                    <i className="material-icons col-2" onClick={()=>{
                        setShowPassword(!showpassword);
                    }}>visibility_off</i>
                }
                </div>
                <div className="file-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Profile Image</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
                </div>
                {
                    showButton?
                    <button className="btn btn-primary"
                        onClick={()=>PostData()}>
                            SignUp
                    </button>
                    :
                    <button className="btn btn-primary" type="button" disabled>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        signing up...
                    </button>
                }
                <h5>
                    <Link to="/signin">Already have an account ?</Link>
                </h5>
            </div>
        </div>
     );
}
 
export default Signup;