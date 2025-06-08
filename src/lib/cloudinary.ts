import { v2 as cloudinary } from 'cloudinary';

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(file: File | Blob, folder = 'real-estate', resourceType = 'auto') {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    // ตรวจสอบว่าเป็น File object หรือ Blob
    if (!(file instanceof File) && !(file instanceof Blob)) {
      throw new Error('Invalid file type. Expected File or Blob');
    }

    // ตรวจสอบประเภทไฟล์
    const fileType = file.type;
    let resource_type = resourceType;

    if (fileType.includes('video')) {
      resource_type = 'video';
    } else if (fileType.includes('pdf')) {
      resource_type = 'raw';
    }

    // แปลงไฟล์เป็น Buffer
    const buffer = await file.arrayBuffer();

    // อัพโหลดไฟล์ไปยัง Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: resource_type as "image" | "video" | "raw" | "auto",
          transformation: resource_type === 'image' ? [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' }
          ] : undefined
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(Buffer.from(buffer));
    });

    return {
      url: result.secure_url.toString(),
      publicId: result.public_id.toString(),
      resourceType: result.resource_type
    };
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error);
    throw error;
  }
}

// ฟังก์ชันสำหรับอัพโหลดวิดีโอ
export async function uploadVideo(file: File | Blob, folder = 'real-estate/videos') {
  return uploadToCloudinary(file, folder, 'video');
}

// ฟังก์ชันสำหรับอัพโหลด PDF
export async function uploadPDF(file: File | Blob, folder = 'real-estate/documents') {
  return uploadToCloudinary(file, folder, 'raw');
}

// ฟังก์ชันสำหรับลบรูปภาพจาก Cloudinary
export async function deleteFromCloudinary(publicId: string) {
  try {
    if (!publicId) {
      throw new Error('No public ID provided');
    }

    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error in deleteFromCloudinary:', error);
    throw error;
  }
}