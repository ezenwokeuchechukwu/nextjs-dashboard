import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

// Change these values to whatever you want for your test user
const email = "test@example.com";
const password = "Password123";
const name = "Ezenwoke Uchechukwu";

async function createTestUser() {
  if (!process.env.MONGODB_URI) {
    console.error("Please set MONGODB_URI in your environment variables");
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(); // use default DB from URI
    const users = db.collection("users");

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    console.log("Test user created successfully!");
    console.log("User ID:", result.insertedId);
    console.log("Email:", email);
    console.log("Password:", password);
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await client.close();
  }
}

createTestUser();
