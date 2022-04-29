import GeneralNav from './GeneralNav';
import BusinessNav from './BusinessNav';
import HealthNav from './HealthNav';
import UnregisteredNav from './UnregisteredNav';
import LoadingNav from './LoadingNav';
import USER_TYPE from '../../_constants/userTypes';
import { useAuth } from '../AuthContext/AuthContext';
import { useAuthValidator } from '../AuthValidator/authValidator';

const Navbar = () => {
    const auth = useAuth();
    const isValidated = useAuthValidator(auth);

    return(
        <div>

            {
                auth.type === USER_TYPE.UNREGISTERED
                ? <UnregisteredNav />
                : auth.type === USER_TYPE.BUSINESS && isValidated
                ? <BusinessNav />
                : auth.type === USER_TYPE.HEALTH && isValidated
                ? <HealthNav />  
                : auth.type === USER_TYPE.GENERAL && isValidated
                ? <GeneralNav />
                : <LoadingNav />
            }
        </div>
    );
}

export default Navbar;