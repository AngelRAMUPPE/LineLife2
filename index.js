const express = require('express');
const {MongoClient} = require('mongodb');
const bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectId;

const app = express();
const PORT = 3000;

const uri = 'mongodb+srv://angelram1:LineLife@cluster0.xnhphtv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));


//Ruta para servir la página HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
//Ruta para servir la página HTML
app.get('/registro', (req, res) => {
    res.sendFile(__dirname + '/registro.html');
});
app.get('/buscar', (req,res) => {
    res.sendFile(__dirname + '/buscar.html');
});

app.post('/registrar', async (req,res) => {
    const datos = req.body;
    console.log(datos);
    const client = new MongoClient(uri);

    try{
        client.connect();
        const database = client.db('linelife');
        const collection = database.collection('pulseras');
        const result = await collection.insertOne(datos);
        console.log('Se insertó un documento con el ID: ' + result.insertedId);
        res.json({ message: 'Registro Correcto!', redirect: '/' });
    }
    catch (error)
    {
        console.error('Error al insertar datos: ', error);
        res.status(500).send('Error al insertar datos');
    }
    finally
    {
        await client.close();
    }
});
app.get('/datos', async (req,res) => {
    const datos = req.query.id;
    
    const client = new MongoClient(uri);
    try{
        var o_id = new ObjectId(datos);
        client.connect();
        const database = client.db('linelife');
        const collection = database.collection('pulseras');
        const result = await collection.findOne({_id:o_id});
        if (result) {
            res.json(result);
            console.log(result);
          } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
          }
    }
    catch (error)
    {
    console.error(error);
    res.status(500).send('Error');
    }
    finally
    {
        await client.close();
    }
})

//Iniciar el servidor
app.listen(PORT, () =>
{
    console.log('Servidor corriendo en: http://localhost:' + PORT);
})
