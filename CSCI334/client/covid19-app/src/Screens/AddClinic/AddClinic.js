import { Form, Select, Input, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useState } from 'react';
import { onlyNumbers, logout } from '../../_helpers/sharedFunctions';
import { layout } from './Layouts';
import { useAuthUpdate, useAuth } from '../../Components/AuthContext/AuthContext';
import { _addClinic } from '../../_helpers/endPoints';
import { successModal, somethingWentWrongModal } from './Modals';
  

const { Option } = Select;

const AddClinic = () => {
    const [form] = useForm();
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const updateAuth = useAuthUpdate();

    const submitNewClinic = values => {
        setLoading(true);

        _addClinic(auth.token, values)
        .then(res => {
            console.log(res);
            setLoading(false);
            successModal();
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
            if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
            else somethingWentWrongModal();
        });
    }

    return (
        <div>
            <div style={{textAlign: 'center', padding: '1%'}}>
                <h1 style={{color: "#0E5F76"}}>Add Vaccination Clinic</h1>
            </div>

             <Form form={form} {...layout} onFinish={submitNewClinic}>
                <Form.Item
                    label="Clinic Name"
                    name="clinicName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the name of the clinic!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>
        
                <Form.Item
                    label="Address Line 1"
                    name="addressLine1"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the clinic address line 1!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="Address Line 2"
                    name="addressLine2"
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="Suburb"
                    name="suburb"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the suburb the clinic is located!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="City"
                    name="city"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the city the clinic is located!',
                            whitespace: true
                        }
                    ]}
                >
                    <Input maxLength={30}/>
                </Form.Item>

                <Form.Item
                    label="State"
                    name="state"
                    rules={[
                        {
                            required: true,
                            message: 'Please select the state the clinic is located!',
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
                            message: 'Please input the postcode of the clinic!',
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
                    <Input onChange={e => {onlyNumbers(e, form, 'postcode')}} maxLength={4} />     
                </Form.Item>

                <Form.Item
                    label="Latitude"
                    name="latitude"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the latitude of the clinic!',
                            whitespace: true
                        },
                        {   
                            validator: async (_, lat) => {
                                if(lat === undefined || lat === "") return Promise.resolve();
                                const reg = /^-?[0-9]\d*(\.\d+)?$/;

                                if(!reg.test(lat) || lat < -90 || lat > 90) return Promise.reject(new Error('not valid latitude!'));
                            }
                        }
                    ]}
                >
                    <Input maxLength={8}/>
                </Form.Item>

                <Form.Item
                    label="Longitude"
                    name="longitude"
                    rules={[
                        {
                            required: true,
                            message: 'Please input the longitude of the clinic!',
                            whitespace: true
                        },
                        {   
                            validator: async (_, long) => {
                                if(long === undefined || long === "") return Promise.resolve();
                                const reg = /^-?[0-9]\d*(\.\d+)?$/;

                                if(!reg.test(long) || long < -180 || long > 180) return Promise.reject(new Error('not valid longitude!'));
                            }
                        }
                    ]}
                >
                    <Input maxLength={8}/>
                </Form.Item>

                <Form.Item 
                    label="Phone" 
                    name="phone" 
                    validateTrigger={['onBlur']}
                    rules={[
                        {
                            required: true,
                            message: 'Please input the longitude of the clinic!',
                            whitespace: true
                        },
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

                <Form.Item style={{paddingLeft: '33.5%'}}>
                    <Button loading={loading} type="primary" htmlType="submit">Sign me up</Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default AddClinic;
