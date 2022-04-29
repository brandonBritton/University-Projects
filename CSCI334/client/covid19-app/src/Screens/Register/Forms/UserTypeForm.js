import '../Register.css';
import { Radio, Form, Button } from 'antd';
import { layout } from '../Helpers/Layouts';
import USER_TYPE from '../../../_constants/userTypes';





export const UserTypeForm = props => {
    const setUserState = props.setUserState;





    return(
        <Form style={{marginTop: "5%"}} onFinish={setUserState}>
            <Form.Item {...layout} style={{marginBottom: '0px', paddingLeft: '37.5%'}}>
                <h1 style={{color: "#0E5F76"}}>Tell us who you are...</h1>
            </Form.Item>

            <Form.Item 
                style={{paddingLeft: '37.5%'}}
                {...layout}
                name="user"
                rules={[
                    {
                        required: true,
                        message: 'We need to know who you are'
                    }
                ]}
            >
                <Radio.Group>
                    <Radio className="register-radio" value={USER_TYPE.GENERAL}>Member of the public</Radio>
                    <Radio className="register-radio" value={USER_TYPE.HEALTH}>Registered health professional</Radio>
                    <Radio className="register-radio" value={USER_TYPE.BUSINESS}>Registered public venue owner</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item {...layout} style={{paddingLeft: '37.5%'}}>
                <Button type='primary' htmlType="submit">That's me</Button>
            </Form.Item>
        </Form>
    );
}

export default UserTypeForm;