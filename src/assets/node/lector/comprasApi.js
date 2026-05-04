import { Router } from "express";
import ServerModel from "../server.js";

const router = Router();

// 
router.post("/compras", async (req, res) => {

    const { libroID, userID, cantidad } = req.body; // Obtener los datos del cuerpo de la solicitud
    
    try {
        // Crear un nuevo objeto de compra
        const nuevaCompra = new ServerModel.Compra({
            libroID,
            userID,
            cantidad,
        });
    
        // Guardar la compra en la base de datos
        await nuevaCompra.save();
    
        res.status(201).json({ message: "Compra realizada con éxito", compra: nuevaCompra });
    } catch (error) {
        res.status(500).json({ message: "Error al realizar la compra", error });
    }
});

export default router;