

import { Form, Input} from 'antd';
import { layout2 } from '../Register/Helpers/Layouts';
import { useAuth,useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { _getBusinessProfile } from '../../_helpers/endPoints';
import { useState, useEffect } from 'react';
import { logout } from '../../_helpers/sharedFunctions';
import history from '../../_helpers/history';
import PATH from '../../_constants/paths';


 const MyProfileBusiness = () => {
    const auth = useAuth();
    const updateAuth = useAuthUpdate();

    const data = {
        password: "***************"
    }

    const [userData, setUserData] = useState({});

    useEffect(() =>{
        let unmounted = false;

        Promise.all([_getBusinessProfile(auth.token)])
        .then( resArr=> {
            if(!unmounted){
                const userRes = resArr[0];
                console.log(userRes);
                setUserData(userRes.data);
            }
        })
        .catch( err => {
            console.log(err);
            if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
        });

        return () => { unmounted = true };
    }, [auth.token, updateAuth, auth.type]);


    return (
        <div style = {{textAlign: "center", color: "#0E5F76"}}>

            <h1 style = {{color: "#0E5F76", textAlign: "left", backgroundColor: "#FDC500", paddingLeft: "1%"}}>My Profile</h1>
            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}> Your Profile Details </h1>
            </div>
            
            <Form {...layout2} >
                <Form.Item
                    label="First Name"
                    name="firstName"
                    style={{color: "#0E5F76"}}
                    
                    rules={[{whitespace: true}]}
                >
                    <Input  placeholder= {userData.firstName} disabled/>
                </Form.Item>
        
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    style={{color: "#0E5F76"}}
                    rules={[{whitespace: true}]}
                >
                    <Input  placeholder= {userData.lastName} disabled/>
                </Form.Item>  

                <Form.Item 
                        label="Phone" 
                        name="phone" 
                        style={{color: "#0E5F76"}}
                        validateTrigger={['onBlur']}
                        rules={[{whitespace: true}]}
                    >
                    <Input  placeholder= {userData.phone} disabled/>
                </Form.Item>

                <Form.Item 
                        label="Business Name" 
                        name="businessName" 
                        style={{color: "#0E5F76"}}
                        validateTrigger={['onBlur']}
                        rules={[{whitespace: true}]}
                    >
                    <Input  placeholder= {userData.businessName} disabled/>
                </Form.Item>

                <Form.Item 
                        label="ABN" 
                        name="abn" 
                        style={{color: "#0E5F76"}}
                        validateTrigger={['onBlur']}
                        rules={[{whitespace: true}]}
                    >
                    <Input  placeholder= {userData.abn} disabled/>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    style={{color: "#0E5F76"}}
                    validateTrigger={['onBlur']}
                    rules={[{whitespace: true}]}
                >
                    <Input  placeholder= {userData.email} disabled/>
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
                    <span onClick={() => {history.push(PATH.editMyProfileBusiness)}} style={{color: "#0E5F76"}}><u style={{cursor: "pointer"}} >Edit details</u></span>
                </div><br/><br/><br/><br/><br/>
            </Form>

        </div>
    );
}

export default MyProfileBusiness;