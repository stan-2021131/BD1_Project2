import { Router } from "express";
import categoriaRoutes from "./categoria_routes.js";
import rolRoutes from "./rol_routes.js";
import formaPagoRoutes from "./forma_pago_routes.js";
import personaRoutes from "../routes/persona_routes.js"
import proveedorRoutes from "../routes/proveedor_routes.js";
import clienteRoutes from "../routes/cliente_routes.js";
import empleadoRoutes from "../routes/empleado_routes.js";
import productoRoutes from "../routes/productos_routes.js";

const router = Router();

router.get('/test', (req, res) => {
    res.json({ message: "Backend funcionando" });
});

router.use('/categoria', categoriaRoutes);
router.use('/rol', rolRoutes);
router.use('/forma_pago', formaPagoRoutes);
router.use('/persona', personaRoutes);
router.use('/proveedor', proveedorRoutes);
router.use('/cliente', clienteRoutes);
router.use('/empleado', empleadoRoutes);
router.use('/producto', productoRoutes);

export default router;