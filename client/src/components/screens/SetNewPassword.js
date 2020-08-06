import React,{useState} from 'react';
import {useHistory,useParams} from 'react-router-dom';
import M from 'materialize-css'

const SetNewPassword = () => {

    const [password1 ,setPassword1] = useState("")
    const [password2 ,setPassword2] = useState("")
    const history=useHistory();
    const {token} =useParams()
    const [showButton,setButton] = useState(true);

    const PostData = ()=>{
        if(password1==="" || password1!==password2)
        {
            M.toast({html:"password Doesn't match",classes:"#c62828 red darken-3"})
            return ;
        }
        setButton(false)
        fetch("/newpassword",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password1,
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
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input
                type="password" 
                placeholder="password"
                value={password1}
                onChange={(e)=>setPassword1(e.target.value)}
                />
                <input
                type="password" 
                placeholder="Re Enter password"
                value={password2}
                onChange={(e)=>setPassword2(e.target.value)}
                />
                {showButton?
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>PostData()}>
                    Update Password
                </button>
                :
                <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                   Updating ...
                </button>
                }
            </div>
        </div>
     );
}
 
export default SetNewPassword;