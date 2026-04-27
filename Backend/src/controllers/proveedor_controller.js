import pool from "../connection/connection.js";

export const getProveedores = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM proveedor');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron proveedores' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los proveedores' });
    }
}

export const createProveedor = async (req, res) => {
    try {
        const { proveedor, direccion, contacto } = req.body;

        if (!proveedor || !direccion || !contacto) {
            return res.status(400).json({ message: 'Debe ingresar todos los datos' });
        }

        const result = await pool.query('INSERT INTO proveedor (proveedor, direccion, contacto) VALUES ($1, $2, $3) RETURNING *', [proveedor, direccion, contacto]);
        res.status(201).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el proveedor' });
    }
}

export const updateProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { proveedor, direccion, contacto } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }
        if (!proveedor || !direccion || !contacto) {
            return res.status(400).json({ message: 'Debe ingresar todos los datos' });
        }

        const result = await pool.query('UPDATE proveedor SET proveedor = $1, direccion = $2, contacto = $3 WHERE id_proveedor = $4 RETURNING *', [proveedor, direccion, contacto, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró el proveedor' });
        }

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el proveedor' });
    }
}

export const deleteProveedor = async (req, res) => {
    //Obtiene el id del proveedor
    const { id } = req.params;

    //Verifica que se haya enviado un id
    if (!id) {
        return res.status(400).json({ message: 'Debe ingresar un id' });
    }

    const client = await pool.connect();

    try {
        //Inicia la transacción
        await client.query('BEGIN');

        //Verifica que el proveedor exista
        const proveedor = await client.query(
            'SELECT id_proveedor FROM proveedor WHERE id_proveedor = $1',
            [id]
        );

        if (proveedor.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el proveedor' });
        }

        //Obtiene el id del proveedor eliminado
        const proveedorEliminado = await client.query(`
            SELECT id_proveedor FROM proveedor
            WHERE proveedor = 'Proveedor Eliminado'
        `);

        if (proveedorEliminado.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(500).json({ message: 'No se encontró el proveedor eliminado' });
        }

        //Verifica que el proveedor no sea el proveedor eliminado
        if (proveedorEliminado.rows[0].id_proveedor === id) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'No se puede eliminar el proveedor eliminado' });
        }

        //Actualiza el id_proveedor de las compras del proveedor a eliminar
        await client.query(
            'UPDATE compra SET id_proveedor = $1 WHERE id_proveedor = $2',
            [proveedorEliminado.rows[0].id_proveedor, id]
        );

        //Elimina el proveedor
        const result = await client.query(
            'DELETE FROM proveedor WHERE id_proveedor = $1 RETURNING *',
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
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el proveedor' });
    } finally {
        client.release();
    }
}