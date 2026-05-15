import "./style.css";

type Props = {
    title: string;
    children: React.ReactNode;
    onDownload: () => void;
};

const ReportCard = ({
    title,
    children,
    onDownload
}: Props) => {
    return (
        <div className="report-card">

            <div className="report-card-header">
                <h3>{title}</h3>

                <button
                    className="report-download-btn"
                    onClick={onDownload}
                >
                    Descargar CSV
                </button>
            </div>

            <div className="report-card-content">
                {children}
            </div>

        </div>
    );
};

export default ReportCard;