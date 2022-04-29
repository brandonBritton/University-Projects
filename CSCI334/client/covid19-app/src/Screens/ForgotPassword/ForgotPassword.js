import { layout } from './Layouts';
import { Form, Button, Input, Radio } from 'antd';
import USER_TYPE from '../../_constants/userTypes';
import { useForm } from 'antd/lib/form/Form';
import { forgotPasswordGeneral, forgotPasswordBusiness, forgotPasswordHealth } from './Functions';
import { validateEmail } from '../../_helpers/sharedFunctions';  
import { useState } from 'react';



const ForgotPassword = () => {
    const [form] = useForm();
    const [loading, setLoading] = useState(false);

    const submitNewPasswordRequest = (_, email) => {

        if(!validateEmail(email)) return Promise.resolve();
        const values = form.getFieldValue();
        console.log(values);

        switch(values.type){
            case USER_TYPE.GENERAL: return forgotPasswordGeneral(email, setLoading);
            case USER_TYPE.BUSINESS: return forgotPasswordBusiness(email, setLoading);
            case USER_TYPE.HEALTH: return forgotPasswordHealth(email, setLoading);
            default: break;
        }
    }

    return (
        <div>
            <div style={{backgroundColor: "#FDC500"}}>
                <h1 style={{color: "#0E5F76", paddingLeft: "1%"}}>Forgot Password</h1>
            </div>

            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}>Forgot Password?</h1>
            </div>

            <div>
                <Form 
                    {...layout}
                    form={form}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        style={{color: "#0E5F76"}}
                        validateTrigger={['onBlur']}
                        rules={[
                            {   
                                type: 'email',
                                required: true,
                                message: 'Email does not appear to be valid!',
                                whitespace: true,
                            },
                            {
                                validator: submitNewPasswordRequest,
                                validateTrigger: "onSubmit"
                            }
                        ]}
                    >
                        <Input placeholder="Enter your email here" maxLength={50}/>
                    </Form.Item>

                    <Form.Item 
                        {...layout} 
                        name="type" 
                        label="Who are you?"
                        rules={[
                            { 
                                required: true,
                                message: "Please tell us who you are!"
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={USER_TYPE.GENERAL}>General Public</Radio>
                            <Radio value={USER_TYPE.HEALTH}>Health Professional</Radio>
                            <Radio value={USER_TYPE.BUSINESS}>Venue Owner</Radio>
                        </Radio.Group>
                    </Form.Item>
            
                    <Form.Item style={{paddingLeft: '37.5%'}}>
                        <Button loading={loading} type="primary" htmlType="submit" >Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default ForgotPassword;