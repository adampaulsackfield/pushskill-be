const dotenv = require("dotenv");

dotenv.config();

const { MongoClient } = require("mongodb");

MongoClient.connect(process.env.DB_URI, async (err, client) => {
  const db = client.db();
  const users = db.collection("users");
  const results = await users.find().toArray();
  console.log(results);
  client.close();
});
