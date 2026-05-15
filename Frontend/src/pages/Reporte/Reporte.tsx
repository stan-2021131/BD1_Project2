import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../../services/Api";

import ReportCard from "../../components/Card/ReporteCard";

import TopProductosChart from "../../components/Charts/TopProductosChart";
import ClientesChart from "../../components/Charts/ClienteChart";
import VentasChart from "../../components/Charts/VentasChart";

import "./style.css";

const Reportes = () => {

    const [productos, setProductos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [ventas, setVentas] = useState([]);

    // CSV
    const descargarCSV = (data, nombreArchivo) => {
        if (!data || data.length === 0) return;

        const headers = Object.keys(data[0]);

        const csv = [
            headers.join(","),
            ...data.map(row =>
                headers.map(h => `"${row[h]}"`).join(",")
            )
        ].join("\n");

        const blob = new Blob(
            [csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = `${nombreArchivo}.csv`;

        link.click();
    };

    // FETCH REPORTES
    const fetchProductos = useCallback(async () => {
        const res = await api.get(
            "reporte/productos-mas-vendidos"
        );

        setProductos(res.data);
    }, []);

    const fetchClientes = useCallback(async () => {
        const res = await api.get(
            "reporte/clientes-con-compras"
        );

        setClientes(res.data);
    }, []);

    const fetchVentas = useCallback(async () => {
        const res = await api.get(
            "reporte/ventas-totales"
        );

        setVentas(res.data);
    }, []);

    // LOAD DATA
    useEffect(() => {
        fetchProductos();
        fetchClientes();
        fetchVentas();
    }, [
        fetchProductos,
        fetchClientes,
        fetchVentas
    ]);

    // KPIs
    const totalVentas = useMemo(() => {
        return ventas.reduce(
            (acc, venta) => acc + Number(venta.total),
            0
        );
    }, [ventas]);

    const totalVentasFormatted = useMemo(() => {
        return new Intl.NumberFormat(
            "es-GT",
            {
                style: "currency",
                currency: "GTQ"
            }
        ).format(totalVentas);
    }, [totalVentas]);

    const totalClientes = useMemo(() => {
        return clientes.length;
    }, [clientes]);

    const totalProductos = useMemo(() => {
        return productos.reduce(
            (acc, producto) =>
                acc + Number(producto.total_vendido),
            0
        );
    }, [productos]);

    const productoTop = useMemo(() => {
        if (productos.length === 0) {
            return "N/A";
        }

        return productos[0].producto;
    }, [productos]);

    const clienteTop = useMemo(() => {
        if (clientes.length === 0) {
            return "N/A";
        }

        return clientes[0].nombre;
    }, [clientes]);

    // DOWNLOADS
    const handleProductos = () => {
        const formatted = productos.map(p => ({
            Producto: p.producto,
            Total_Vendido: Number(p.total_vendido)
        }));

        descargarCSV(
            formatted,
            "productos_mas_vendidos"
        );
    };

    const handleClientes = () => {
        const formatted = clientes.map(c => ({
            Nombre: c.nombre,
            NIT: c.nit,
            Total_Ventas: c.total_ventas
        }));

        descargarCSV(
            formatted,
            "clientes_con_compras"
        );
    };

    const handleVentas = () => {
        const formatted = ventas.map(v => ({
            Mes: v.fecha,
            Total: v.total
        }));

        descargarCSV(
            formatted,
            "ventas_totales"
        );
    };

    return (
        <div className="reportes-container fade-in">

            <h2>Reportes</h2>

            {/* KPI CARDS */}
            <div className="kpi-grid">

                <div className="kpi-card">
                    <h4>Total Ventas</h4>
                    <p>{totalVentasFormatted}</p>
                </div>

                <div className="kpi-card">
                    <h4>Clientes Activos</h4>
                    <p>{totalClientes}</p>
                </div>

                <div className="kpi-card">
                    <h4>Productos Vendidos</h4>
                    <p>{totalProductos}</p>
                </div>

                <div className="kpi-card">
                    <h4>Producto Más Vendido</h4>
                    <p>{productoTop}</p>
                </div>

                <div className="kpi-card">
                    <h4>Cliente Frecuente</h4>
                    <p>{clienteTop}</p>
                </div>

            </div>

            {/* REPORTES */}
            <div className="reportes-grid">

                <ReportCard
                    title="Productos más vendidos"
                    onDownload={handleProductos}
                >
                    <TopProductosChart
                        data={productos}
                    />
                </ReportCard>

                <ReportCard
                    title="Clientes con compras"
                    onDownload={handleClientes}
                >
                    <ClientesChart
                        data={clientes}
                    />
                </ReportCard>

                <ReportCard
                    title="Ventas Totales"
                    onDownload={handleVentas}
                >
                    <VentasChart
                        data={ventas}
                    />
                </ReportCard>

            </div>

        </div>
    );
};

export default Reportes;