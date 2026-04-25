import pool from "../connection/connection.js";

export const getProductos = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM producto INNER JOIN categoria ON producto.id_categoria = categoria.id_categoria');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
}

export const createProducto = async (req, res) => {
    try {
        const { producto, descripcion, stock, precio_compra, precio_venta, id_categoria } = req.body;

        if (!producto || !descripcion || !stock || !precio_compra || !precio_venta || !id_categoria) {
            return res.status(400).json({ message: 'Debe ingresar un producto, descripcion, stock, precio_compra, precio_venta y id_categoria' });
        }

        const result = await pool.query('INSERT INTO producto (producto, descripcion, stock, precio_compra, precio_venta, id_categoria) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [producto, descripcion, stock, precio_compra, precio_venta, id_categoria]);
        res.status(201).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
}

export const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { producto, descripcion, stock, precio_compra, precio_venta, id_categoria } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }
        if (!producto || !descripcion || stock === undefined || precio_compra === undefined || precio_venta === undefined || !id_categoria) {
            return res.status(400).json({ message: 'Debe ingresar un producto, descripcion, stock, precio_compra, precio_venta y id_categoria' });
        }

        const result = await pool.query('UPDATE producto SET producto = $1, descripcion = $2, stock = $3, precio_compra = $4, precio_venta = $5, id_categoria = $6 WHERE id_producto = $7 RETURNING *', [producto, descripcion, stock, precio_compra, precio_venta, id_categoria, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró el producto' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
}

export const deleteProducto = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Debe ingresar un id' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const producto = await client.query(
            'SELECT id_producto FROM producto WHERE id_producto = $1',
            [id]
        );

        if (producto.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el producto' });
        }

        const productoEliminado = await client.query(`
            SELECT id_producto FROM producto
            WHERE producto = 'Producto Eliminado'
        `);

        if (productoEliminado.rows[0].id_producto === id) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No se puede eliminar el producto eliminado' });
        }

        await client.query(
            'UPDATE detalle_transaccion SET id_producto = $1 WHERE id_producto = $2 RETURNING *',
            [productoEliminado.rows[0].id_producto, id]
        );

        const result = await client.query(
            'DELETE FROM producto WHERE id_producto = $1 RETURNING *',
            [id]
        );

        await client.query('COMMIT');

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });

    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
    finally {
        client.release();
    }
}