import { Modal } from 'antd';

export const somethingWentWrongModal = () => {
    Modal.error({
        title: "Oops!",
        content: "Something went wrong! Please try again or contact support!",
        onOk(){ window.location.reload() }
    });
}