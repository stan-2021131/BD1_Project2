import { Router } from "express";
import { getEmpleados, createEmpleado, updateEmpleado, deleteEmpleado, iniciarSesion } from "../controllers/empleado_controller.js";

const router = Router();

router.get('/', getEmpleados);
router.post('/', createEmpleado);
router.put('/:id', updateEmpleado);
router.delete('/:id', deleteEmpleado);
router.post('/login', iniciarSesion);

export default router;