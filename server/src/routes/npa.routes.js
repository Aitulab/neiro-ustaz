import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import * as npaController from '../controllers/npa.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Setup Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'npa');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Prevent path traversal and special chars
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, `${Date.now()}_${safeName}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
    fileFilter: (req, file, cb) => {
        cb(null, true); // accept everything for now (doc, docx, pdf)
    }
});

router.get('/', npaController.getDocuments);
router.post('/', authMiddleware, upload.single('file'), npaController.addDocument);

export default router;
