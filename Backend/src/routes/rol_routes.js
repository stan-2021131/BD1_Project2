import { Router } from "express";
import { getRoles, createRol, updateRol, deleteRol } from "../controllers/rol_controller.js";

const router = Router();

router.get('/', getRoles);
router.post('/', createRol);
router.put('/:id', updateRol);
router.delete('/:id', deleteRol);

export default router;
