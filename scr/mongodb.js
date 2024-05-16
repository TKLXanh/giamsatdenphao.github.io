const express = require("express");
const { MongoClient, ServerApiVersion } = require('mongodb');



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } catch (error) {
//     console.error("Connecting false!!!", error);
//   }
// }

// run().catch(console.dir);

async function getDataFromDatabase() {
    try {
      // Kết nối đến cơ sở dữ liệu MongoDB
      await client.connect();
  
      // Chọn bộ sưu tập (collection) cụ thể bạn muốn truy vấn
      const collection = client.db("DENPHAO").collection("UserAccounts");
  
      // Thực hiện truy vấn để lấy dữ liệu từ bộ sưu tập
      const result = await collection.find({ /* Điều kiện truy vấn */ }).toArray();
  
      // In dữ liệu đã lấy được
      console.log("Dữ liệu từ cơ sở dữ liệu:");
      accountListDB = result;
      console.log(accountListDB);
    } catch(error) {
        console.error(error);
    }
  }
  
  // Gọi hàm để thực hiện lấy dữ liệu
  getDataFromDatabase().catch(console.error);
  

  module.exports = accountListDB;