const cloudinary = require('cloudinary').v2;
const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Upload to Cloudinary
const uploadToCloudinary = async (filePath, folder = 'portfolio') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
    });
    
    // Delete local file after upload
    await fs.unlink(filePath);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Upload to AWS S3
const uploadToS3 = async (filePath, originalName) => {
  try {
    const fileContent = await fs.readFile(filePath);
    const fileName = `${Date.now()}-${originalName}`;
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `uploads/${fileName}`,
      Body: fileContent,
      ContentType: getMimeType(originalName),
      ACL: 'public-read',
    };
    
    const result = await s3.upload(params).promise();
    
    // Delete local file after upload
    await fs.unlink(filePath);
    
    return {
      url: result.Location,
      key: result.Key,
      bucket: result.Bucket,
    };
  } catch (error) {
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

// Delete from S3
const deleteFromS3 = async (key) => {
  try {
    await s3.deleteObject({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    }).promise();
  } catch (error) {
    throw new Error(`S3 delete failed: ${error.message}`);
  }
};

// Main upload function
exports.uploadImage = async (file) => {
  const service = process.env.STORAGE_SERVICE || 'local';
  
  switch (service) {
    case 'cloudinary':
      return await uploadToCloudinary(file.path, 'portfolio');
    
    case 's3':
      return await uploadToS3(file.path, file.originalname);
    
    case 'local':
      return {
        url: `/uploads/${file.filename}`,
        path: file.path,
      };
    
    default:
      throw new Error('Invalid storage service');
  }
};

// Main delete function
exports.deleteImage = async (imageData) => {
  const service = process.env.STORAGE_SERVICE || 'local';
  
  switch (service) {
    case 'cloudinary':
      if (imageData.publicId) {
        await deleteFromCloudinary(imageData.publicId);
      }
      break;
    
    case 's3':
      if (imageData.key) {
        await deleteFromS3(imageData.key);
      }
      break;
    
    case 'local':
      if (imageData.path) {
        await fs.unlink(imageData.path).catch(() => {});
      }
      break;
  }
};

// Helper: Get MIME type
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}