import { Modal } from 'antd';

export const changePasswordSuccessModal = () => {
    Modal.success({
        title: "Success!",
        content: "Password changed successfully!",
        onOk(){ window.location.reload() }
    })
}

export const somethingWentWrongModal = () => {
    Modal.error({
        title: "Opps!",
        content: "Something went wrong. Please try again or contact support.",
        onOk(){ window.location.reload() }
    })
}