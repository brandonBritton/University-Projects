import {Modal} from 'antd'; 

export const confirmationSuccessModal = email => {
    const content = `Patient with email: ${email} was successfully marked positive`;
    Modal.info({
        title: 'Success!',
        content: <p>{content}</p>,
        onOk: () => { window.location.reload() }
    });
}

export const somethingWentWrongModal = () => {
    Modal.info({
        title: 'Something went wrong!',
        content: <p>Please try again or contact support.</p>,
        onOk: () => { window.location.reload() }
    });
}
