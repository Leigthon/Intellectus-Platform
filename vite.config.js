import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import fs from "node:fs";

const PROFILES_FILE = path.resolve("profiles.json");

function readProfiles() {
  try {
    const raw = fs.readFileSync(PROFILES_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProfiles(profiles) {
  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profiles, null, 2));
}

function profilesApiPlugin() {
  return {
    name: "profiles-api",
    configureServer(server) {
      server.middlewares.use("/api/profiles", (req, res, next) => {
        res.setHeader("Content-Type", "application/json");

        if (req.method === "GET") {
          res.end(JSON.stringify(readProfiles()));
          return;
        }

        if (req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => { body += chunk; });
          req.on("end", () => {
            try {
              const newProfile = JSON.parse(body);
              if (!newProfile || typeof newProfile !== "object" || !newProfile.id) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid profile data." }));
                return;
              }
              const profiles = readProfiles();
              const existingIndex = profiles.findIndex((p) => p.id === newProfile.id);
              if (existingIndex > -1) {
                profiles[existingIndex] = newProfile;
              } else {
                profiles.unshift(newProfile);
              }
              writeProfiles(profiles);
              res.end(JSON.stringify({ success: true, profile: newProfile }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: "Invalid JSON." }));
            }
          });
          return;
        }

        if (req.method === "DELETE") {
          const id = decodeURIComponent(req.url.replace(/^\/+/,""));
          if (!id) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing profile id." }));
            return;
          }
          const profiles = readProfiles();
          const filtered = profiles.filter((p) => p.id !== id);
          writeProfiles(filtered);
          res.end(JSON.stringify({ success: true }));
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  base: "/Intellectus-Platform/",
  plugins: [react(), profilesApiPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
    },
  },
});