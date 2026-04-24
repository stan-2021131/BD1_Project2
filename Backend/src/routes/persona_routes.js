import { Router } from "express";
import { getPersonas, createPersona, updatePersona, deletePersona } from "../controllers/persona_controller.js";

const router = Router();

router.get('/', getPersonas);
router.post('/', createPersona);
router.put('/:id', updatePersona);
router.delete('/:id', deletePersona);

export default router;
