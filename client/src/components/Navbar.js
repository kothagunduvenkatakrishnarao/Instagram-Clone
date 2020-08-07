import React,{useContext,useRef,useEffect, useState}  from 'react';
import {UserContext} from '../App'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import Tooltip from '@material-ui/core/Tooltip';


const Navbar = () => {
    const searchModal = useRef(null)
    const {state,dispatch}  =useContext(UserContext)
    const history=useHistory()
    const [searchName,setSearchName] = useState("")
    const [userDetails,searchUserDetails]= useState([])
    useEffect(()=>{
        M.Modal.init(searchModal.current);
    },[])
    const renderList = ()=>{
      if(state){
          return  [

            
            <Tooltip title="search user">
            <li key="1"><Link><i data-target="modal1" className="fa fa-search fa-2x modal-trigger" style={{color:"black"}}></i></Link></li>
            </Tooltip>,
            <Tooltip title="create post"><li key="3"><Link to="/createpost"><i className="fa fa-plus-square-o fa-2x"></i></Link></li></Tooltip>,
            <Tooltip title="saved posts"><li key="5"><Link to="/savedposts"><i className="fa fa-floppy-o fa-2x"></i></Link></li></Tooltip>,
            
            <Tooltip title="user profile"><li key="2"><Link to="/profile"><img src={state && state.pic} style={{width:"26px",height:"26px",borderRadius:"13px"}}/></Link></li></Tooltip>,
            <Tooltip title="settings"><li key="6"><Link to="/editprofile"><i className="fa fa-cog fa-2x"></i></Link></li></Tooltip>,
            <Tooltip title="log out">
            <li key="7"><Link>
              <i className="fa fa-sign-out fa-2x" style={{color:"black"}}
                onClick={()=>{
                  localStorage.removeItem("jwt")
                  localStorage.removeItem("user")
                  dispatch({
                    type:"CLEAR",
                  })
                  history.push("/signin")
                }}></i></Link></li></Tooltip>,
                <Tooltip title="my following post"><li key="4"><Link to="/myfollowingpost">
              <span className="fa-stack" style={{fontSize:"105%",marginBottom:"35px",marginLeft:"-5px"}}>
              <i className="fa fa-sticky-note-o fa-stack-2x" ></i>
              <i className="fa fa-users fa-stack-1x fa-inverse" style={{color:"black"}}></i>
            </span>
              </Link></li></Tooltip>
          ]
      }
      else{
          return [
                <li key="8"><Link to="/Signin">Signin</Link></li>,
                <li key="9"><Link to="/signup">Signup</Link></li>
          ]
      }
    }

    const fetchUsers = (query)=>{
      setSearchName(query)
      if(query==="")
      {
        return ;
      }
      fetch('/searchusers',{
        method:"post",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          query
        })
      }).then(res=>res.json())
      .then(result=>{
        console.log(result)
        searchUserDetails(result.user);
      })
    }

    return ( 
      <>
      <nav>
        <div className="nav-wrapper white" style={{maxWidth:"100%",color:"white"}}>
          <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
          <a href="#" data-target="mobile-demo" className="sidenav-trigger right"><i className="material-icons">menu</i></a>
          <ul className="right hide-on-med-and-down nav-links">
            {renderList()}
          </ul>
        </div>
      </nav>
      <ul className="sidenav right" id="mobile-demo">
            {renderList()}
      </ul>
      <div id="modal1" className="modal col-10 col-sm-7" ref={searchModal} >
        <div>
        <i className="fa fa-close modal-close" style={{color:"red",float:"right"}}></i>
        </div>
        <div className="modal-content">
          <input
          type="text"
          placeholder="search"
          value={searchName}
          onChange={(e)=>fetchUsers(e.target.value)}
          />
          <div style={{height:"150px"}}>
          <ul className="collection" style={{height:"150px",overflowY:"auto"}}>
              {userDetails.map(item=>{
              return <Link to={state._id !=  item._id ?"/profile/"+item._id : "/profile"} onClick={
                ()=>M.Modal.getInstance(searchModal.current).close()
              }><li className="collection-item">{item.name}</li></Link>
            })}
          </ul>
          </div>
        </div>
      </div>
    </>
    );
}
 
export default Navbar;