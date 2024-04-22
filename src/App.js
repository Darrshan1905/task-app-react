import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'

import useAuth from './shared/hooks/authHook';
import { AuthContext } from './shared/context/authContext';

import Welcome from './Welcome/welcome';
import Profile from './Users/pages/profile';
import LogIn from './Users/pages/login';
import SignUp from './Users/pages/signup';
import AllProjects from './Projects/pages/allProjects';
import ShowProject from './Projects/pages/showProject';
import NewProject from './Projects/pages/newProject';
import EditProject from './Projects/pages/editProject';

function App() {
  const {token, login, logout, userId, name, isAdmin} = useAuth();

  let routes;

  if(token) {
    routes = (
      <Routes>
        <Route path='/' exact element={<Welcome/>}/>
        <Route path='/projects' exact element={<AllProjects/>}/>
        <Route path='/projects/:pid' exact element={<ShowProject/>}/>
        <Route path='/projects/:pid/edit' exact element={<EditProject/>}/>
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
        <Route path = '*' element={<Navigate to ="/login" replace/>}/>
      </Routes>
    )
  }
  
  return (
    <AuthContext.Provider value={{isLoggedIn: !!token, token: token, login: login, logout: logout, userId: userId, name: name, isAdmin: isAdmin}}>
      <Router>
        <main>
          {routes}
        </main> 
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
