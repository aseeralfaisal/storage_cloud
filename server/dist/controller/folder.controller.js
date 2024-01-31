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
const prisma = new PrismaClient();
const createFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, name, path, directoryId } = req.body;
        const user = yield prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const folderData = {
            name,
            path,
            ownerId: user.id,
            directoryId: +directoryId,
        };
        const createdFolder = yield prisma.folder.create({
            data: folderData,
        });
        res.json(createdFolder);
    }
    catch (error) {
        console.error("Error creating folder:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
const getFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const directoryId = req.query.directoryId;
        let resp;
        if (directoryId) {
            resp = yield prisma.folder.findMany({
                where: {
                    directoryId: +directoryId,
                },
            });
        }
        else {
            resp = yield prisma.folder.findMany({
                where: {
                    ownerId: 1
                },
            });
        }
        res.json(resp);
    }
    catch (error) {
        res.status(404).json({ error });
    }
});
const deleteFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folderId = +req.body.id;
        const existingFolder = yield prisma.folder.findUnique({
            where: {
                id: folderId,
            },
        });
        if (!existingFolder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        const deletedFolder = yield prisma.folder.delete({
            where: {
                id: folderId,
            },
        });
        res.json(deletedFolder);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const updateFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, id, directoryId } = req.body;
        const existingFolder = yield prisma.folder.findUnique({
            where: {
                id: +id,
            },
        });
        if (!existingFolder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        const updatedFolder = yield prisma.folder.update({
            where: {
                id: +id,
            },
            data: {
                name,
                directoryId: +directoryId
            },
        });
        res.json(updatedFolder);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
export default {
    createFolder,
    getFolders,
    deleteFolder,
    updateFolder
};
