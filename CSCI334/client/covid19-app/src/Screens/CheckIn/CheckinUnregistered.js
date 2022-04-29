import { Form, Input, Button } from 'antd';
import { _checkInUnregistered } from '../../_helpers/endPoints';
import { useState } from 'react';
import { useForm } from 'antd/lib/form/Form';
import { onlyNumbers } from '../../_helpers/sharedFunctions';
import { somethingWentWrongModal } from './Modals';
import { layout } from './Layouts';

const CheckinUnregistered = props => {
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const setCheckinData = props.setCheckinData;

    const checkInUser = values => {
        setLoading(true);
   
        _checkInUnregistered(values)
        .then(res => {
            setLoading(false);
            const date = new Date();
            const businessName = res.data.businessName;
            setCheckinData({date: date, businessName: businessName});
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            if(err.response.status === 400) form.setFields([{ name: 'venueCode', errors: ['That venue code does not exist in our system!'] }])
            else somethingWentWrongModal();
        });
    }

    return(
        <div className = 'checkInMainContent' style={{maxWidth: '100%', color: '#0E5F76'}}>    
            <div style = {{textAlign: 'center'}}><br/>
                <h1 style = {{fontSize: '1.8rem', color: '#0E5F76'}}>COVID Guard Check-in</h1>
                <div style = {{fontSize: '1.2rem'}}>Please enter your personal details and venue code to check-in</div> <br/>
            </div>

            <Form {...layout} form={form} onFinish={checkInUser}>
                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your first name!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={50}/>
                </Form.Item>
        
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your last name!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={50}/>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
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
                    <Input maxLength={50}/>
                </Form.Item>

                <Form.Item 
                        label="Phone" 
                        name="phone" 
                        rules={[
                            {
                                required: true,
                                message: 'Please input your phone number!',
                                whitespace: true
                            },
                            {
                                validator: async (_, phone) => {
                                    if(phone !== undefined && phone !== "" && phone.length < 10){
                                        return Promise.reject(new Error('Phone number must be valid!'));
                                    }
                                },
                                validateTrigger: 'onSubmit'
                            }
                        ]}
                    >
                    <Input onChange={e => {onlyNumbers(e, form, 'phone')}} maxLength={10}/>
                </Form.Item>

                <Form.Item
                    label="Venue Code"
                    name="venueCode"
                    rules={[
                        {
                            required: true,
                            message: 'Enter code displayed by venue!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={10}/>
                </Form.Item>
                
                <Form.Item style={{paddingLeft: "37.5%"}}>
                    <Button loading={loading} type="primary" htmlType="submit">Check-In</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default CheckinUnregistered;