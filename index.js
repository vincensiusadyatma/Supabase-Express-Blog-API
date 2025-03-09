import express from 'express';
import routes from './app/routes/routes.js';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json()); 

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_ANON_KEY; 
// const supabase = createClient(supabaseUrl, supabaseKey);

// **🔹 Middleware untuk Menyajikan File Statis**
app.use(express.static(path.join(__dirname, 'public')));

// **🔹 Import Routes**
app.use('/api', routes);
// **🔹 Endpoint Default "/" -> Return JSON 200 OK**
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    timestamp: new Date().toISOString()
  });
});




// **🔹 Run Server**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
