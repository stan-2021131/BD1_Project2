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
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Debe ingresar un id' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const proveedor = await client.query(
            'SELECT id_proveedor FROM proveedor WHERE id_proveedor = $1',
            [id]
        );

        if (proveedor.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: 'No se encontró el proveedor' });
        }

        const proveedorEliminado = await client.query(`
            SELECT id_proveedor FROM proveedor
            WHERE proveedor = 'Proveedor Eliminado'
        `);

        if (proveedorEliminado.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(500).json({ message: 'No se encontró el proveedor eliminado' });
        }

        await client.query(
            'UPDATE compra SET id_proveedor = $1 WHERE id_proveedor = $2',
            [proveedorEliminado.rows[0].id_proveedor, id]
        );

        const result = await client.query(
            'DELETE FROM proveedor WHERE id_proveedor = $1 RETURNING *',
            [id]
        );

        await client.query('COMMIT');

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el proveedor' });
    } finally {
        client.release();
    }
}