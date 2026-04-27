import { Router } from "express";
import { productosMasVendidos, clientesConCompras, ventasTotales } from "../controllers/reporte_controller.js";

const router = Router();

router.get('/productos-mas-vendidos', productosMasVendidos);
router.get('/clientes-con-compras', clientesConCompras);
router.get('/ventas-totales', ventasTotales);

export default router;