import React,{useContext,useRef,useEffect, useState}  from 'react';
import {UserContext} from '../App'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import Tooltip from '@material-ui/core/Tooltip';


const Navbar = () => {
    const searchModal = useRef(null)
    const sidenavbar = useRef(null)
    const {state,dispatch}  =useContext(UserContext)
    const history=useHistory()
    const [searchName,setSearchName] = useState("")
    const [userDetails,searchUserDetails]= useState([])
    useEffect(()=>{
        M.Modal.init(searchModal.current);
        M.Sidenav.init(sidenavbar.current);
    },[])

    const renderMobileViewList = () =>{

      if(state){
        return  [
          <Tooltip title="search user">
          <li key="1" style={{marginTop:"20px"}}><Link><div className="input-group" onClick={()=>M.Sidenav.getInstance(sidenavbar.current).close()}>
            <span className="input-group-addon"><i data-target="modal1" className="fa fa-search fa-2x modal-trigger" style={{color:"#9e9e9e",marginTop:"-10px"}}></i></span>
            <span>&nbsp; Search</span>
          </div></Link></li>
          </Tooltip>,
          <Tooltip title="my following post"><li key="4"><Link to="/myfollowingpost">
            <div className="input-group" onClick={()=>M.Sidenav.getInstance(sidenavbar.current).close()}>
            <span className="fa-stack" style={{fontSize:"93%",color:"#9e9e9e"}}>
            <i className="fa fa-users fa-stack-1x" ></i>
            <i className="fa fa-sticky-note-o fa-stack-2x" style={{color:"#9e9e9e"}}></i>
          </span>
          <span style={{marginTop:"-10px"}}>&nbsp; My following users</span> 
          </div>
          </Link></li></Tooltip>,
          <Tooltip title="create post"><li key="3"><Link to="/createpost"><div className="input-group" onClick={()=>M.Sidenav.getInstance(sidenavbar.current).close()}><i className="fa fa-plus-square-o fa-2x" style={{color:"#9e9e9e"}}></i><span style={{marginTop:"-10px"}}>&nbsp; Create Post</span> </div></Link></li></Tooltip>,
          <Tooltip title="saved posts"><li key="5"><Link to="/savedposts"><div className="input-group" onClick={()=>M.Sidenav.getInstance(sidenavbar.current).close()}><i className="fa fa-floppy-o fa-2x" style={{color:"#9e9e9e"}}></i><span style={{marginTop:"-10px"}}>&nbsp; Saved Posts</span> </div></Link></li></Tooltip>,
          <Tooltip title="settings"><li key="6"><Link to="/editprofile"><div className="input-group" onClick={()=>M.Sidenav.getInstance(sidenavbar.current).close()}><i className="fa fa-cog fa-2x" style={{color:"#9e9e9e"}}></i><span style={{marginTop:"-10px"}}>&nbsp; Edit Profile</span> </div></Link></li></Tooltip>,
          <Tooltip title="user profile"><li key="2"><Link to="/profile"><div className="input-group" onClick={()=>M.Sidenav.getInstance(sidenavbar.current).close()}><img src={state && state.pic} style={{width:"26px",height:"26px",borderRadius:"13px",color:"#9e9e9e"}}/><span style={{marginTop:"-10px"}}>&nbsp; Profile</span></div></Link></li></Tooltip>,
          <Tooltip title="log out">
          <li key="7"><Link>
          <div className="input-group" onClick={()=>M.Sidenav.getInstance(sidenavbar.current).close()}>
            <i className="fa fa-sign-out fa-2x" style={{color:"#9e9e9e"}}
              onClick={()=>{
                localStorage.removeItem("jwt")
                localStorage.removeItem("user")
                dispatch({
                  type:"CLEAR",
                })
                history.push("/signin")
              }}></i><span style={{marginTop:"-10px"}}>&nbsp; Logout</span></div></Link></li></Tooltip>
              
        ]
    }
    else{
        return [
              <li key="8"><Link to="/Signin" onClick={()=>M.Sidenav.getInstance(sidenavbar.current).close()}>Signin</Link></li>,
              <li key="9"><Link to="/signup" onClick={()=>M.Sidenav.getInstance(sidenavbar.current).close()}>Signup</Link></li>
        ]
    }

    }


    const renderList = ()=>{
      if(state){
          return  [
            <Tooltip title="search user">
            <li key="1"><Link><i data-target="modal1" className="fa fa-search fa-2x modal-trigger" style={{color:"#9e9e9e"}}></i></Link></li>
            </Tooltip>,
            <Tooltip title="my following post"><li key="4"><Link to="/myfollowingpost">
              <span className="fa-stack" style={{fontSize:"93%",marginTop:"-150%",color:"#9e9e9e"}}>
              <i className="fa fa-users fa-stack-1x" ></i>
              <i className="fa fa-sticky-note-o fa-stack-2x" style={{color:"#9e9e9e"}}></i>
            </span>
            </Link></li></Tooltip>,
            <Tooltip title="create post"><li key="3"><Link to="/createpost"><i className="fa fa-plus-square-o fa-2x" style={{color:"#9e9e9e"}}></i></Link></li></Tooltip>,
            <Tooltip title="saved posts"><li key="5"><Link to="/savedposts"><i className="fa fa-floppy-o fa-2x" style={{color:"#9e9e9e"}}></i></Link></li></Tooltip>,
            <Tooltip title="settings"><li key="6"><Link to="/editprofile"><i className="fa fa-cog fa-2x" style={{color:"#9e9e9e"}}></i></Link></li></Tooltip>,
            <Tooltip title="user profile"><li key="2"><Link to="/profile"><img src={state && state.pic} style={{width:"26px",height:"26px",borderRadius:"13px",color:"#9e9e9e"}}/></Link></li></Tooltip>,
            <Tooltip title="log out">
            <li key="7"><Link>
              <i className="fa fa-sign-out fa-2x" style={{color:"#9e9e9e"}}
                onClick={()=>{
                  localStorage.removeItem("jwt")
                  localStorage.removeItem("user")
                  dispatch({
                    type:"CLEAR",
                  })
                  history.push("/signin")
                }}></i></Link></li></Tooltip>
                
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
        <div className="nav-wrapper bg-light" style={{maxWidth:"100%",color:"white"}}>
          <Link to={state?"/":"/signin"} className="brand-logo left">Instagram</Link>
          <a href="#" data-target="mobile-demo" className="sidenav-trigger right" ><i className="material-icons">menu</i></a>
          <ul className="right hide-on-med-and-down nav-links">
            {renderList()}
          </ul>
        </div>
      </nav>
      <ul className="sidenav right" id="mobile-demo" ref={sidenavbar}>
            <i className="fa fa-arrow-left fa-2x" aria-hidden="true" style={{float:"right",color:"#9e9e9e",marginRight:"10px"}} onClick={()=>M.Sidenav.getInstance(sidenavbar.current).close()}></i>,
            {renderMobileViewList()}
      </ul>
      <div id="modal1" className="modal col-10 col-sm-7" ref={searchModal} >
      <i className="fa fa-close fa-2x modal-close" style={{color:"#9e9e9e",float:"right"}}></i>
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