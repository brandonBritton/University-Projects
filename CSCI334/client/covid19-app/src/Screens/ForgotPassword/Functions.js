import { _forgotPasswordGeneral, _forgotPasswordBusiness, _forgotPasswordHealth } from '../../_helpers/endPoints';
import { forgotPasswordModal } from './Modals';

export const forgotPasswordGeneral = (email, setLoading) => {
    setLoading(true);
   
    return _forgotPasswordGeneral({email: email})
    .then(() => {
        setLoading(false);
        forgotPasswordModal(email);
    })
    .catch(err => {
        console.log(err);
        setLoading(false);
        throw new Error("Email does not exist!");
    });
}

export const forgotPasswordBusiness = (email, setLoading) => {
    setLoading(true);
    return _forgotPasswordBusiness({email: email})
    .then(() => {
        setLoading(false);
        forgotPasswordModal(email);
    })
    .catch(err => {
        setLoading(false);
        console.log(err);
        throw new Error("Email does not exist!");
    });
}

export const forgotPasswordHealth = (email, setLoading) => {
    setLoading(true);
    return _forgotPasswordHealth({email: email})
    .then(() => {
        setLoading(false);
        forgotPasswordModal(email);
    })
    .catch(err => {
        setLoading(false);
        console.log(err);
        throw new Error("Email does not exist!");
    });
}

