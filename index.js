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
        const reviewsCollection = database.collection('reviews');
        const usersCollection = database.collection('users');

        //GET API
        app.get('/products', async(req, res)=>{
            const cursor = productsCollection.find()
            const product = await cursor.toArray();
            res.send(product);
        })
        //GET API for show ALl orders
        app.get('/orders', async(req,res)=>{
            const cursor = ordersCollection.find();
            const orders = await cursor.toArray();
            res.send(orders);
        })
        //GET API for review
        app.get('/reviews', async(req, res)=>{
            const cursor = reviewsCollection.find();
            const reviews = await cursor.toArray();
            res.send(reviews)
        })
        //GET Orders by email
        app.get('/orders/:email', async(req, res)=>{
            const email = req.query.email;
            const query = {email: email}
            const cursor = ordersCollection.find(query)
            const product = await cursor.toArray();
            res.json(product);
        })

        //GET Single Product
        app.get('/products/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productsCollection.findOne(query);
            res.json(product);
        })

        //Get API for admin 
        app.get('/users/:email', async(req,res)=>{
            const email = req.params.email;
            const query = {email: email}
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if(user?.role === 'admin'){
                isAdmin = true;
            }
            res.json({admin: isAdmin})
        })

        //POST API 
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            // console.log(result)
            res.json(result)
        })
        //POST API for save User 
        app.post('/users', async(req, res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            // console.log(result);
            res.json(result)
        })
        //POST API for user review
        app.post('/reviews', async(req,res)=>{
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            // console.log(result)
            res.json(result);
        })

        //POST API for add product
        app.post('/products', async(req, res)=>{
            const product =  req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result)
        })

        //Update & set admin 

        app.put('/users', async(req, res)=>{
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set: {role: 'admin'}};
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result)
        })

        //Delete API for admin delete product
        app.delete('/products/:id', async(req,res)=>{
            const id = req.params.id;
            // console.log('delete product by id', id)
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            // console.log(result)
            res.json(result);
        })

        // Delete API for user cancel order
        app.delete('/orders/:id', async(req,res)=>{
            const id = req.params.id;
            // console.log('delete product by id', id)
            const query = {_id: ObjectId(id)};
            const result = await ordersCollection.deleteOne(query);
            // console.log(result)
            res.json(result);
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