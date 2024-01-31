import { Request, Response } from 'express';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { v4 as uuid } from 'uuid';
import cloudStorage from '../config/storageConfig.js';
import { UploadedFile } from 'express-fileupload';

const bucket = cloudStorage.bucket();

const onUpload = async (file: any, res: Response) => {
  const fileRef = getStorage().bucket(bucket.name).file(file.name);
  const downloadURL = await getDownloadURL(fileRef);
  return res.json(downloadURL);
}

const uploadToCloud = async (req: Request, res: Response) => {
  try {

    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "Invalid files" });
    }

    const uploadedFile: UploadedFile = req.files.file as UploadedFile;

    const fileBuffer: Buffer = uploadedFile.data;
    const fileName: string = uploadedFile.name;
    const file = bucket.file(fileName);
    const writeStream = file.createWriteStream();

    writeStream
      .on('finish', async () => {
        try {
          const fileId = uuid();
          const metadata = {
            metadata: {
              fileId,
            },
          };
          await file.setMetadata(metadata);
          await onUpload(file, res);
        } catch (error: Error | unknown) {
          return res.status(500).json({ error });
        }
      });

    writeStream.end(fileBuffer);
  } catch (error) {
    res.status(500).json({ error });
  }
}


const getBucketSize = async (req: Request, res: Response) => {
  try {
    const [files] = await bucket.getFiles();

    let totalSizeBytes = 0;

    files.forEach(file => {
      if (file && file.metadata && file.metadata.size) {
        totalSizeBytes += +file.metadata.size;
      }
    });

    if (!totalSizeBytes) return;

    const totalSizeKB = totalSizeBytes / 1024;
    const totalSizeMB = totalSizeKB / 1024;

    res.json({
      totalSizeBytes,
      totalSizeKB,
      totalSizeMB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};


export default { uploadToCloud, getBucketSize };
