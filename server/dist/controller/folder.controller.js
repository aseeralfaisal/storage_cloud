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
        const { userId, name, path, directoryId, parentId } = req.body;
        const user = yield prisma.user.findUnique({
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
            userId: user.id,
            directoryId: +directoryId,
            parentId: parentId
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
const deleteFolder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const existingFolder = yield prisma.folder.findUnique({
            where: {
                id,
            },
        });
        if (!existingFolder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        const deletedFolder = yield prisma.folder.delete({
            where: {
                id,
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
        const { name, id, directoryId, parentId } = req.body;
        const existingFolder = yield prisma.folder.findUnique({
            where: {
                id,
            },
        });
        if (!existingFolder) {
            return res.status(404).json({ error: 'Folder not found' });
        }
        const updatedFolder = yield prisma.folder.update({
            where: {
                id,
            },
            data: {
                name,
                directoryId,
                parentId
            },
        });
        res.json(updatedFolder);
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const getFoldersBasedOnPath = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folderIdString = req.query.folderId;
        const id = parseInt(folderIdString);
        const userIdString = req.query.userId;
        const userId = parseInt(userIdString);
        const user = yield prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let folders;
        if (id) {
            folders = yield prisma.folder.findMany({
                where: {
                    id,
                    userId
                },
                include: { children: true },
            });
        }
        else {
            folders = yield prisma.folder.findMany({
                where: {
                    userId,
                    parentId: null
                },
                include: { children: true },
            });
        }
        res.json(folders);
    }
    catch (error) {
        console.log(error);
    }
});
export default {
    createFolder,
    getFoldersBasedOnPath,
    deleteFolder,
    updateFolder,
};
