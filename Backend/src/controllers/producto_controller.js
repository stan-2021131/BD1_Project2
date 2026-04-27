import pool from "../connection/connection.js";

export const getProductos = async (req, res) => {
    try {
        //Obtiene todos los productos con su categoria mediante un JOIN
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
        //Obtiene los datos del producto
        const { producto, descripcion, stock, precio_compra, precio_venta, id_categoria } = req.body;

        //Verifica que se hayan enviado los datos necesarios
        if (!producto || !descripcion || !stock || !precio_compra || !precio_venta || !id_categoria) {
            return res.status(400).json({ message: 'Debe ingresar un producto, descripcion, stock, precio_compra, precio_venta y id_categoria' });
        }

        //Crea el producto
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
        //Obtiene el id del producto
        const { id } = req.params;
        //Obtiene los datos del producto
        const { producto, descripcion, stock, precio_compra, precio_venta, id_categoria } = req.body;

        //Verifica que se haya enviado un id
        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }
        //Verifica que se hayan enviado los datos necesarios
        if (!producto || !descripcion || stock === undefined || precio_compra === undefined || precio_venta === undefined || !id_categoria) {
            return res.status(400).json({ message: 'Debe ingresar un producto, descripcion, stock, precio_compra, precio_venta y id_categoria' });
        }

        //Actualiza el producto
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
    //Obtiene el id del producto
    const { id } = req.params;

    //Verifica que se haya enviado un id
    if (!id) {
        return res.status(400).json({ message: 'Debe ingresar un id' });
    }
    const client = await pool.connect();
    try {
        //Inicia la transacción
        await client.query('BEGIN');

        //Verifica que el producto exista
        const producto = await client.query(
            'SELECT id_producto FROM producto WHERE id_producto = $1',
            [id]
        );

        if (producto.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el producto' });
        }

        //Obtiene el id del producto eliminado
        const productoEliminado = await client.query(`
            SELECT id_producto FROM producto
            WHERE producto = 'Producto Eliminado'
        `);

        //Verifica que el producto no sea el producto eliminado
        if (productoEliminado.rows[0].id_producto === id) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No se puede eliminar el producto eliminado' });
        }

        //Actualiza el id_producto de las transacciones del producto a eliminar
        await client.query(
            'UPDATE detalle_transaccion SET id_producto = $1 WHERE id_producto = $2 RETURNING *',
            [productoEliminado.rows[0].id_producto, id]
        );

        //Elimina el producto
        const result = await client.query(
            'DELETE FROM producto WHERE id_producto = $1 RETURNING *',
            [id]
        );

        //Confirma la transacción
        await client.query('COMMIT');

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });

    } catch (error) {
        //Revierte la transacción si hay un error
        if (client) await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
    finally {
        client.release();
    }
}