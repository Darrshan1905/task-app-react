import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Welcome from './Welcome/welcome';
import AllProjects from './Projects/pages/allProjects';
import ShowProject from './Projects/pages/showProject';

let routes;

routes = (
  <Routes>
    <Route path='/' exact element={<Welcome/>}/>
    <Route path='/projects' exact element={<AllProjects/>}/>
    <Route path='/projects/:pid' exact element={<ShowProject/>}/>
    <Route path = '*' element={<Navigate to ="/" replace/>}/>
  </Routes>
)

function App() {
  return (
    <Router>
      <main>
        {routes}
      </main>
    </Router>
  );
}

export default App;
