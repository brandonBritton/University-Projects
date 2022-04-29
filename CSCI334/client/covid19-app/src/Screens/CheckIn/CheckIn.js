import { useAuth, useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import USER_TYPE from '../../_constants/userTypes';
import CheckinRegistered from './CheckinRegistered';
import CheckinUnregistered from './CheckinUnregistered';
import CheckedIn from './CheckedIn';
import { useState } from 'react';

const CheckIn = () => {
    const auth = useAuth();
    const updateAuth = useAuthUpdate();
    const [checkinData, setCheckinData] = useState({});
    
    const propsUnregistered = {
        setCheckinData: setCheckinData
    }

    const propsRegistered = {
        auth: auth,
        updateAuth: updateAuth,
        setCheckinData: setCheckinData
    }

    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Location Sign In</h1>
            </div> 

            {
                JSON.stringify(checkinData) !== "{}"
                ?
                <CheckedIn {...checkinData}/>
                :
                auth.type === USER_TYPE.GENERAL
                ?
                <CheckinRegistered {...propsRegistered}/>
                :
                <CheckinUnregistered {...propsUnregistered}/>
            }
        </div>
    );
}

export default CheckIn;