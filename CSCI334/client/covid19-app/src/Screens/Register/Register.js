import './Register.css';
import USER_TYPE from '../../_constants/userTypes';
import { useState } from 'react';
import UserTypeForm  from './Forms/UserTypeForm';
import GeneralForm from './Forms/GeneralForm';
import HealthForm from './Forms/HealthForm';
import BusinessForm from './Forms/BusinessForm';
 




const Register = () => {
    const [userType, setUserType] = useState(USER_TYPE.UNREGISTERED);

    const setUserState = value => {
        setUserType(value.user);
    }
    




    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Register</h1>
            </div>
            
            {
                    userType === USER_TYPE.UNREGISTERED
                ?   <UserTypeForm setUserState={setUserState}/>
                :   userType === USER_TYPE.GENERAL
                ?   <GeneralForm setUserState={setUserState}/>
                :   userType === USER_TYPE.HEALTH
                ?   <HealthForm setUserState={setUserState}/>
                :   userType === USER_TYPE.BUSINESS
                ?   <BusinessForm setUserState={setUserState}/>
                :   <UserTypeForm setUserState={setUserState}/>
            }
        </div>
    );
}

export default Register;