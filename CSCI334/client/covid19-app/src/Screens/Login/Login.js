import { Form, Input, Button, Radio } from 'antd';
import { layout, tailLayout } from './layouts';
import PATH from '../../_constants/paths';
import USER_TYPE from '../../_constants/userTypes';
import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { loginGeneral, loginBusiness, loginHealth } from './Functions';
import { isWhiteSpace, validateEmail } from '../../_helpers/sharedFunctions';
import { useViewport } from '../../_helpers/viewPort';




const Login = () => {
    const [loading, setLoading] = useState(false);
    const [form] = useForm();
    const updateAuth = useAuthUpdate();
    const { width } = useViewport();
    const breakPoint = 900;
 

    const onFinish = () => {
        console.log("SUCCESS");
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const login = (_, password) => {
        const email = form.getFieldValue('email');
        const type = form.getFieldValue('type');

        if(!password || isWhiteSpace(password) || !validateEmail(email)) return Promise.resolve();

        const user = {
            email: email,
            password: password,
        }

        setLoading(true);

        switch(type){
            case USER_TYPE.GENERAL: return loginGeneral(setLoading, updateAuth, user);
            case USER_TYPE.HEALTH: return loginHealth(setLoading, updateAuth, user);
            case USER_TYPE.BUSINESS: return loginBusiness(setLoading, updateAuth, user);
            default : {
                setLoading(false);
                return Promise.reject(new Error('Something went wrong'));
            }
        }
    }
    




    return (
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Login</h1>
            </div>
            
            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}>COVID Guard Login</h1>
            </div>

            <Form
                form={form}
                {...layout}
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{type: USER_TYPE.GENERAL}}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    style={{color: "#0E5F76"}}
                    rules={[
                    {   
                        type: 'email',
                        required: true,
                        message: 'Please input valid email!',
                        whitespace: true,
                        validateTrigger: 'onSubmit'
                    },
                    ]}
                >
                    <Input maxLength={50}/>
                </Form.Item>
        
                <Form.Item
                    label="Password"
                    name="password"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                            whitespace: true
                        },
                     
                        {
                            validator: login,
                            validateTrigger: "onSubmit"
                        }
                    ]}
                >
                    <Input.Password maxLength={30}/>
                </Form.Item>

                <Form.Item 
                    style={{paddingLeft: "37.5%"}}
                    {...tailLayout} 
                    name="type" 
                    rules={[{ required: true }]}
                >
                    <Radio.Group>
                        <Radio value={USER_TYPE.GENERAL}>General Public</Radio>
                        <Radio value={USER_TYPE.HEALTH}>Health Professional</Radio>
                        <Radio value={USER_TYPE.BUSINESS}>Venue Owner</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item {...tailLayout} style={{paddingLeft: "37.5%"}}>
                    <Button loading={loading} type="primary" htmlType="submit">Login</Button>
                    {
                        width < breakPoint
                        ?
                        <div style={{color: "#0E5F76"}}>Not Registered? <a href={PATH.register}><u>Click here</u></a></div>
                        :
                        <span style={{paddingLeft: "19%", color: "#0E5F76"}}>Not Registered? <a href={PATH.register}><u>Click here</u></a></span>
                    }
                </Form.Item>

                <Form.Item {...tailLayout} style={{paddingLeft: "37.5%"}}>
                    <span style={{color: "#0E5F76"}}>Forgot Password? <a href={PATH.forgotPassword}><u>Click here</u></a></span>
                </Form.Item>
            </Form>
        </div>
      );
}

export default Login;