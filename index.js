const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000; 

//Middlewere 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qhwuq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('Royal-Wrists');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');
        const ratingsCollection = database.collection('ratings');

        //GET API
        app.get('/products', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email}
            const cursor = productsCollection.find({query})
            const product = await cursor.toArray();
            res.send(product);
        })
        //GET Orders by email
        app.get('/orders', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email}
            const cursor = ordersCollection.find({query})
            const product = await cursor.toArray();
            res.send(product);
        })
        //GET Single Product
        app.get('/products/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            res.json(product);
        })

        //POST API 
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            // console.log(result)
            res.json(result)
        })
    }
    finally{
        // await client.close()
    }
}

run().catch(console.dir)

app.get('/', (req, res)=>{
    res.send('Running Royal Wrists Server');
})

app.listen(port, ()=>{
    console.log('Running Royal Wrists Server on port', port)
})