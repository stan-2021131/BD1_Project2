import pool from "../connection/connection.js";

export const getRoles = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rol');
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron roles' });
        }
        res.status(200).json({
            ok: true,
            data: result.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los roles' });
    }
}

export const createRol = async (req, res) => {
    try {
        const { rol } = req.body;
        const result = await pool.query('INSERT INTO rol (rol) VALUES ($1) RETURNING *', [rol]);
        res.status(201).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el rol' });
    }
}

export const updateRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }
        if (!rol) {
            return res.status(400).json({ message: 'Debe ingresar un rol' });
        }

        const result = await pool.query('UPDATE rol SET rol = $1 WHERE id_rol = $2 RETURNING *', [rol, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró el rol' });
        }

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el rol' });
    }
}

export const deleteRol = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Debe ingresar un id' });
        }

        const result = await pool.query('DELETE FROM rol WHERE id_rol = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'No se encontró el rol' });
        }

        res.status(200).json({
            ok: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el rol' });
    }
}