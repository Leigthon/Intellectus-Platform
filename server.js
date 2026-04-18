import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

const PROFILES_FILE = path.join(__dirname, "profiles.json");

// Initialise empty profiles file if it does not exist
if (!fs.existsSync(PROFILES_FILE)) {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify([], null, 2));
}

function readProfilesFromFile() {
  try {
    const raw = fs.readFileSync(PROFILES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProfilesToFile(profiles) {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
}

// GET all profiles
app.get("/api/profiles", (req, res) => {
  res.json(readProfilesFromFile());
});

// POST create or update a profile
app.post("/api/profiles", (req, res) => {
  const newProfile = req.body;
  if (!newProfile || typeof newProfile !== "object" || !newProfile.id) {
    return res.status(400).json({ error: "Invalid profile data." });
  }

  const profiles = readProfilesFromFile();
  const existingIndex = profiles.findIndex((p) => p.id === newProfile.id);
  if (existingIndex > -1) {
    profiles[existingIndex] = newProfile;
  } else {
    profiles.unshift(newProfile);
  }

  writeProfilesToFile(profiles);
  res.json({ success: true, profile: newProfile });
});

// DELETE a profile by id
app.delete("/api/profiles/:id", (req, res) => {
  const profiles = readProfilesFromFile();
  const filtered = profiles.filter((p) => p.id !== req.params.id);
  writeProfilesToFile(filtered);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Profiles server running on port ${PORT}`));
