import { useState } from "react";

const useAlert = () => {
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const showSuccess = (message: string) => {
        setError("");
        setSuccess(message);

        setTimeout(() => {
            setSuccess("");
        }, 3000);
    };

    const showError = (message: string) => {
        setSuccess("");
        setError(message);

        setTimeout(() => {
            setError("");
        }, 3000);
    };

    const clearAlerts = () => {
        setSuccess("");
        setError("");
    };

    return {
        success,
        error,
        showSuccess,
        showError,
        clearAlerts,
    };
};

export default useAlert;