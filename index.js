import express from 'express'
import {} from 'dotenv/config'
import config from './config.js';
import exphbs from 'express-handlebars'
import path from 'path';
import {fileURLToPath} from 'url';
import cors from 'cors'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
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
        result = result.sort(function (a, b) {
            if (a.nombre > b.nombre) {
              return 1;
            }
            if (a.nombre < b.nombre) {
              return -1;
            }
            // a must be equal to b
            return 0;
          })
        res.send(result)
    })
})
app.get('/register', (req, res) => {
    res.render('register')
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

app.listen(config.PORT, () => {
    console.log(`Servidor corriendo en el puerto: ${config.PORT}`)
  })