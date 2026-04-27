import pool from "../connection/connection.js";

export const productosMasVendidos = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.producto, SUM(dt.cantidad) as total_vendido
            FROM venta v
            JOIN detalle_transaccion dt ON v.id_transaccion = dt.id_transaccion
            JOIN producto p ON dt.id_producto = p.id_producto
            GROUP BY p.producto
            ORDER BY total_vendido DESC
            LIMIT 10
        `);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos más vendidos' });
    }
}

export const clientesConCompras = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.nombre nombre, c.nit nit, COUNT(v.id_transaccion) total_compras
            FROM cliente c
            INNER JOIN persona p ON c.id_persona = p.id_persona
            INNER JOIN venta v ON c.id_cliente = v.id_cliente
            GROUP BY p.nombre, c.nit
            ORDER BY total_compras DESC
            LIMIT 10
        `);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron clientes' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los clientes con compras' });
    }
}

export const ventasTotales = async (req, res) => {
    try {
        const result = await pool.query(`
            WITH ventas_totales AS (
                SELECT id_transaccion, SUM(cantidad * precio_unitario) AS total
                FROM detalle_transaccion
                GROUP BY id_transaccion
            )
            SELECT * FROM ventas_totales
        `);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ventas' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las ventas totales' });
    }
}