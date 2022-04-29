import { Form, Input, Button } from 'antd';
import { layout } from './layouts';
import USER_TYPE from '../../_constants/userTypes';
import { useState } from 'react';
import { isWhiteSpace } from '../../_helpers/sharedFunctions';
import { _changePasswordBusiness, _changePasswordGeneral, _changePasswordHealth} from '../../_helpers/endPoints';
import { useAuth, useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { logout } from '../../_helpers/sharedFunctions';
import { useForm } from 'antd/lib/form/Form';
import { changePasswordSuccessModal, somethingWentWrongModal } from './Modals';

const ChangePassword =() => {
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const updateAuth = useAuthUpdate();
    const [form] = useForm();

    const changePassword = values => {
        setLoading(true);
        switch(auth.type){
            case USER_TYPE.GENERAL: {
                _changePasswordGeneral(auth.token, values)
                .then(() => {
                    setLoading(false);
                    changePasswordSuccessModal();
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);

                    if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
                    else somethingWentWrongModal();
                })
                break;
            }
            case USER_TYPE.BUSINESS: {
                _changePasswordBusiness(auth.token, values)
                .then(() => {
                    setLoading(false);
                    changePasswordSuccessModal();
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);
                    if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
                    else somethingWentWrongModal();
                })
                break;
            }
            case USER_TYPE.HEALTH: {
                _changePasswordHealth(auth.token, values)
                .then(() => {
                    setLoading(false);
                    changePasswordSuccessModal();
                })
                .catch(err => {
                    setLoading(false);
                    console.log(err);
                    if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
                    else somethingWentWrongModal();
                })
                break;
            }
            default: logout(updateAuth, auth.token, auth.type);
        }
    }

    return(
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Change Password</h1>
            </div>
            
            <div>
                <h1 style={{marginTop:"5%" ,textAlign:'Center',fontWeight:'normal',color: "#0E5F76"}}>
                    Change Password
                </h1>
            </div>

            <Form {...layout} onFinish={changePassword} form={form}>
                <Form.Item
                    label="New Password :"
                    name="newPassword"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {   
                            required: true,
                            message: 'Please input your new password!',
                            whitespace: true,
                        }
                    ]}
                >
                    <Input.Password maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="Confirm New Password :"
                    name="confirmPassword"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {   
                            required: true,
                            message: 'Please confirm your new password password!',
                            whitespace: true,
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if(getFieldValue('newPassword') === value || value === undefined) return Promise.resolve();
                                if(isWhiteSpace(value)) return Promise.resolve();
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                            validateTrigger: 'onSubmit'
                        })
                    ]}
                >
                    <Input.Password maxLength={30}/>
                </Form.Item>

                <Form.Item style={{paddingLeft: '37.5%'}}>
                    <Button loading={loading} type="primary" htmlType="submit">Change Password</Button>
                </Form.Item>
            </Form>

        </div>
    );
}

export default ChangePassword;