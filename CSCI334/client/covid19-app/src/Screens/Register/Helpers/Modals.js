import history from '../../../_helpers/history';
import PATH from '../../../_constants/paths';
import { Modal } from 'antd';

export const registerSuccessModal = name => {
    const content = `Welcome to COVID Guard, ${name}. You can now login with your new details!`;
    Modal.info({
        title: 'Registration Success!',
        content: <p>{content}</p>,
        onOk: () => { history.push(PATH.login); }
    });
}
