import React,{useState} from 'react';
import {useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'

const Verify = () => {
    const {token} =useParams()
    const history=useHistory(); 
    const [showbutton, setButton] =useState(true)


    const PostDetails= ()=>{
        setButton(false)
        fetch('/verifymyaccount',{
            method:"put",
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify({
                token
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
    return ( 
        <div>
            {showbutton ? 
            <button className="btn btn-primary button-btn" onClick={()=>{PostDetails()}} style={{left:"35%",top:"50%"}}>Verify My Account</button>
            :
            <button className="btn btn-primary button-btn" style={{left:"35%",top:"50%"}} type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                   Verifying ...
            </button>}
            <p className="button-btn" style={{left:"30%",top:"60%"}}> To Verify your Account Please click on the above button..</p>
        </div>
     );
}
 
export default Verify;