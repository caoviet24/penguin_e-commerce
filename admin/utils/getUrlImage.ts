import axios from "axios";
import delay from "./delay";

interface UploadResponse {
  data: {
    url: string;
  };
}


export async function getUrlImage(file: File): Promise<string> {
  const imgBBKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!imgBBKey) {
    throw new Error("ImgBB API key is not provided");
  }

  const formData = new FormData();
  formData.append("image", file); 

  try {
    const response = await axios.post<UploadResponse>(
      `https://api.imgbb.com/1/upload?key=${imgBBKey}`,
      formData
    );

    await delay(1000);
    
    return response.data.data.url;
  } catch (error: any) {
    console.error("Image upload failed:", error.response?.data || error.message);
    throw new Error("Failed to upload image");
  }
}
