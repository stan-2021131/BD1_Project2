import pool from "../connection/connection.js";

export const getFormasPago = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM forma_pago');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron formas de pago' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las formas de pago' });
    }
}

export const createFormaPago = async (req, res) => {
    try {
        const { forma_pago } = req.body;

        if (!forma_pago) {
            return res.status(400).json({ message: 'Debe ingresar una forma de pago' });
        }

        const result = await pool.query('INSERT INTO forma_pago (forma_pago) VALUES ($1) RETURNING *', [forma_pago]);
        res.status(201).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la forma de pago' });
    }
}

export const updateFormaPago = async (req, res) => {
    try {
        const { id } = req.params;
        const { forma_pago } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }
        if (!forma_pago) {
            return res.status(400).json({ message: 'Debe ingresar una forma de pago' });
        }

        const result = await pool.query('UPDATE forma_pago SET forma_pago = $1 WHERE id_forma = $2 RETURNING *', [forma_pago, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró la forma de pago' });
        }

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la forma de pago' });
    }
}

export const deleteFormaPago = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }

        const result = await pool.query('DELETE FROM forma_pago WHERE id_forma = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró la forma de pago' });
        }

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la forma de pago' });
    }
}