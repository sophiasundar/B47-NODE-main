// const express = require('express')
// const { MongoClient } = require('mongodb');
import  express  from "express";
import { MongoClient } from "mongodb";
const app = express()
const PORT = 8000;

// Mongodb Connection
// three methods for this mongodb connection
        // mongodb://localhost
        // mongodb://localhost:27017
        // mongodb://0.0.0.0:27017   protocol

const MONGO_URL = "mongodb://0.0.0.0:27017";

async function createConnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect();  
    console.log("Mongodb is Connected");
    return client; 
}
const client = await createConnection()
// express.json() act like an inteceptor / converting body to the json / inbuilt middleware
app.use(express.json());
  
// / REST api the endpoint
    app.get('/',(req, res)=> {  
    res.send('Hello World hi👋🌏')
    })

        app.get('/products', async(req, res)=> {  
            const { product_material, product_color, product_price } = req.query;
            console.log(req.query,product_material);
            // console.log(req.query,product_color);
            // let filteredProducts = products;
            //  if (product_material){
            //     // call by reference  filtered products is reference
            //     filteredProducts = products.filter((pd)=> pd.product_material == product_material)
            //  }
            //  if (product_color){
            //     // call by reference
            //     filteredProducts = products.filter((pd)=> pd.product_color == product_color)   
            //  } 
                // if (product_price){
                //     // call by reference
                //     filteredProducts = products.filter((pd)=> pd.product_price == product_price)   
                //  } 

                 if (req.query.product_price){
                    req.query.product_price = +req.query.product_price
                    
                 } 

            const product = await  client.db("items").collection("products").find(req.query).toArray();
            res.send(product)
        })

            app.get('/products/:id', async(req, res)=> {  
                const { id } = req.params;
                console.log(req.params, "ID=", id);
                // db.products.findOne({id:"1"})
                // const product = products.find((pd)=> pd.id == id)[0];
                const product = await client
                  .db("items")
                  .collection("products")
                  .findOne({ id: id });
               product
                 ? res.send(product)
                 : res.status(404).send({ message: "No Products Found" });
            }); 

            // delete the product by id
            app.delete('/products/:id', async(req, res)=> {  
                const { id } = req.params;
                console.log(req.params, "ID=", id);
               
                const product = await client
                  .db("items")
                  .collection("products")
                  .deleteOne({ id: id });
                  res.send(product)
                 
            }); 

            // add products   for add products need to include the middleware called express.json()
             app.post('/products', async(req, res)=> {  
                const newProduct = req.body;
                console.log(newProduct)
                const result = await client
                  .db("items")
                  .collection("products")
                  .insertMany(newProduct);
                  res.send(result)
                 
            }); 
             
  
app.listen(PORT, ()=> 
console.log("Server started on the PORT", PORT)
)