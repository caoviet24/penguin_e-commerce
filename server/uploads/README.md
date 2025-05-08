# File Upload Server

An Express.js server for handling file uploads (videos, images, and documents) with proper error handling and file type validation.

## Features

- Upload videos, images, and documents
- File type validation
- File size limits
- Organized file storage
- RESTful API endpoints

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

3. Server will run at http://localhost:5000

## API Endpoints

| Endpoint | Method | Description | Request Body |
|----------|--------|-------------|-------------|
| `/api/upload/video` | POST | Upload a video file | `video` (file) |
| `/api/upload/image` | POST | Upload an image file | `image` (file) |
| `/api/upload/document` | POST | Upload a document file | `document` (file) |
| `/api/upload` | POST | Upload any supported file type | `file` (file) |

## Example Usage

### Using cURL

Upload a video:
```bash
curl -X POST http://localhost:5000/api/upload/video \
  -F "video=@/path/to/your/video.mp4"
```

Upload an image:
```bash
curl -X POST http://localhost:5000/api/upload/image \
  -F "image=@/path/to/your/image.jpg"
```

Upload a document:
```bash
curl -X POST http://localhost:5000/api/upload/document \
  -F "document=@/path/to/your/document.pdf"
```

### Using JavaScript (Fetch API)

```javascript
// Example: Uploading a video
const formData = new FormData();
formData.append('video', videoFile); // videoFile is a File object from input

fetch('http://localhost:5000/api/upload/video', {
  method: 'POST',
  body: formData,
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

## Response Format

Successful upload:
```json
{
  "success": true,
  "message": "Video uploaded successfully!",
  "file": {
    "originalname": "example.mp4",
    "filename": "1614567890123-123456789.mp4",
    "mimetype": "video/mp4",
    "size": 1048576,
    "url": "http://localhost:5000/uploads/videos/1614567890123-123456789.mp4"
  }
}
```

Error response:
```json
{
  "success": false,
  "message": "Error message here"
}
```

## File Type Support

- **Videos**: mp4, mov, avi, mkv, webm
- **Images**: jpeg, jpg, png, gif, svg, webp
- **Documents**: pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv, json, xml

## File Size Limits

- Videos: 100MB
- Images: 5MB  
- Documents: 20MB

## Directory Structure

Uploaded files are stored in the following directories:

- `/uploads/videos/` - For video files
- `/uploads/images/` - For image files
- `/uploads/documents/` - For document files