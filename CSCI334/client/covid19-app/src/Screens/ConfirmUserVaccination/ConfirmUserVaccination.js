import { layout } from './layouts';
import {Form, Radio, DatePicker, Input, Button} from 'antd'; 
import { VACCINE_TYPES } from './VaccineTypes';
import { useState } from 'react';
import { useAuth, useAuthUpdate } from '../../Components/AuthContext/AuthContext';
import { _confirmPatientVaccination } from '../../_helpers/endPoints';
import VACCINE_STATE from '../../_constants/vaccineStates';
import { validateEmail } from '../../_helpers/sharedFunctions';
import { logout } from '../../_helpers/sharedFunctions';
import moment from 'moment';
import {somethingWentWrongModal, confirmationSuccessModal} from './Modals';





const ConfirmUserVaccination = (_) => {

    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const auth = useAuth();
    const updateAuth = useAuthUpdate();





    const confirmVaccination = (_, email) => {

        if(!validateEmail(email)) return Promise.resolve();

        let values = form.getFieldValue();
        let newValues = {};

        newValues.email = values.email;
        newValues.dateAdministered = new Date(values.dateAdministered._d);
        newValues.status = values.status;
        newValues.vaccinationType = values.vaccinationType;
    
        setLoading(true);
        return _confirmPatientVaccination(newValues, auth.token)
        .then(res => {
            setLoading(false);
            console.log(res);
            confirmationSuccessModal(email);
        })
        .catch(err => {
            setLoading(false);
            console.log(err);
            if(err.response.status === 400) return Promise.reject(new Error('Patient email not found in our system!'));
            else if(err.response.status === 401) logout(updateAuth, auth.token, auth.type);
            else somethingWentWrongModal();
        });
    }





    return(
        <div>
            <h1 style = {{color: "#0E5F76", textAlign: "left", backgroundColor: "#FDC500", paddingLeft: "1%"}}>Confirm User Vaccination</h1>
            <h1 style = {{color: "#0E5F76", padding: "2%", textAlign: "center"}}>Confirm Vaccination Status of General Public Memeber</h1>

            <div>
                <Form
                    form={form}
                    {...layout}
                >
                    <Form.Item
                        label="Patient Email"
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
                                validator: confirmVaccination,
                                validateTrigger: "onSubmit"
                            }
                        ]}
                    >
                        <Input maxLength={50}/>
                    </Form.Item>

                    <Form.Item
                        {...layout}
                        label="Date of Vaccination"
                        name="dateAdministered"
                        rules={[
                            {
                                required: true,
                                message: "Please select date patient was vaccinated!"
                            }
                        ]}
                    >
                        <DatePicker disabledDate={current => { return current && current > moment().endOf('day')}}/>
                    </Form.Item>

                    <Form.Item 
                        {...layout} 
                        name="vaccinationType"
                        label="Vaccine Type" 
                        rules={[
                            { 
                                required: true,
                                message: 'Please select which vaccine was administered!'
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={VACCINE_TYPES.AstraZeneca}>{VACCINE_TYPES.AstraZeneca}</Radio>
                            <Radio value={VACCINE_TYPES.Novavax}>{VACCINE_TYPES.Novavax}</Radio>
                            <Radio value={VACCINE_TYPES.Pfizer}>{VACCINE_TYPES.Pfizer}</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item 
                        {...layout} 
                        name="status"
                        label="Vaccine Status" 
                        rules={[
                            { 
                                required: true,
                                message: 'Please select the vaccine status!'
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={VACCINE_STATE.Partial}>{VACCINE_STATE.Partial}</Radio>
                            <Radio value={VACCINE_STATE.Complete}>{VACCINE_STATE.Complete}</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item style={{paddingLeft: '37.5%'}}>
                        <Button loading={loading} type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default ConfirmUserVaccination;