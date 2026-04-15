import express from "express";

const app = express();

app.get('/', (req, res) => {
    res.send("Backend funcionando");
});

app.listen(3000, ()=>{
    console.log("Server corriendo en puerto 3000")
})