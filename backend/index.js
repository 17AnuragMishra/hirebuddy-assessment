require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { Job, SearchHistory } = require('./models/schema');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const MONGODB_URI = 'mongodb+srv://anuragmishra0521:9pekAmB5DA4ksiUN@cluster0.lnfttoq.mongodb.net/hirebuddy?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('Successfully connected to MongoDB Atlas.');
  try {
    await Job.collection.createIndex(
      { job_title: 'text', job_description: 'text', company_name: 'text' },
      { name: 'job_search_index' }
    );
    console.log('Text index created successfully');
  } catch (error) {
    if (error.code === 85) { // Index already exists
      console.log('Text index already exists');
    } else {
      console.error('Error creating text index:', error);
    }
  }
  return loadJobs();
})
.then(() => {
  console.log('Jobs loaded successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const loadJobs = async () => {
  try {
    console.log('Starting to load jobs...');
    const filePath = path.join(__dirname, 'all_jobs_2025-05-22.jsonl');
    console.log('Reading file from:', filePath);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const data = fs.readFileSync(filePath, 'utf8').split('\n');
    console.log(`Found ${data.length} lines in the file`);
    
    let loadedCount = 0;
    for (const line of data) {
      if (line.trim()) {
        try {
          const job = JSON.parse(line);
          await Job.findOneAndUpdate(
            { apply_link: job.apply_link },
            job,
            { upsert: true, new: true }
          );
          loadedCount++;
          if (loadedCount % 100 === 0) {
            console.log(`Loaded ${loadedCount} jobs...`);
          }
        } catch (parseError) {
          console.error('Error parsing job:', parseError);
          continue;
        }
      }
    }
    console.log(`Successfully loaded ${loadedCount} jobs into database`);
  } catch (error) {
    console.error('Error in loadJobs:', error);
    throw error;
  }
};

// Search jobs
app.get('/api/jobs', async (req, res) => {
  const { query } = req.query;
  if (query) {
    // Update search history
    await SearchHistory.findOneAndUpdate(
      { keyword: query },
      { $inc: { count: 1 }, lastSearched: Date.now() },
      { upsert: true }
    );
    
    const jobs = await Job.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
    res.json(jobs);
  } else {
    const jobs = await Job.find();
    res.json(jobs);
  }
});

// Resume upload and job role prediction
app.post('/api/upload-resume', upload.single('resume'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const dataBuffer = fs.readFileSync(file.path);
  const pdfData = await pdfParse(dataBuffer);
  const text = pdfData.text.toLowerCase();

  // Simple keyword-based job role prediction
  const roleKeywords = {
    'Data Scientist': ['data science', 'machine learning', 'python', 'sql', 'tensorflow'],
    'Software Engineer': ['software development', 'javascript', 'react', 'node.js'],
    'DevOps Engineer': ['devops', 'aws', 'docker', 'kubernetes'],
    'AI Engineer': ['ai', 'machine learning', 'neural networks', 'pytorch']
  };

  let predictedRole = 'Software Engineer'; // Default
  let maxMatches = 0;

  for (const [role, keywords] of Object.entries(roleKeywords)) {
    const matches = keywords.filter(keyword => text.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      predictedRole = role;
    }
  }

  // Perform search based on predicted role
  const jobs = await Job.find(
    { $text: { $search: predictedRole } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  res.json({ predictedRole, jobs });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));