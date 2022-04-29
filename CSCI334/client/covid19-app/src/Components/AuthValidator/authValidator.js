import { useState, useEffect } from 'react';
import { _checkGeneralUser, _checkBusinessUser, _checkHealthUser } from '../../_helpers/endPoints';
import  USER_TYPE  from '../../_constants/userTypes';
import { logout } from '../../_helpers/sharedFunctions';
import { useAuthUpdate } from '../AuthContext/AuthContext';

export const useAuthValidator = auth => {
    const [validated, setValidated] = useState(null);
    const updateAuth = useAuthUpdate();

    useEffect(() => {
        switch(auth.type){
            case USER_TYPE.GENERAL: {
                _checkGeneralUser(auth.token)
                .then(() => {
                    setValidated(true);  
                })
                .catch(err => {
                    console.log(err);
                    setValidated(false);
                    logout(updateAuth, auth.token, auth.type);
                });
                break;
            }
            case USER_TYPE.BUSINESS: {
                _checkBusinessUser(auth.token)
                .then(() => {
                    setValidated(true);  
                })
                .catch(err => {
                    console.log(err);
                    setValidated(false);
                    logout(updateAuth, auth.token, auth.type);
                });
                break;
            }
            case USER_TYPE.HEALTH: {
                _checkHealthUser(auth.token)
                .then(() => {
                    setValidated(true);  
                })
                .catch(err => {
                    console.log(err);
                    setValidated(false);
                    logout(updateAuth, auth.token, auth.type);
                });
                break;
            }
            default: setValidated(false);
        }
    }, [auth.token, auth.type, updateAuth]);

    return validated;
}