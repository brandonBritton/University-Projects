import { Form, Input, Button, Select } from 'antd';
import { layout3, layout4 } from '../Helpers/Layouts'; 
import { useForm } from 'antd/lib/form/Form';
import USER_TYPE from '../../../_constants/userTypes';
import { useViewport } from '../../../_helpers/viewPort';
import { setCustLayout } from '../Helpers/Functions';
import { onlyNumbers } from '../../../_helpers/sharedFunctions';
import { _registerBusiness } from '../../../_helpers/endPoints';
import { registerSuccessModal } from '../Helpers/Modals';
import { useState } from 'react';

const { Option } = Select;





const BusinessForm = props => {
    const setUserState = props.setUserState;
    const [form] = useForm();
    const { width } = useViewport();
    const [loading, setLoading] = useState(false);
    const numberInputs = onlyNumbers;
    let layoutA = layout3;
    let layoutB = layout4;

    if(width < 1400){
        layoutA = setCustLayout();
        layoutB = setCustLayout();
    }





    const register = () => {
        form.validateFields()
        .then(res => {
            setLoading(true);
            if(res.phone === "") delete res.phone;
            res.email = res.email.toLowerCase();
            console.log(res.email);
            const firstName = res.firstName;
            
            _registerBusiness(res)
            .then(() => {
                setLoading(false);
                registerSuccessModal(firstName);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                form.setFields([
                    {
                        name: 'email',
                        errors: ['Check email or ABN is not already in use!'],
                    },
                    {
                        name: 'abn',
                        errors: ['Check email or ABN is not already in use!'],
                    }
                ]);
            })
       })
       .catch(err => {
           console.log(err);
       })
    }




    
    return (
        <div>
            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}>COVID Guard Register</h1>
            </div>

            <div className = "register-business-column">
            <Form {...layoutA} form={form}>
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
                                whitespace: true
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
                        validateTrigger={['onBlur']}
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                                    return Promise.reject(new Error('Passwords do not match!'));
                                }
                            })
                        ]}
                    >
                        <Input.Password maxLength={30}/>
                    </Form.Item>

                    <Form.Item
                        label="ABN"
                        name="abn"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your ABN!',
                                whitespace: true
                            },
                            {   
                                validateTrigger: 'onsubmit',
                                validator: async (_, abn) => {
                                    if(!abn) return Promise.resolve();
                                    else if(abn.length < 11) return Promise.reject(new Error('ABN must be 11 digits!'));
                                }
                            }
                        ]}
                    >
                        <Input onChange={e => {numberInputs(e, form, 'abn')}} maxLength={11}/>
                    </Form.Item>
                </Form>
            </div>

            <div className="register-business-column">
            <Form {...layoutB} form={form}>
                    <Form.Item
                        label="Venue Name"
                        name="businessName"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the name of your venue!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>
            
                    <Form.Item
                        label="Address Line 1"
                        name="addressLine1"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input venue address!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>

                    <Form.Item
                        label="Address Line 2"
                        name="addressLine2"
                        style={{color: "#0E5F76"}}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>

                    <Form.Item
                        label="Suburb"
                        name="suburb"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the suburb your venue is located!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>

                    <Form.Item
                        label="City"
                        name="city"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the city your venue is located!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>

                    <Form.Item
                        label="State"
                        name="state"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please select the state your venue is located!',
                                whitespace: true
                            }
                        ]}
                    >
                        <Select placeholder="Select State">
                            <Option value="QLD">QLD</Option>
                            <Option value="NSW">NSW</Option>
                            <Option value="VIC">VIC</Option>
                            <Option value="TAS">TAS</Option>
                            <Option value="SA">SA</Option>
                            <Option value="WA">WA</Option>
                            <Option value="NT">NT</Option>
                            <Option value="ACT">ACT</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Post Code"
                        name="postcode"
                        style={{color: "#0E5F76"}}
                        rules={[
                            {
                                required: true,
                                message: 'Please input the postcode of your venue!',
                                whitespace: true
                            },
                            {   
                                validateTrigger: 'onsubmit',
                                validator: async (_, postcode) => {
                                    if(!postcode) return Promise.resolve();
                                    else if(postcode.length < 4) return Promise.reject(new Error('Postcode must be 4 digits!'));
                                }
                            }
                        ]}
                    >
                        <Input onChange={e => {numberInputs(e, form, 'postcode')}} maxLength={4} />     
                    </Form.Item>
                </Form>
            </div>

            <div style={{textAlign: 'center'}}>
                <Button loading={loading} type="primary" onClick={() => {register()}}>Sign me up</Button>
                <span style={{color: "#0E5F76", paddingLeft: '15px'}}>Not you? <u style={{cursor: "pointer"}} onClick={() => { setUserState(USER_TYPE.UNREGISTERED)}}>Click here</u></span>
            </div> 
        </div>
    );
};

export default BusinessForm;