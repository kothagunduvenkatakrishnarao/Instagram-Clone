import React,{useContext,useRef,useEffect, useState}  from 'react';
import {UserContext} from '../App'
import {Link,useHistory} from 'react-router-dom'
import M from 'materialize-css'


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
            <li key="1"><i data-target="modal1" className="material-icons modal-trigger" style={{color:"black",marginLeft:"50px"}}>search</i></li>,
            <li key="2"><Link to="/profile">Profile</Link></li>,
            <li key="3"><Link to="/createpost">Create Post</Link></li>,
            <li key="4"><Link to="/myfollowingpost">My following Posts</Link></li>,
            <li key="5"><Link to="/editprofile">Edit Profile</Link></li>,
            <li key="6"><Link to="/savedposts">SavedPosts</Link></li>,
            <li key="7">
              <button className="btn btn-danger"
                onClick={()=>{
                  localStorage.removeItem("jwt")
                  localStorage.removeItem("user")
                  dispatch({
                    type:"CLEAR",
                  })
                  history.push("/signin")
                }}>
                Logout
            </button>
            </li>
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
      <ul className="sidenav" id="mobile-demo">
            {renderList()}
      </ul>
      <div id="modal1" className="modal col-10 col-sm-7" ref={searchModal} >
        <div>
        <i className="material-icons modal-close" style={{color:"red",float:"right"}}>close</i>
        </div>
        <div className="modal-content">
          <input
          type="text"
          placeholder="search"
          value={searchName}
          onChange={(e)=>fetchUsers(e.target.value)}
          />
          <div style={{height:"150px"}}>
          <ul className="collection" style={{height:"150px",overflowY:"scroll"}}>
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