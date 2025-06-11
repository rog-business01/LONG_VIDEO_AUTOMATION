import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';
import cron from 'node-cron';
import path from 'path';
import fs from 'fs';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/json', 'audio/wav', 'audio/mp3', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// In-memory storage for demo (use database in production)
let renderJobs = new Map();
let webhookConfigs = new Map();
let templates = new Map();

// WebSocket connections
const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  
  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Broadcast to all connected clients
const broadcast = (data) => {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
};

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Render video
app.post('/api/render', upload.single('script'), async (req, res) => {
  try {
    const jobId = uuidv4();
    let script;

    if (req.file) {
      // Script uploaded as file
      const scriptContent = fs.readFileSync(req.file.path, 'utf8');
      script = JSON.parse(scriptContent);
    } else if (req.body.script) {
      // Script provided in request body
      script = req.body.script;
    } else {
      return res.status(400).json({ error: 'No script provided' });
    }

    const job = {
      id: jobId,
      status: 'queued',
      progress: 0,
      script,
      createdAt: new Date(),
      outputPath: null,
      error: null
    };

    renderJobs.set(jobId, job);

    // Start rendering process (simulated)
    processRenderJob(jobId);

    res.json({ jobId, status: 'queued' });
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get render job status
app.get('/api/render/:jobId', (req, res) => {
  const job = renderJobs.get(req.params.jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json(job);
});

// List render jobs
app.get('/api/render', (req, res) => {
  const jobs = Array.from(renderJobs.values())
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 50); // Limit to 50 most recent jobs

  res.json(jobs);
});

// Cancel render job
app.delete('/api/render/:jobId', (req, res) => {
  const job = renderJobs.get(req.params.jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  if (job.status === 'processing') {
    job.status = 'cancelled';
    renderJobs.set(req.params.jobId, job);
    
    broadcast({
      type: 'job_cancelled',
      jobId: req.params.jobId
    });
  }

  res.json({ message: 'Job cancelled' });
});

// Webhook configuration
app.post('/api/webhooks', (req, res) => {
  const { url, events, secret } = req.body;
  
  if (!url || !events || !Array.isArray(events)) {
    return res.status(400).json({ error: 'Invalid webhook configuration' });
  }

  const webhookId = uuidv4();
  const webhook = {
    id: webhookId,
    url,
    events,
    secret,
    createdAt: new Date(),
    active: true
  };

  webhookConfigs.set(webhookId, webhook);
  res.json(webhook);
});

// List webhooks
app.get('/api/webhooks', (req, res) => {
  const webhooks = Array.from(webhookConfigs.values());
  res.json(webhooks);
});

// Delete webhook
app.delete('/api/webhooks/:webhookId', (req, res) => {
  const deleted = webhookConfigs.delete(req.params.webhookId);
  
  if (!deleted) {
    return res.status(404).json({ error: 'Webhook not found' });
  }

  res.json({ message: 'Webhook deleted' });
});

// Template management
app.post('/api/templates', upload.single('template'), (req, res) => {
  try {
    const templateId = uuidv4();
    let template;

    if (req.file) {
      const templateContent = fs.readFileSync(req.file.path, 'utf8');
      template = JSON.parse(templateContent);
    } else if (req.body.template) {
      template = req.body.template;
    } else {
      return res.status(400).json({ error: 'No template provided' });
    }

    const templateData = {
      id: templateId,
      name: req.body.name || `Template ${templateId}`,
      description: req.body.description || '',
      template,
      createdAt: new Date(),
      tags: req.body.tags ? req.body.tags.split(',') : []
    };

    templates.set(templateId, templateData);
    res.json(templateData);
  } catch (error) {
    console.error('Template creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List templates
app.get('/api/templates', (req, res) => {
  const templateList = Array.from(templates.values())
    .map(({ template, ...meta }) => meta); // Exclude template content from list

  res.json(templateList);
});

// Get template
app.get('/api/templates/:templateId', (req, res) => {
  const template = templates.get(req.params.templateId);
  
  if (!template) {
    return res.status(404).json({ error: 'Template not found' });
  }

  res.json(template);
});

// Delete template
app.delete('/api/templates/:templateId', (req, res) => {
  const deleted = templates.delete(req.params.templateId);
  
  if (!deleted) {
    return res.status(404).json({ error: 'Template not found' });
  }

  res.json({ message: 'Template deleted' });
});

// TTS generation
app.post('/api/tts/generate', async (req, res) => {
  try {
    const { text, config } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Simulate TTS generation
    const audioId = uuidv4();
    const audioPath = `/tmp/tts_${audioId}.wav`;
    
    // In a real implementation, this would call the actual TTS service
    setTimeout(() => {
      broadcast({
        type: 'tts_completed',
        audioId,
        audioPath
      });
    }, 2000);

    res.json({ audioId, status: 'processing' });
  } catch (error) {
    console.error('TTS generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Thumbnail generation
app.post('/api/thumbnails/generate', async (req, res) => {
  try {
    const { scene, config } = req.body;
    
    if (!scene) {
      return res.status(400).json({ error: 'Scene data is required' });
    }

    const thumbnailId = uuidv4();
    
    // Simulate thumbnail generation
    setTimeout(() => {
      const thumbnails = [
        `/tmp/thumbnail_${thumbnailId}_1.jpg`,
        `/tmp/thumbnail_${thumbnailId}_2.jpg`,
        `/tmp/thumbnail_${thumbnailId}_3.jpg`
      ];
      
      broadcast({
        type: 'thumbnails_completed',
        thumbnailId,
        thumbnails
      });
    }, 3000);

    res.json({ thumbnailId, status: 'processing' });
  } catch (error) {
    console.error('Thumbnail generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  const stats = {
    totalJobs: renderJobs.size,
    completedJobs: Array.from(renderJobs.values()).filter(job => job.status === 'completed').length,
    failedJobs: Array.from(renderJobs.values()).filter(job => job.status === 'failed').length,
    processingJobs: Array.from(renderJobs.values()).filter(job => job.status === 'processing').length,
    totalTemplates: templates.size,
    activeWebhooks: Array.from(webhookConfigs.values()).filter(wh => wh.active).length
  };

  res.json(stats);
});

// Simulated render job processing
async function processRenderJob(jobId) {
  const job = renderJobs.get(jobId);
  if (!job) return;

  try {
    // Update status to processing
    job.status = 'processing';
    job.progress = 0;
    renderJobs.set(jobId, job);
    
    broadcast({
      type: 'job_started',
      jobId,
      job
    });

    // Simulate rendering progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      
      job.progress = progress;
      renderJobs.set(jobId, job);
      
      broadcast({
        type: 'job_progress',
        jobId,
        progress
      });

      // Check if job was cancelled
      if (job.status === 'cancelled') {
        return;
      }
    }

    // Complete the job
    job.status = 'completed';
    job.progress = 100;
    job.completedAt = new Date();
    job.outputPath = `/tmp/video_${jobId}.mp4`;
    renderJobs.set(jobId, job);

    broadcast({
      type: 'job_completed',
      jobId,
      job
    });

    // Trigger webhooks
    await triggerWebhooks('job_completed', { jobId, job });

  } catch (error) {
    console.error('Job processing error:', error);
    
    job.status = 'failed';
    job.error = error.message;
    job.completedAt = new Date();
    renderJobs.set(jobId, job);

    broadcast({
      type: 'job_failed',
      jobId,
      error: error.message
    });

    await triggerWebhooks('job_failed', { jobId, error: error.message });
  }
}

// Webhook trigger function
async function triggerWebhooks(event, data) {
  const relevantWebhooks = Array.from(webhookConfigs.values())
    .filter(wh => wh.active && wh.events.includes(event));

  for (const webhook of relevantWebhooks) {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': webhook.secret || '',
        },
        body: JSON.stringify({
          event,
          data,
          timestamp: new Date().toISOString()
        })
      });

      console.log(`Webhook ${webhook.id} triggered:`, response.status);
    } catch (error) {
      console.error(`Webhook ${webhook.id} failed:`, error.message);
    }
  }
}

// Cleanup old jobs (runs every hour)
cron.schedule('0 * * * *', () => {
  const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  
  for (const [jobId, job] of renderJobs.entries()) {
    if (job.createdAt < cutoffTime && job.status !== 'processing') {
      renderJobs.delete(jobId);
      
      // Clean up output files
      if (job.outputPath && fs.existsSync(job.outputPath)) {
        fs.unlinkSync(job.outputPath);
      }
    }
  }
  
  console.log('Cleanup completed:', new Date().toISOString());
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`WebSocket server running on port ${PORT}`);
});

export default app;