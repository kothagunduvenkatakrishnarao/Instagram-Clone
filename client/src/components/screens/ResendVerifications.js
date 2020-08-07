import React,{useState} from 'react';
import {useHistory} from 'react-router-dom'
import M from 'materialize-css'

const ResendVerification = () => {

    const [email,setEmail]=useState("")
    const history=useHistory();
    const [showButton,setButton] = useState(true);

    const PostData = ()=>{
        if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        {
            setButton(true)
            M.toast({html:"enter valid email",classes:"#c62828 red darken-3"})
            return ;
        }
        setButton(false)
        fetch("/resendverification",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email
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
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input
                type="email" 
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                {showButton?
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>PostData()}>
                    Resend Verification
                </button>
                :
                <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                   Sending ...
                </button>
                }
            </div>
        </div>

     );
}
 
export default ResendVerification;