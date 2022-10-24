import mongoose from 'mongoose'
const url = 'mongodb+srv://tomas22:1roZJIVtj5JnG5HH@cluster0.cycnd1i.mongodb.net/?retryWrites=true&w=majority'
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
         return productos
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
    let productoUpdate = await Producto.updateOne(
        { id_: id },
        { $set: elem }
      );
      return productoUpdate;
}
async function borrarProducto(id) {
    await conectDB()
    let elemDelete = await Producto.deleteOne({ _id: id });
        return elemDelete;
}

export {listarALL,crearProducto,actualizarProducto,borrarProducto}