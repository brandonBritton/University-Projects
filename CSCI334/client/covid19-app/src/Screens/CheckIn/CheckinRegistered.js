
import { useForm } from "antd/lib/form/Form";
import { Form, Input } from 'antd'; 
import { useState } from 'react';
import { somethingWentWrongModal } from './Modals';
import { _checkIn } from '../../_helpers/endPoints';
import { logout } from '../../_helpers/sharedFunctions';
import { Button } from 'antd';
import { layout } from './Layouts';

const CheckinRegistered = props => {
    const [loading, setLoading] = useState();
    const [form] = useForm();
    const auth = props.auth;
    const updateAuth = props.updateAuth;
    const setCheckinData = props.setCheckinData;

    const checkInUser = values => {
        setLoading(true);
    
        _checkIn(auth.token, values)
        .then(res => {
            console.log(res);
            setLoading(false);
            const date = new Date();
            const businessName = res.data.businessName;
            setCheckinData({date: date, businessName: businessName});
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
            else if(err.response.status === 400) form.setFields([{ name: 'venueCode', errors: ['That venue code does not exist in our system!'] }]);
            else somethingWentWrongModal();
        });
    }

    return(
        <div>    
            <div style = {{textAlign: 'center'}}> <br/>
                <h1 style = {{fontSize: '1.8rem', color: '#0E5F76'}}>COVID Guard Check-in</h1>
                <div style = {{fontSize: '1.2rem'}}>Please enter the venue code to check-in</div> <br/>
            </div>

            <Form {...layout} form={form} onFinish={checkInUser}>
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

export default CheckinRegistered;