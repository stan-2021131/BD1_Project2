import "./style.css";

type Props = {
    message: string;
    type?: "success" | "error";
};

const Alert = ({ message, type = "success" }: Props) => {
    return (
        <div className={`alert ${type}`}>
            <span className="text">{message}</span>
        </div>
    );
};

export default Alert;
