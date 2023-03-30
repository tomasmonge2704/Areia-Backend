import mongoose from 'mongoose'
const url = process.env.MONGO_DB;
console.log(process.env.MONGO_DB)
const Producto = mongoose.model('Productos', new mongoose.Schema({ nombre: String, precio: Number,descripcion:String,categoria:String }));
//conectar a la BDD
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
async function conectDB() {
    await mongoose.connect(url,connectionParams);
    console.log("connected")
}
async function listarALL() {
    await conectDB()
    try {
        const productos = await Producto.find({}).lean();
         return productos.sort(function (a, b) {
            if (a.categoria > b.categoria) {
              return 1;
            }
            if (a.categoria < b.categoria) {
              return -1;
            }
            // a must be equal to b
            return 0;
          })
    } catch (error) {
      return undefined;
    }
}
async function crearProducto(elem) {
    await conectDB()
    const e = await new Producto(elem).save();
          return e;
}
async function actualizarProducto(elem,id) {
    await conectDB()
    let productoUpdate = await new Producto(elem).save();
      await Producto.deleteOne({ _id: id });
      return productoUpdate;
}
async function borrarProducto(id) {
    await conectDB()
    let elemDelete = await Producto.deleteOne({ _id: id });
        return elemDelete;
}

export {listarALL,crearProducto,actualizarProducto,borrarProducto}