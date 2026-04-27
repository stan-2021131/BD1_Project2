import { Router } from "express";
import { productosMasVendidos, clientesConVentas, ventasTotales } from "../controllers/reporte_controller.js";

const router = Router();

router.get('/productos-mas-vendidos', productosMasVendidos);
router.get('/clientes-con-compras', clientesConVentas);
router.get('/ventas-totales', ventasTotales);

export default router;