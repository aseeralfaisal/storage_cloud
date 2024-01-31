var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDownloadURL, getStorage } from 'firebase-admin/storage';
import { v4 as uuid } from 'uuid';
import cloudStorage from '../config/storageConfig.js';
const bucket = cloudStorage.bucket();
const onUpload = (file, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileRef = getStorage().bucket(bucket.name).file(file.name);
    const downloadURL = yield getDownloadURL(fileRef);
    return res.json(downloadURL);
});
const uploadToCloud = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: "Invalid files" });
        }
        const uploadedFile = req.files.file;
        const fileBuffer = uploadedFile.data;
        const fileName = uploadedFile.name;
        const file = bucket.file(fileName);
        const writeStream = file.createWriteStream();
        writeStream
            .on('finish', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const fileId = uuid();
                const metadata = {
                    metadata: {
                        fileId,
                    },
                };
                yield file.setMetadata(metadata);
                yield onUpload(file, res);
            }
            catch (error) {
                return res.status(500).json({ error });
            }
        }));
        writeStream.end(fileBuffer);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const getBucketSize = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [files] = yield bucket.getFiles();
        let totalSizeBytes = 0;
        files.forEach(file => {
            if (file && file.metadata && file.metadata.size) {
                totalSizeBytes += +file.metadata.size;
            }
        });
        if (!totalSizeBytes)
            return;
        const totalSizeKB = totalSizeBytes / 1024;
        const totalSizeMB = totalSizeKB / 1024;
        res.json({
            totalSizeBytes,
            totalSizeKB,
            totalSizeMB,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
});
export default { uploadToCloud, getBucketSize };
