import express from 'express';
import cors from 'cors';
import { readdir, readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Enable CORS for local development
app.use(cors());
app.use(express.json());

// Path to data folder (one level up from web_app)
const DATA_DIR = join(__dirname, '../../data');
const ARTIFACTS_DIR = join(DATA_DIR, 'artifacts');
const PUBLISHED_DIR = join(DATA_DIR, 'published');

/**
 * GET /api/artifacts
 * Returns all artifacts and their published content
 */
app.get('/api/artifacts', async (req, res) => {
  try {
    // Read all artifact files
    const artifactFiles = await readdir(ARTIFACTS_DIR);
    const artifactJsonFiles = artifactFiles.filter(f => f.endsWith('.json'));
    
    const artifacts = await Promise.all(
      artifactJsonFiles.map(async (filename) => {
        const content = await readFile(join(ARTIFACTS_DIR, filename), 'utf-8');
        return JSON.parse(content);
      })
    );

    // Read all published Markdown files
    const publishedFiles = await readdir(PUBLISHED_DIR);
    const publishedMdFiles = publishedFiles.filter(f => f.endsWith('.md'));
    
    // web_app/server/api.js

    const published = await Promise.all(
      publishedMdFiles.map(async (filename) => {
        const content = await readFile(join(PUBLISHED_DIR, filename), 'utf-8');
        
        // 1. Define the Regex
        const regex = /^(.+)-([a-zA-Z]+)\.md$/;
        
        // 2. RUN the Regex (This line was missing!)
        const match = filename.match(regex); 

        if (!match) {
          console.warn(`Skipping file with unexpected format: ${filename}`);
          return null;
        }
        
        const [, artifactId, type] = match;
        
        return {
          id: artifactId,
          type,
          filename,
          content
        };
      })
    );
    // Filter out any null entries
    const validPublished = published.filter(Boolean);

    // Sort artifacts by creation date (newest first)
    artifacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      artifacts,
      published: validPublished,
      meta: {
        totalArtifacts: artifacts.length,
        totalPublished: validPublished.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error reading artifacts:', error);
    res.status(500).json({ 
      error: 'Failed to load artifacts',
      message: error.message 
    });
  }
});

/**
 * GET /api/artifacts/:id
 * Returns a single artifact with its published content
 */
app.get('/api/artifacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the artifact file
    const artifactFiles = await readdir(ARTIFACTS_DIR);
    const artifactFile = artifactFiles.find(f => f.startsWith(id) && f.endsWith('.json'));
    
    if (!artifactFile) {
      return res.status(404).json({ error: 'Artifact not found' });
    }
    
    const artifactContent = await readFile(join(ARTIFACTS_DIR, artifactFile), 'utf-8');
    const artifact = JSON.parse(artifactContent);
    
    // Find published files for this artifact
    const publishedFiles = await readdir(PUBLISHED_DIR);
    const relatedPublished = publishedFiles.filter(f => f.startsWith(id) && f.endsWith('.md'));
    
    const published = await Promise.all(
      relatedPublished.map(async (filename) => {
        const content = await readFile(join(PUBLISHED_DIR, filename), 'utf-8');
        
        // OLD: const match = filename.match(/^(.+)-(BuildLog|...)\.md$/);
        
        // NEW: Dynamic regex here too
        const match = filename.match(/^(.+)-([a-zA-Z]+)\.md$/);
        
        const [, , type] = match || [null, null, 'Unknown'];
        
        return {
          id,
          type,
          filename,
          content
        };
      })
    );
    
    res.json({
      artifact,
      published
    });
  } catch (error) {
    console.error('Error reading artifact:', error);
    res.status(500).json({ 
      error: 'Failed to load artifact',
      message: error.message 
    });
  }
});

// New Endpoint: GET /api/links
app.get('/api/links', async (req, res) => {
  try {
    const linksPath = join(DATA_DIR, 'links/rsys_core.json'); // (fixed)Note: You named it .ts but it's JSON
    const content = await readFile(linksPath, 'utf-8');
    res.json(JSON.parse(content));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load links registry' });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    dataDir: DATA_DIR
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Content Factor API running on http://localhost:${PORT}`);
  console.log(`📂 Reading data from: ${DATA_DIR}`);
  console.log(`\nEndpoints:`);
  console.log(`  - GET http://localhost:${PORT}/api/artifacts`);
  console.log(`  - GET http://localhost:${PORT}/api/artifacts/:id`);
  console.log(`  - GET http://localhost:${PORT}/api/health\n`);
});
