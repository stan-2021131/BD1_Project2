import { api } from "../../services/Api";
import "./style.css";

const Reportes = () => {

    const descargarCSV = (data, nombreArchivo) => {
        if (!data || data.length === 0) return;

        const headers = Object.keys(data[0]);

        const csv = [
            headers.join(","), // encabezados
            ...data.map(row =>
                headers.map(h => `"${row[h]}"`).join(",")
            )
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${nombreArchivo}.csv`;
        link.click();
    };

    const handleProductos = async () => {
        const res = await api.get("reporte/productos-mas-vendidos");

        const formatted = res.data.map(p => ({
            Producto: p.producto,
            Total_Vendido: p.total_vendido
        }));

        descargarCSV(formatted, "productos_mas_vendidos");
    };

    const handleClientes = async () => {
        const res = await api.get("reporte/clientes-con-compras");

        const formatted = res.data.map(c => ({
            Nombre: c.nombre,
            NIT: c.nit,
            Total_Ventas: c.total_ventas
        }));

        descargarCSV(formatted, "clientes_con_compras");
    };

    const handleVentas = async () => {
        const res = await api.get("reporte/ventas-totales");

        const formatted = res.data.map(v => ({
            ID_Transaccion: v.id_transaccion,
            Total: v.total
        }));

        descargarCSV(formatted, "ventas_totales");
    };

    return (
        <div className="reportes-container">

            <h2>Reportes</h2>

            <div className="reportes-grid">

                <div className="reporte-card">
                    <h3>Productos más vendidos</h3>
                    <button onClick={handleProductos}>
                        Descargar CSV
                    </button>
                </div>

                <div className="reporte-card">
                    <h3>Clientes con compras</h3>
                    <button onClick={handleClientes}>
                        Descargar CSV
                    </button>
                </div>

                <div className="reporte-card">
                    <h3>Ventas totales</h3>
                    <button onClick={handleVentas}>
                        Descargar CSV
                    </button>
                </div>

            </div>

        </div>
    );
};

export default Reportes;