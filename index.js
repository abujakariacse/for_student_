import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import "dotenv/config";
import { createRemoteJWKSet, jwtVerify } from "jose";
const app = express();
const PORT = process.env.PORT || 8080;

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGODB_URL;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI (or MONGODB_URL) in .env");
}

const client = new MongoClient(MONGODB_URI);

export async function connectToMongoDB() {
  // await client.connect();
  console.log("You successfully connected to MongoDB!");
  return client;
}

app.use(cors());
app.use(express.json());

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("wanderlust");
const destinationCollection = db.collection("destination");
const bookingCollection = db.collection("bookings");

const CLIENT_URL_VAR = process.env.CLIENT_URL || "http://localhost:3000";

const JWKS = createRemoteJWKSet(new URL(`${CLIENT_URL_VAR}/api/auth/jwks`));

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Unauthorized!" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send({ msg: "Unauthorized!" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    console.log(payload);
    next();
  } catch (error) {
    return res.status(500).send({ msg: "Server Error!" });
  }
};

app.post("/add-destination", verifyToken, async (req, res) => {
  const data = req.body;
  const result = await destinationCollection.insertOne(data);
  res.send(result);
});

app.get("/destinations", async (req, res) => {
  const result = await destinationCollection.find().toArray();
  res.send(result);
});

app.get("/featured-destinations", async (req, res) => {
  const result = await destinationCollection.find().limit(5).toArray();
  res.send(result);
});

app.get("/destination/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ msg: "Invalid destination id" });
  }
  const result = await destinationCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!result) {
    return res.status(404).send({ msg: "Destination not found" });
  }
  res.send(result);
});

app.patch("/destination/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ msg: "Invalid destination id" });
  }
  const { _id, ...data } = req.body;
  const result = await destinationCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });
  res.json(result);
});

app.delete("/destination/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ msg: "Invalid destination id" });
  }
  const result = await destinationCollection.deleteOne({
    _id: new ObjectId(id),
  });
  res.json(result);
});

app.post("/booking", async (req, res) => {
  const data = req.body;
  const result = await bookingCollection.insertOne(data);
  res.send(result);
});

app.get("/my-bookings/:email", verifyToken, async (req, res) => {
  const { email } = req.params;
  const result = await bookingCollection.find({ email: email }).toArray();
  res.send(result);
});

app.delete("/my-bookings/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ msg: "Invalid booking id" });
  }

  const result = await bookingCollection.deleteOne({
    _id: new ObjectId(id),
  });
  res.send(result);
});

app.get("/", (req, res) => {
  res.send({ message: "Server is running fine!" });
});

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});

export default app;
