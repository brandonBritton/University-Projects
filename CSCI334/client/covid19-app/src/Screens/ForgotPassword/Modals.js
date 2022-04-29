import { Modal } from 'antd';
import history from '../../_helpers/history';
import PATH from '../../_constants/paths';

export const forgotPasswordModal = email => {
    const content = `If you can't find the email, please check your spam folder or contact support. 
    You will now be redirected to login. After you login you will then be redirected to change your password.`;
    Modal.info({
        title: `We have sent a temporary password to ${email}`,
        content: <p>{content}</p>,
        onOk: () => { history.push(PATH.login); }
    });
}