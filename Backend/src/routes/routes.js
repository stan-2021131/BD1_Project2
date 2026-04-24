import { Router } from "express";
import categoriaRoutes from "./categoria_routes.js";
import rolRoutes from "./rol_routes.js";
import formaPagoRoutes from "./forma_pago_routes.js";
import personaRoutes from "../routes/persona_routes.js"
import proveedorRoutes from "../routes/proveedor_routes.js";
import clienteRoutes from "../routes/cliente_routes.js";

const router = Router();

router.get('/test', (req, res) => {
    res.send("Backend funcionando");
});

router.use('/categoria', categoriaRoutes);
router.use('/rol', rolRoutes);
router.use('/forma_pago', formaPagoRoutes);
router.use('/persona', personaRoutes);
router.use('/proveedor', proveedorRoutes);
router.use('/cliente', clienteRoutes);

export default router;