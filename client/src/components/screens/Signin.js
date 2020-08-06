import React,{useState,useContext} from 'react';
import {Link,useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Signin = () => {
    const {state,dispatch} =useContext(UserContext)
    const history= useHistory()
    const [password,setPassword]= useState("")
    const [email,setEmail]= useState("")
    const [showButton,setButton] = useState(true);

    const PostData = ()=>{
        setButton(false)
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,
                password
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                setButton(true)
                M.toast({html: data.error,classes:"#c62828 red darken-3"})
            }
            else
            {
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({
                    type:"USER",
                    payload:data.user
                })
                M.toast({html:"signed Successfully!",classes:"#43a047 green darken-1"})
                history.push('/')
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
                <input 
                type="password" 
                placeholder="password" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                {showButton?
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={()=>PostData()}>
                    Login
                </button>
                :
                <button className="btn btn-primary" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    loging in...
                </button>
                }
                <h5>
                    <Link to="/signup">Don't have an account ?</Link>
                </h5>
                <h6>
                    <Link to="/reset">Reset Password ?</Link>
                </h6>
            </div>
        </div>
     );
}
 
export default Signin;