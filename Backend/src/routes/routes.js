import { Router } from "express";
import categoriaRoutes from "./categoria_routes.js";
import rolRoutes from "./rol_routes.js";

const router = Router();

router.get('/test', (req, res) => {
    res.send("Backend funcionando");
});

router.use('/categoria', categoriaRoutes);
router.use('/rol', rolRoutes);

export default router;