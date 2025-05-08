const API_URL = process.env.NEXT_PUBLIC_API_UPLOAD_URL || 'http://localhost:8888/api/upload';

/**
 * Upload an image file to the server
 * @param file - The image file to upload
 * @returns The URL of the uploaded image or null if upload failed
 */
async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch(`${API_URL}/image`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed to upload image');
        }

        const data = await res.json();
        return data.file?.url || null;
    } catch (error) {
        console.log('Upload failed:', error);
        return null;
    }
}

/**
 * Upload a video file to the server
 * @param file - The video file to upload
 * @returns The URL of the uploaded video or null if upload failed
 */
async function uploadVideo(file: File) {
    const formData = new FormData();
    formData.append('video', file);

    try {
        const res = await fetch(`${API_URL}/video`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed to upload video');
        }

        const data = await res.json();
        return data.file?.url || null;
    } catch (error) {
        console.log('Upload failed:', error);
        return null;
    }
}

/**
 * Upload a document file to the server
 * @param file - The document file to upload
 * @returns The URL of the uploaded document or null if upload failed
 */
async function uploadDocument(file: File) {
    const formData = new FormData();
    formData.append('document', file);

    try {
        const res = await fetch(`${API_URL}/document`, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed to upload document');
        }

        const data = await res.json();
        return data.file?.url || null;
    } catch (error) {
        console.log('Upload failed:', error);
        return null;
    }
}

/**
 * Upload any supported file type to the server
 * The server will automatically detect the file type
 * @param file - The file to upload
 * @returns The URL of the uploaded file or null if upload failed
 */
async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            body: formData,
        });

        if (!res.ok) {
            throw new Error('Failed to upload file');
        }

        const data = await res.json();
        return data.file?.url || null;
    } catch (error) {
        console.log('Upload failed:', error);
        return null;
    }
}

export const uploadService = {
    uploadImage,
    uploadVideo,
    uploadDocument,
    uploadFile
};
