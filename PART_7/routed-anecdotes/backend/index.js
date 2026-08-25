import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { promises as fs } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3001;
const BUILD_DIR = path.join(__dirname, "build");
const DB_FILE = path.join(__dirname, "db.json");

app.use(express.json());

const readDb = async () => {
  const file = await fs.readFile(DB_FILE, "utf8");
  return JSON.parse(file);
};

const writeDb = async (data) => {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
};

const router = express.Router();

router.get("/", async (req, res) => {
  const db = await readDb();
  res.json(db.anecdotes);
});

router.get("/:id", async (req, res) => {
  const db = await readDb();
  const anecdote = db.anecdotes.find((a) => a.id === Number(req.params.id));
  if (!anecdote) {
    return res.status(404).json({ error: "Anecdote not found" });
  }
  res.json(anecdote);
});

router.post("/", async (req, res) => {
  const db = await readDb();
  const newAnecdote = {
    ...req.body,
    id: Math.max(0, ...db.anecdotes.map((a) => a.id)) + 1,
  };
  db.anecdotes.push(newAnecdote);
  await writeDb(db);
  res.status(201).json(newAnecdote);
});

router.delete("/:id", async (req, res) => {
  const db = await readDb();
  const id = Number(req.params.id);
  const filtered = db.anecdotes.filter((a) => a.id !== id);
  if (filtered.length === db.anecdotes.length) {
    return res.status(404).json({ error: "Anecdote not found" });
  }
  db.anecdotes = filtered;
  await writeDb(db);
  res.status(204).end();
});

// Serve static files before API routes
app.use(express.static(BUILD_DIR));

// API routes
app.use("/anecdotes", router);
app.use("/api/anecdotes", router);

// Fallback to index.html for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(BUILD_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
