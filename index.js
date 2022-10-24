import { createRequire } from "module"; // Bring in the ability to create the 'require' method
const require = createRequire(import.meta.url); // construct the require method
import express from 'express'
import cors from 'cors'
import os from 'os'
import cluster from 'cluster'
import config from './config.js';
import exphbs from 'express-handlebars'
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const numCPUs = os.cpus().length;
const app = express()
const { Server: HttpServer } = require('http')
const httpServer = new HttpServer(app)
import {listarALL, crearProducto,actualizarProducto, borrarProducto } from './mongoDb.js'
app.use(express.static('views'))
app.engine("hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: null,
    layoutsDir: __dirname + "/views",
    partialsDir: __dirname + "/views"
}))
app.set("views", "./views");
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(cors());
app.get('/', (req, res) => {
    listarALL().then(result => {
        res.render('home', {result})
    })
})
app.get('/productos', (req, res) => {
    listarALL().then(result => {
        res.send(result)
    })
})
app.get('/register', (req, res) => {
    res.render('nuevoproducto')
})
app.post('/producto', (req, res) => {
    crearProducto(req.body).then(result =>{
    res.redirect('/')
    })
})
app.put('/producto/:id', (req, res) => {
    actualizarProducto(req.body,req.params.id).then(result =>{
    res.render('home',{result})
    })
})
app.delete('/producto/:id', (req, res) => {
    borrarProducto(req.params.id).then(result =>{
    res.render('home',{result})
    })
})
if (cluster.isMaster && config.CLUSTER == "on" ){
    console.log(`Master ${process.pid} is running`)
    for (let i = 0; i < numCPUs; i++){
        cluster.fork();
    }
    cluster.on('exit',(worker,code,signal)=>{
        console.log(`worker ${worker.process.pid} diedd`)
        cluster.fork()
    })

}else{
    const connectedServer = httpServer.listen(config.PORT, () => {
        console.log(`Servidor escuchando en el puerto ${config.PORT} - PID WORKER ${process.pid}`)
    })
    connectedServer.on('error', error => console.log(`Error en el servidor ${error}`))
}