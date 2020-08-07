import React,{useState,useContext, useEffect} from 'react';
import {UserContext} from '../../App'
import M from 'materialize-css'

const EditProfile = () => {
    const {state,dispatch} = useContext(UserContext)
    const [name,setName] = useState(state && state.name)
    const [image,setImage]= useState(undefined)
    const [aboutYou,setAbout]= useState(state && state.about)
    const [showNameutton,setNameButton]= useState(true);
    const [showAboutButton,setAboutButton]= useState(true);

    useEffect(()=>{
        if(image)
        {
            updatepic();
        }
    },[image])


    const updateAbout = () =>{
        setAboutButton(false)
        var str = aboutYou;
        str = str.replace(/(^\s*)|(\s*$)/gi,"");
        str = str.replace(/[ ]{2,}/gi," ");
        str = str.replace(/\n /,"\n");
        if(str.split(' ').length >20 || str.split(' ').length<=0)
        {
            setAboutButton(true)
            return M.toast({html:"cannot exceed words more than 20 or Empty..",classes:"#c62828 red darken-3"})
        }
        fetch('/about',{
            method:"put",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                about:aboutYou
            })
        })
        .then(res=>res.json())
        .then(result=>{
            setAboutButton(true)
            console.log(result);
            localStorage.setItem("user",JSON.stringify({...state,about:result.about}))
            dispatch({
                type:"UPDATEABOUT",
                payload:{
                    about:result.about
                }
            })
            M.toast({html:"updated successfully!",classes:"#43a047 green darken-1"})
        })
        
        
    }
    
    const removePic =()=>{
        var url=(state.pic).split("/")[7].split(".")[0]
        fetch('/removepic',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                pic:undefined,
                publicId:url
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
            dispatch({
                type:"UPDATEPIC",
                payload:{
                    pic:result.pic
                }
            })
        })
    }

    const updateName =()=>{
        if(name===null)
        {
            return M.toast({html:"Name Filed is Empty",classes:"#c62828 red darken-3"});
        }
        else if(name===state.name)
        {
            return M.toast({html:"Name should not be as before",classes:"#c62828 red darken-3"});
        }
        setNameButton(false)
        console.log(showNameutton)
        fetch('/editname',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                name
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            setNameButton(true)
            localStorage.setItem("user",JSON.stringify({...state,name:result.name}));
            dispatch({
                type:"UPDATENAME",
                payload:{
                    name:result.name
                }
            })
            M.toast({html:"updated successfully!",classes:"#43a047 green darken-1"})
        })
        
        
    }

    const updatepic =()=>{
        console.log(state.pic)
        var url=(state.pic).split("/")[7].split(".")[0]
        const data=new FormData();
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","krishna-cloud")
        fetch("https://api.cloudinary.com/v1_1/krishna-cloud/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>{
            fetch('/editpic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url,
                    publicId:   url !== "default_d2e3bm" ? url: ""
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}));
                dispatch({
                    type:"UPDATEPIC",
                    payload:{
                        pic:result.pic
                    }
                })
            })

        }).catch(err=>{
            console.log(err);
        })
    }
    return (
        <div>
            {state===null ? <h2 className="loading">Loading .... </h2> : 
            <div className="card auth-card">
            <h4>Update Profile</h4>
            <h4>{state.name}</h4>
            <h4>{state.email}</h4>
            <div>
                <img style={{ width:"160px",height:"160px",borderRadius:"80px"}}
                src={state.pic}/>
            </div>
            <div style={{margin:"2%"}}>
            <span className="file-field validate">
                <i className="small material-icons">add_a_photo</i>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/></span>
            {(state.pic).split("/")[7].split(".")[0] !== "default_d2e3bm" ? <i className="small material-icons" onClick={()=>{removePic()}}>delete</i>: ""}
            </div>
            <div className="row">
                <div className="input-field col-7 col-md-7">
                <input
                type="text" 
                placeholder={state.name}
                value={name===null ? state.name : name}
                onChange={(e)=>setName(e.target.value)}/>
                </div>
               
                    {
                        showNameutton ?
                        <div className="input-field col-5 col-md-5">
                        <button className="btn btn-primary" onClick={
                            ()=>{updateName()}
                        }>Update</button></div>
                        :
                        <button className="btn btn-primary col-5 col-md-5" type="button" disabled>
                            <span className="spinner-border spinner-border-sm " role="status" aria-hidden="true"></span>Updating...
                        </button>
                    }
            </div>
            <div className="row">
                <div className="input-field col-7 col-md-7">
                <textarea cols="10"
                rows="7"
                type="text" 
                placeholder="About your self"
                value={aboutYou===null ? state.about : aboutYou}
                onChange={(e)=>setAbout(e.target.value)}/>
                </div>
                {
                        showAboutButton?

                        <div className="input-field col-5 col-md-5">
                        <button className="btn btn-primary" onClick={()=>{updateAbout()}}>Update</button></div>
                        :
                        <button className="btn btn-primary col-5 col-md-5" type="button" disabled>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Updating...</button>
                }
            </div>
        </div> }
        </div>
     );
}
 
export default EditProfile;