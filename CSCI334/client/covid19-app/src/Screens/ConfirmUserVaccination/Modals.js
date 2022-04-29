import {Modal} from 'antd'; 

export const confirmationSuccessModal = email => {
    const content = `Vaccinaction record updated for patient with email: ${email}`;
    Modal.info({
        title: 'Vaccination Confirmation Successful!',
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
