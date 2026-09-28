const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, "users.json");

app.use(express.json());

async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return {};
    }
    throw error;
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Add a user
app.post("/user", async (req, res) => {
  try {
    const { name, age, email } = req.body;

    if (!name || age === undefined || !email) {
      return res.status(400).json({ message: "Name, age, and email are required." });
    }

    const users = await readUsers();

    for (const id in users) {
      if (users[id].email.toLowerCase() === email.toLowerCase()) {
        return res.status(409).json({ message: "Email already exists." });
      }
    }

    const id = Date.now().toString();

    users[id] = { id, name, age, email };
    await writeUsers(users);

    return res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Update a user by ID
app.patch("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const users = await readUsers();

    if (!users[id]) {
      return res.status(404).json({ message: "User ID not found." });
    }

    const { name, age, email } = req.body;

    if (email) {
      for (const otherId in users) {
        if (
          otherId !== id &&
          users[otherId].email.toLowerCase() === email.toLowerCase()
        ) {
          return res.status(409).json({ message: "Email already exists." });
        }
      }
    }

    if (name !== undefined) users[id].name = name;
    if (age !== undefined) users[id].age = age;
    if (email !== undefined) users[id].email = email;

    await writeUsers(users);

    return res.json({ message: "User updated successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});

// Delete a user by ID from the URL or request body
app.delete("/user/:id?", async (req, res) => {
  try {
    const id = req.params.id || req.body.id;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const users = await readUsers();

    if (!users[id]) {
      return res.status(404).json({ message: "User ID not found." });
    }

    delete users[id];
    await writeUsers(users);

    return res.json({ message: "User deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});