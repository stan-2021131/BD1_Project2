import { Router } from "express";
import { getCompra, getVenta, detalleCompra, detalleVenta, crearCompra, crearVenta, anularCompra, anularVenta } from "../controllers/compra_venta_controller.js";

const router = Router();

router.get('/compra', getCompra);
router.get('/venta', getVenta);
router.get('/venta/:id', detalleVenta);
router.get('/compra/:id', detalleCompra);
router.post('/compra', crearCompra);
router.post('/venta', crearVenta);
router.put('/compra/:id', anularCompra);
router.put('/venta/:id', anularVenta);

export default router;