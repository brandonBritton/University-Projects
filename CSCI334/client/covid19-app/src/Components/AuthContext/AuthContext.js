import { useState, useContext, createContext } from "react"
import  USER_TYPE  from '../../_constants/userTypes';

const AuthContext = createContext();
const AuthUpdateContext = createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function useAuthUpdate(){
    return useContext(AuthUpdateContext);
}

const initialAuth = () => {
    try{
        const user = JSON.parse(localStorage.getItem('USER'));
        if(user === null) return {type: USER_TYPE.UNREGISTERED};
        return user;
    }
    catch(err){
        console.log(err);
        localStorage.clear();
        return {type: USER_TYPE.UNREGISTERED};
    }
    
    
}

const AuthProvider = ({children}) => {
    const [authType, setAuthType] = useState(initialAuth());
    console.log(authType);

    const updateAuth = USER => {
        setAuthType(USER);
    }

    return(
        <AuthContext.Provider value={authType}>
            <AuthUpdateContext.Provider value={updateAuth}>
                {children}
            </AuthUpdateContext.Provider>
        </AuthContext.Provider>
    );
}

export default AuthProvider;