import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs-extra";
import { fileURLToPath } from 'url';
import 'dotenv/config'
import auth from "../middlewares/auth.js";
import MetaData from "../models/metaData.js";
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

const UPLOAD_DIR = path.join(__dirname, 'uploads');

fs.ensureDirSync(UPLOAD_DIR);


const upload = multer({
  dest: UPLOAD_DIR,
});

router.post('/',auth ,upload.single('file'), (req, res) => {
  const fileId = req.body.fileId;
  const chunkNumber = req.body.chunkNumber;
  
  if (!fileId || !chunkNumber) {
    return res.status(400).json({ error: 'Missing fileId or chunkNumber' });
  }
  
  const chunkDir = path.join(UPLOAD_DIR, fileId);
  fs.ensureDirSync(chunkDir);
  
  const chunkPath = path.join(chunkDir, `${chunkNumber}`);
  fs.moveSync(req.file.path, chunkPath, { overwrite: true });
  
  return res.status(200).json({ message: 'Chunk uploaded' });
});

router.post('/complete',auth ,async (req, res) => {
    
    const { fileName, fileId, totalChunks } = req.body;

    if (!fileName || !fileId || !totalChunks) {
        return res.status(400).json({
            error: 'Missing required parameters',
            details: {
                fileName: !fileName ? 'missing' : 'provided',
                fileId: !fileId ? 'missing' : 'provided',
                totalChunks: !totalChunks ? 'missing' : 'provided'
            }
        });
    }

    const chunkDir = path.join(UPLOAD_DIR, fileId);
    const filePath = path.join(UPLOAD_DIR, fileName);

    try {
        const writeStream = fs.createWriteStream(filePath);
        for (let i = 0; i < totalChunks; i++) {
            const chunkPath = path.join(chunkDir, `${i}`);
            const data = await fs.readFile(chunkPath);
            writeStream.write(data);
        }
        writeStream.end();
        await fs.remove(chunkDir);
        await saveMetaData(fileName, filePath, req.user)
        return res.status(200).json({ message: "File assembled" });
    } catch (error) {
        console.error('Error assembling file:', error);
        return res.status(500).json({ error: 'Failed to assemble file', details: error.message });
    }
})

const saveMetaData = async(fileName, filePath, user)=> {
    try {
        const data = {
            fileName: fileName,
            filePath: filePath,
            uploadedBy: user.id,
        }
        await MetaData.create(data);
    } catch(error) {
        return res.status(500).json({ error: 'Failed to save metadata', details: error.message });
    }
}

router.get('/', auth, async(req,res)=>{
    try {
        const data = await MetaData.find({uploadedBy: req.user.id})
        return res.status(200).json({ data })
    } catch(error) {
        return res.status(500).json({ error: 'Failed to fetch metadata', details: error.message });
    }
})

// PATCH endpoint to rename a file
router.patch('/:fileId', auth, async (req, res) => {
    const { fileId } = req.params;
    const { fileName } = req.body;
    
    if (!fileName) {
        return res.status(400).json({ error: 'Missing fileName parameter' });
    }
    
    try {
        // Find the file metadata
        const fileMetadata = await MetaData.findById(fileId);
        
        if (!fileMetadata) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Check if the user owns this file
        if (fileMetadata.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to rename this file' });
        }
        
        // Get the old file path
        const oldFilePath = fileMetadata.filePath;
        
        // Create the new file path with the new name
        const directory = path.dirname(oldFilePath);
        const newFilePath = path.join(directory, fileName);
        
        // Rename the file on the filesystem
        await fs.rename(oldFilePath, newFilePath);
        
        // Update the metadata in the database
        fileMetadata.fileName = fileName;
        fileMetadata.filePath = newFilePath;
        await fileMetadata.save();
        
        return res.status(200).json({ message: 'File renamed successfully', data: fileMetadata });
    } catch (error) {
        console.error('Error renaming file:', error);
        return res.status(500).json({ error: 'Failed to rename file', details: error.message });
    }
});

// DELETE endpoint to delete a file
router.delete('/:fileId', auth, async (req, res) => {
    const { fileId } = req.params;
    
    try {
        // Find the file metadata
        const fileMetadata = await MetaData.findById(fileId);
        
        if (!fileMetadata) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Check if the user owns this file
        if (fileMetadata.uploadedBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete this file' });
        }
        
        // Delete the file from the filesystem
        await fs.remove(fileMetadata.filePath);
        
        // Delete the metadata from the database
        await MetaData.findByIdAndDelete(fileId);
        
        return res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        return res.status(500).json({ error: 'Failed to delete file', details: error.message });
    }
});

export default router;
