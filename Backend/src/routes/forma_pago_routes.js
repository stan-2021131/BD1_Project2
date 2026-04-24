import { Router } from "express";
import { getFormasPago, createFormaPago, updateFormaPago, deleteFormaPago } from "../controllers/forma_pago_controller.js";

const router = Router();

router.get('/', getFormasPago);
router.post('/', createFormaPago);
router.put('/:id', updateFormaPago);
router.delete('/:id', deleteFormaPago);

export default router;
