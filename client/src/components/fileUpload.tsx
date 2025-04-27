import { useState, ChangeEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

const UploadFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

    if (!file) return;

    setUploading(true);

    const chunkSize = 5 * 1024 * 1024; // 5MB
    const totalChunks = Math.ceil(file.size / chunkSize);
    const fileId = Date.now().toString(); // Unique ID for the upload
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(file.size, start + chunkSize);
      const chunk = file.slice(start, end);

      
      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('fileId', fileId);
      formData.append('chunkNumber', i.toString());
      
      await fetch(`${baseUrl}/api/file`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `${localStorage.getItem("token")}`, // Pass the token here
        },
      });

      setProgress(Math.round(((i + 1) / totalChunks) * 100));
    }

    // Tell server to assemble all chunks
    await fetch(`${baseUrl}/api/file/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem("token")}` },
      body: JSON.stringify({ fileName: file.name, fileId, totalChunks }),
    });

    setUploading(false);
    alert('Upload complete!');
  };

  return (
    <div className="upload-container">
      <div className="flex justify-center mb-4">
        <Input type='file' onChange={handleFileChange} name='file' />
      </div>
      <div className="flex justify-center">
        <Button onClick={uploadFile} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
      {uploading && (
        <div style={{ marginTop: '10px' }}>
          <progress value={progress} max="100" />
          <span> {progress}%</span>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
