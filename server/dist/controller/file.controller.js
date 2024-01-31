var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PrismaClient } from '@prisma/client';
import cloudStorage from '../config/storageConfig.js';
const prisma = new PrismaClient();
const bucket = cloudStorage.bucket();
const getFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const directoryId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.directoryId;
        let resp;
        if (directoryId) {
            resp = yield prisma.file.findMany({
                where: {
                    directoryId: +directoryId
                }
            });
        }
        else {
            resp = yield prisma.file.findMany({
                where: {
                    ownerId: 1
                }
            });
        }
        res.json(resp);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const createFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, size, type, path, ownerId, directoryId } = req.body;
        const resp = yield prisma.file.create({
            data: {
                name,
                size,
                type,
                path,
                ownerId,
                directoryId: +directoryId,
            },
        });
        res.json(resp);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const deleteFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = +req.body.id;
        const existingFolder = yield prisma.file.findUnique({
            where: {
                id: fileId,
            },
        });
        if (!existingFolder) {
            return res.status(404).json({ error: 'File not found' });
        }
        const deletedFile = yield prisma.file.delete({
            where: {
                id: fileId,
            },
        });
        res.json(deletedFile);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
});
const updateFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, size, type, path, directoryId } = req.body;
        const existingFile = yield prisma.file.findUnique({
            where: {
                id,
            },
        });
        if (!existingFile) {
            return res.status(404).json({ error: 'File not found' });
        }
        const updatedFile = yield prisma.file.update({
            where: {
                id,
            },
            data: {
                name: name || existingFile.name,
                size: size || existingFile.size,
                type: type || existingFile.type,
                path: path || existingFile.path,
                directoryId: directoryId || existingFile.directoryId,
            },
        });
        res.json(updatedFile);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default {
    createFile,
    getFile,
    deleteFile,
    updateFile
};
