import { Route, Redirect } from 'react-router';
import { useAuth } from '../AuthContext/AuthContext'; 
import PATH from '../../_constants/paths';

const PrivateRoute = ({component: Component, roles = [], ...rest}) => {
    const user = useAuth();
   // const user = {type: "BUSINESS"};
    const hasRole = roles.some(role => user.type.includes(role));

    return (
        <Route {...rest} render={props => (
            hasRole ? <Component {...props} /> : <Redirect to={PATH.home} />
        )} />
    );
};

export default PrivateRoute;

