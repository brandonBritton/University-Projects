import { Modal } from 'antd';

export const successModal = () => {
    Modal.success({
        title: "Success!",
        content: "The clinic was added successfully!",
        onOk(){window.location.reload()}
    });
}

export const somethingWentWrongModal = () => {
    Modal.error({
        title: "Oops!",
        content: "Something went wrong! Please try again or contact support.",
        onOk(){window.location.reload()}
    });
}