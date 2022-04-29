

import { Form, Input, Button} from 'antd';
import { layout2 } from '../Register/Helpers/Layouts';
import { useAuth,useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { _editProfileHealth, _getHealthProfile } from '../../_helpers/endPoints';
import { useState, useEffect } from 'react';
import { logout, onlyNumbers } from '../../_helpers/sharedFunctions';
import { useForm } from 'antd/lib/form/Form';
import history from '../../_helpers/history';
import PATH from '../../_constants/paths';



const data = {
    password: "***************",
}

 const EditMyProfileHealth = () => {

    const auth = useAuth();
    const updateAuth = useAuthUpdate();
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() =>{
        let unmounted = false;

        Promise.all([_getHealthProfile(auth.token)])
        .then( resArr=> {
            if(!unmounted){
                const userRes = resArr[0];
                setUserData(userRes.data);
                form.setFieldsValue({firstName: userRes.data.firstName, lastName: userRes.data.lastName, email: userRes.data.email, phone: userRes.data.phone, healthID: userRes.data.healthId  });
            }
        })
        .catch( err => {
            console.log(err);
            if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
        });

        return () => { unmounted = true };
    }, [auth.token, updateAuth, auth.type, form]);

    const updateInfo = values => {
        setLoading(true);
        _editProfileHealth(auth.token, values)
        .then(() => {
            setLoading(false);
            history.push(PATH.myProfileHealth);
        })
        .catch(err => {
            console.log(err);
            if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
            setLoading(false);
        });
    }
    console.log(userData);

    return (
        <div style = {{textAlign: "center", color: "#0E5F76"}}>

            <h1 style = {{color: "#0E5F76", textAlign: "left", backgroundColor: "#FDC500", paddingLeft: "1%"}}>My Profile</h1>
            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}> Edit Profile Details </h1>
            </div>
            
            <Form 
            {...layout2} 
            onFinish={updateInfo}
            form = {form}
            >
                <Form.Item
                    label="First Name"
                    name="firstName"
                    style={{color: "#0E5F76"}}
                    rules={[{whitespace: true}]}
                >
                    <Input  maxLength={30}/>
                </Form.Item>
        
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    style={{color: "#0E5F76"}}
                    rules={[{whitespace: true}]}
                >
                    <Input  maxLength={30} />
                </Form.Item>

                <Form.Item 
                        label="Phone" 
                        name="phone" 
                        style={{color: "#0E5F76"}}
                        validateTrigger={['onBlur']}
                        rules={[
                            {
                                validator: async (_, phone) => {
                                    if(phone !== undefined && phone !== "" && phone.length < 10){
                                        return Promise.reject(new Error('Phone number must be valid'));
                                    }
                                }
                            }
                        ]}
                    >
                    <Input onChange={e => {onlyNumbers(e, form, 'phone')}} maxLength={10}/>
                </Form.Item>
                
                <Form.Item 
                        label="HealthWorkerID" 
                        name="healthID" 
                        style={{color: "#0E5F76"}}
                        validateTrigger={['onBlur']}
                        rules={[{whitespace: true}]}
                    >
                    <Input  maxLength={30} disabled/>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    style={{color: "#0E5F76"}}
                    validateTrigger={['onBlur']}
                    rules={[{ whitespace: true}]}
                >
                    <Input   disabled maxLength={30}/>
                </Form.Item>   

                <Form.Item
                    label="Password"
                    name="password"
                    style={{color: "#0E5F76"}}
                    rules={[{whitespace: true}]}
                >
                    <Input  placeholder= {data.password} disabled/>
                </Form.Item>
    
                <div style={{textAlign: 'center'}}>
                    <Button  loading={loading} type="primary" htmlType="submit" >Save Changes</Button> &nbsp;&nbsp;
                    <Button onClick={() => {history.push(PATH.myProfileHealth)}} type="primary"  >Discard Changes</Button>
                </div> <br/>
                <Form.Item style={{paddingLeft: '41%'}}>
                    <span onClick={() => {history.push(PATH.changePassword)}} style={{color: "#0E5F76"}}><u style={{cursor: "pointer"}} >Change Password</u></span>
                </Form.Item>

            </Form>
            
        </div>
    );
}

export default EditMyProfileHealth;