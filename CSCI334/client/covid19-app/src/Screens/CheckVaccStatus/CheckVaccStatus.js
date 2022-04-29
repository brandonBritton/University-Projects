import { Form, Input, Button } from 'antd';
import { useState } from 'react';
import { layout } from './layouts';
import VACCINE_STATE from '../../_constants/vaccineStates';
import { CheckOutlined, RiseOutlined, CloseOutlined } from '@ant-design/icons';
import { _checkVaccinationValid } from '../../_helpers/endPoints';
import { formatDate } from '../../_helpers/sharedFunctions';


const CheckVaccStatus = () => {
    const [vaccinationRecord, setVaccinationRecord] = useState({dateAdministered:""});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const date = formatDate(vaccinationRecord.dateAdministered);

    const checkVaccinationValid = values => {
        let unmounted = false;
        setLoading(true);
 
        _checkVaccinationValid(values)
        .then(res => {
            if(!unmounted){
                setLoading(false);
                setVaccinationRecord(res.data);
            }
        })
        .catch(err => {
            console.log(err);
            if(!unmounted){
                setLoading(false);
                if(err.response.status === 400) setVaccinationRecord({ vaccinationStatus: VACCINE_STATE.NoVaccination });
                else setError(true);
            }
        });

        return () => { unmounted = true };
    }

    return (
        <div>
            <h1 style = {{color: "#0E5F76", textAlign: "left", backgroundColor: "#FDC500", paddingLeft: "1%"}}>Check Vaccination Status</h1>
            <h1 style = {{color: "#0E5F76", padding: "2%", textAlign: "center"}}>Check Vaccination Status</h1>

            <Form
                {...layout}
                onFinish={checkVaccinationValid}
            >
                <Form.Item
                        label="Code"
                        name="vaccinationCode"
                        rules={[
                            {
                                required: true,
                                whitespace: true,
                                message: 'Please input a valid vaccination code!',
                                validateTrigger: 'onSubmit'
                            },
                        ]}
                
                >   
                    <Input placeholder="Enter vaccination code here" maxLength={50}/>
                </Form.Item>
                <Form.Item style={{paddingLeft: "37.5%"}}>
                    <Button loading={loading} type="primary" htmlType="submit">Check Status</Button>
                </Form.Item>
            </Form>
            
            <div style={{textAlign: 'center'}}>
                {
                    vaccinationRecord.vaccinationStatus === VACCINE_STATE.Complete
                    ?
                    <div>
                        <span style={{color: "#0E5F76"}}>
                            {`${vaccinationRecord.patientFirstName} ${vaccinationRecord.patientLastName} 
                            has had a complete vaccination with the ${vaccinationRecord.vaccinationType} vaccine on ${date}`}
                        </span>
                        <CheckOutlined style={{fontSize: '30px', color: 'green'}} />
                    </div>
                    :
                    vaccinationRecord.vaccinationStatus === VACCINE_STATE.Partial
                    ?
                    <div>
                        <span style={{color: "#0E5F76"}}>
                            {`${vaccinationRecord.patientFirstName} ${vaccinationRecord.patientLastName} 
                            has had a partial vaccination with the ${vaccinationRecord.vaccinationType} vaccine on ${date}`}
                        </span>
                        <RiseOutlined style={{fontSize: '30px', color: '#FDC500'}} />
                    </div>
                    :
                    vaccinationRecord.vaccinationStatus === VACCINE_STATE.NoVaccination
                    ?
                    <div>
                        <span style={{color: "#0E5F76"}}>Code not found</span>
                        <CloseOutlined style={{fontSize: '30px', color: 'red'}} />
                    </div>
                    :
                    error
                    ?
                    <div style={{textAlign: 'center'}}>Error loading data. Please try refreshing page or contact support. </div>
                    :
                    <></>
                }
            </div>
        </div>
    );
};

export default CheckVaccStatus;

