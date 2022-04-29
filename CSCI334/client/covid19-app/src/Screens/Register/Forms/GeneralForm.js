import { Form, Input, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { layout2 } from '../Helpers/Layouts';
import USER_TYPE from '../../../_constants/userTypes';
import { onlyNumbers } from '../../../_helpers/sharedFunctions';
import { _registerGeneral } from '../../../_helpers/endPoints'; 
import { useState } from 'react';
import { registerSuccessModal } from '../Helpers/Modals';




const GeneralForm = props => {
    const [form] = useForm();
    const setUserState = props.setUserState;
    const numberInputs = onlyNumbers;
    const [loading, setLoading] = useState(false);




    
    const register = () => {
        const user = form.getFieldValue();
        setLoading(true);
        if(user.phone === "") delete user.phone;
        user.email = user.email.toLowerCase();
        
        _registerGeneral(user)
        .then(() => {
            setLoading(false);
            registerSuccessModal(user.firstName);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            form.setFields([
                {
                  name: 'email',
                  errors: ['Email already taken'],
                }
            ]);
        });
    }




    
    return(
        <div>
            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}>COVID Guard Register</h1>
            </div>

            <Form {...layout2} form={form} onFinish={register}>
                <Form.Item
                    label="First Name"
                    name="firstName"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>
        
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your last name!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    style={{color: "#0E5F76"}}
                    validateTrigger={['onBlur']}
                    rules={[
                        {
                            required: true,
                            type: 'email',
                            message: 'Please input a valid email!',
                            whitespace: true,
                        }     
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item 
                        label="Phone" 
                        name="phone" 
                        style={{color: "#0E5F76"}}
                        validateTrigger={['onBlur']}
                        rules={[
                            {
                                validator: async (_, phone) => {
                                    if(phone !== undefined && phone !== ""){
                                        if (phone.length < 10) {
                                            return Promise.reject(new Error('Phone number must be valid'));
                                        }
                                    }
                                },
                              },
                        ]}
                    >
                    <Input onChange={e => {numberInputs(e, form, 'phone')}} maxLength={10}/>
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
                        }
                    ]}
                >
                    <Input.Password maxLength={30}/>
                </Form.Item>
    
                <Form.Item
                    label="Confirm Password"
                    name="passwordConfirm"
                    style={{color: "#0E5F76"}}
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) return Promise.resolve();
                                return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                            validateTrigger: 'onSubmit'
                        })
                    ]}
                >
                    <Input.Password maxLength={30}/>
                </Form.Item>

                <Form.Item style={{paddingLeft: '33.5%'}}>
                    <Button loading={loading} type="primary" htmlType="submit">Sign me up</Button>
                </Form.Item>

                <Form.Item style={{paddingLeft: '33.5%'}}>
                    <span style={{color: "#0E5F76"}}>Not you? <u style={{cursor: "pointer"}} onClick={() => { setUserState(USER_TYPE.UNREGISTERED)}}>Click here</u></span>
                </Form.Item>
            </Form>
        </div>
    );
}

export default GeneralForm;