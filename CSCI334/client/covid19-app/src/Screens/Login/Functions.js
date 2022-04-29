import { _loginGeneral, _loginBusiness, _loginHealth } from '../../_helpers/endPoints';
import PATH from '../../_constants/paths';
import history from '../../_helpers/history';

export const loginGeneral = (setLoading, updateAuth, user) => {
    return _loginGeneral(user)
    .then(res => {
        setLoading(false); 
        localStorage.setItem('USER', JSON.stringify(res.data));
        updateAuth(res.data);
        if(res.data.isTemporary) history.push(PATH.changePassword);
        else history.push(PATH.home);
    })
    .catch(err => {
        console.log(err);
        setLoading(false);
        throw new Error("Email or password details were incorrect");
    });
}

export const loginBusiness = (setLoading, updateAuth, user) => {
    return _loginBusiness(user)
    .then(res => {
        setLoading(false); 
        localStorage.setItem('USER', JSON.stringify(res.data));
        updateAuth(res.data);
        if(res.data.isTemporary) history.push(PATH.changePassword);
        else history.push(PATH.home);
    })
    .catch(err => {
        console.log(err);
        setLoading(false);
        throw new Error("Email or password details were incorrect");
    });
}

export const loginHealth = (setLoading, updateAuth, user) => {
    return _loginHealth(user)
    .then(res => {
        setLoading(false); 
        localStorage.setItem('USER', JSON.stringify(res.data));
        updateAuth(res.data);
        if(res.data.isTemporary) history.push(PATH.changePassword);
        else history.push(PATH.home);
    })
    .catch(err => {
        console.log(err);
        setLoading(false);
        throw new Error("Email or password details were incorrect");
    });
}