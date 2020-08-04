import React,{useContext}  from 'react';
import {UserContext} from '../App'
import {Link,useHistory} from 'react-router-dom'



const Navbar = () => {
    const {state,dispatch}  =useContext(UserContext)
    const history=useHistory()
    const renderList = ()=>{
      if(state){
          return  [
            <li><Link to="/profile">Profile</Link></li>,
            <li><Link to="/createpost">Create Post</Link></li>,
            <li><Link to="/myfollowingpost">My following Posts</Link></li>,
            <li><Link to="/editprofile">Edit Profile</Link></li>,
            <li><Link to="/savedposts">SavedPosts</Link></li>,
            <li>
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
            <li><Link to="/Signin">Signin</Link></li>,
            <li><Link to="/signup">Signup</Link></li>
          ]
      }
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
    </>
    );
}
 
export default Navbar;