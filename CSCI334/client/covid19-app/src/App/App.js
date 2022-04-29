import './App.less';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../_helpers/history';
import PATH from '../_constants/paths';
import AuthProvider from '../Components/AuthContext/AuthContext';
import Navbar from '../Components/Navbar/Navbar';
import Footer from '../Components/Footer/Footer';
import Homepage from '../Screens/Homepage/Homepage';
import config from '../Components/PrivateRoutes/config';
import PrivateRoute from '../Components/PrivateRoutes/PrivateRoutes';




   

function App() {
  return (
    <div className="App">
        <AuthProvider>
            <div id="navbar-wrapper">
                <Navbar />
               
            </div>
            
            <div id="body-wrapper">
                <Router history={history}>
                    <Switch>
                        <Route exact path={PATH.home}> <Homepage /> </Route>
                        {
                            config.routes.map(({component, url, roles}) => roles === null 
                                ? <Route key={url} path={url} component={component}/> 
                                : <PrivateRoute key={url} path={url} component={component} roles={roles} /> 
                            )
                        }
                        <Route path="*"> <Homepage /> </Route>
                    </Switch>
                </Router> 
            </div>
        </AuthProvider>

        <div id="footer-wrapper">
            <Footer />
        </div>
    </div>
  );
}

export default App;
