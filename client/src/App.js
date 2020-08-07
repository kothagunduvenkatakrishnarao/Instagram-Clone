import React,{useEffect, createContext,useReducer,useContext} from 'react';
import Navbar from './components/Navbar'
import "./App.css"
import {BrowserRouter,Route,useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import SubscribedPosts from './components/screens/SubscribedPosts'
import EditProfile from './components/screens/EditProfile'
import SavedPosts from './components/screens/SavedPosts'
import ResetPassword from './components/screens/Reset'
import SetNewPassword from './components/screens/SetNewPassword'
import Verify from './components/screens/Verify'
import ResendVerification from './components/screens/ResendVerifications'
import {reducer,initialState} from './reducers/userReducer'



export const UserContext = createContext()

const Routing=()=>{
  const history=useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user= JSON.parse(localStorage.getItem("user"))
    if(user)
    {
      dispatch({
        type:"USER",
        payload:user
      })
    }
    else
    {
      if(!history.location.pathname.startsWith('/resendverification') &&!history.location.pathname.startsWith('/reset') && !history.location.pathname.startsWith('/verification'))
          history.push('/signin')
    }
  },[])

    return ( 
      <>
      <Route exact path="/"><Home/></Route>
      <Route path="/signin"><Signin/></Route>
      <Route path="/signup"><Signup/></Route>
      <Route exact path="/profile"><Profile/></Route>
      <Route path="/createpost"><CreatePost/></Route>
      <Route path="/profile/:userid"><UserProfile/></Route>
      <Route path="/myfollowingpost"><SubscribedPosts/></Route>
      <Route path="/editprofile"><EditProfile/></Route>
      <Route path="/savedposts"><SavedPosts/></Route>
      <Route exact path="/reset"><ResetPassword/></Route>
      <Route path="/reset/:token"><SetNewPassword/></Route>
      <Route path="/verification/:token"><Verify/></Route> 
      <Route path="/resendverification"><ResendVerification/></Route> 
      </>
     );
}


function App() {
  const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
