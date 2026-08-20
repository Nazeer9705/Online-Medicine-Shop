import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import routes from './routes';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();

// Security & Cross-Origin Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images & uploads
const webContentImages = path.join(__dirname, '../../Pharmacy-Drug-Management-System/Pharmacy-Drug-Mangement/WebContent');
app.use(express.static(webContentImages));
app.use('/uploads', express.static(path.join(__dirname, '../../../uploads')));

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', system: 'MEDICARE V2.0 REST API', timestamp: new Date().toISOString() });
});

// Mounting v1 API Routes
app.use('/api/v1', routes);

// Centralized Error Handling
app.use(errorMiddleware);

export default app;
