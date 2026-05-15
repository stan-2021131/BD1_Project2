import pool from "../connection/connection.js";

export const productosMasVendidos = async (req, res) => {
    try {
        //Obtiene los productos más vendidos utilizando una agrupación por producto y ordenado por cantidad vendida
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

export const clientesConVentas = async (req, res) => {
    try {
        //Obtiene los clientes con más ventas utilizando una agrupación por cliente y subconsulta para verificar que tenga ventas
        const result = await pool.query(`
            SELECT 
                p.nombre AS nombre, 
                c.nit AS nit, 
                COUNT(v.id_transaccion) AS total_ventas
            FROM cliente c
            INNER JOIN persona p ON c.id_persona = p.id_persona
            INNER JOIN venta v ON c.id_cliente = v.id_cliente
            WHERE EXISTS (
                SELECT 1 
                FROM venta v2 
                WHERE v2.id_cliente = c.id_cliente
            )
            GROUP BY p.nombre, c.nit
            ORDER BY total_ventas DESC
            LIMIT 10
        `);

        //Verifica que se hayan encontrado clientes
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron clientes' });
        }

        //Retorna los clientes
        res.status(200).json({
            ok: true,
            data: result.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los clientes con ventas' });
    }
};

export const ventasTotales = async (req, res) => {
    try {
        //Obtiene las ventas totales utilizando CTE con with
        const result = await pool.query(`
            WITH ventas_totales AS (
                SELECT 
                    DATE_TRUNC('month', t.fecha) AS mes,
                    SUM(dt.cantidad * dt.precio_unitario) AS total
                FROM detalle_transaccion dt
                JOIN transaccion t
                    ON dt.id_transaccion = t.id_transaccion
                JOIN venta v
                    ON t.id_transaccion = v.id_transaccion
                GROUP BY mes
            )

            SELECT *
            FROM ventas_totales
            ORDER BY mes;
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