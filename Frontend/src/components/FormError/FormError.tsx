import './style.css';

const FormError = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <div className="error-message">{message}</div>;
};

export default FormError;