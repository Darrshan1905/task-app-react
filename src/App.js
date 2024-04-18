import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

import useAuth from './shared/hooks/authHook';
import { AuthContext } from './shared/context/authContext';

import Welcome from './Welcome/welcome';
import AllProjects from './Projects/pages/allProjects';
import ShowProject from './Projects/pages/showProject';
import Profile from './Users/pages/profile';
import LogIn from './Users/pages/login';
import SignUp from './Users/pages/signup';
import NewProject from './Projects/pages/newProject';

function App() {
  const {token, login, logout, userId} = useAuth();

  let routes;

  if(token) {
    routes = (
      <Routes>
        <Route path='/' exact element={<Welcome/>}/>
        <Route path='/projects' exact element={<AllProjects/>}/>
        <Route path='/projects/:pid' exact element={<ShowProject/>}/>
        <Route path='/projects/new' exact element={<NewProject/>}/>
        <Route path='/profile' exact element={<Profile/>}/>
        <Route path = '*' element={<Navigate to ="/" replace/>}/>
      </Routes>
    )  
  } else {
    routes = (
      <Routes>
        <Route path='/' exact element={<Welcome/>}/>
        <Route path='/login' exact element={<LogIn/>}/>
        <Route path='/signup' exact element={<SignUp/>}/>
        <Route path = '*' element={<Navigate to ="/" replace/>}/>
      </Routes>
    )
  }
  
  return (
    <AuthContext.Provider value={{isLoggedIn: !!token, token: token, login: login, logout: logout, userId: userId}}>
      <Router>
        <main>
          {routes}
        </main> 
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
