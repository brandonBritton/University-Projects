import USER_TYPE from '../_constants/userTypes';
import PATH from '../_constants/paths';
import history from '../_helpers/history';
import { _logoutGeneral, _logoutBusiness, _logoutHealth } from './endPoints';

export const logout = (updateAuth, token, type) => {
    localStorage.setItem('USER', JSON.stringify({type: USER_TYPE.UNREGISTERED}));
    updateAuth({type: USER_TYPE.UNREGISTERED});
    history.push(PATH.login);
    
    switch(type){
        case USER_TYPE.GENERAL: {
            _logoutGeneral(token)
            .then(res => console.log(res))
            .catch(err => console.log(err));
            break;
        }
        case USER_TYPE.BUSINESS: {
            _logoutBusiness(token)
            .then(res => console.log(res))
            .catch(err => console.log(err));
            break;
        }
        case USER_TYPE.HEALTH: {
            _logoutHealth(token)
            .then(res => console.log(res))
            .catch(err => console.log(err));
            break;
        }
        default: {}
    }
}

//Event handler that only allows numbers as input
export const onlyNumbers = (e, form, field, index, subfield) => {
    const reg = /^[0-9]*$/;
    const str = e.target.value;
    let field_obj = {};

    if(typeof index !== 'undefined'){
        let arr = form.getFieldValue(field);
        let sub_obj = arr[index];
        
        if (str === '' || reg.test(str)) sub_obj[subfield] = str;  
        else sub_obj[subfield] = makeNumber(str);
        field_obj[field] = arr;    
    }

    else{
        if (str === '' || reg.test(str)) field_obj[field] = str;     
        else field_obj[field] = makeNumber(str); 
    }
    form.setFieldsValue(field_obj);
}

//Removes characters that are not numbers from a string
export const makeNumber = str => {
    for(let i = 0; i < str.length; i++){
        if(isNaN(str[i]) || str[i]===" "){
            str = str.substring(0, i) + str.substring(i+1, str.length);
            i--;
        }
    }
    return str;
}

export const isWhiteSpace = s => {
    for(let i = 0; i < s.length; i++) if(s[i] !== ' ') return false;
    return true;
}

export const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const nth = d => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

export const formatDate = dateAdministered => {
    if(dateAdministered==="") return "";
    const date = new Date(dateAdministered);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
}

export const nameEndingInS = lastName => {
    if(lastName[lastName.length -1] === 's') return lastName += "'";
    else if(lastName.length !== 0) return lastName += "s";
    else return lastName;
}


