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
        const { name, parentId } = req.body;
        const create = yield prisma.fold.create({
            data: {
                name,
                parentId,
            },
        });
        res.json(create);
    }
    catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const getFolders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const folders = yield prisma.fold.findMany({
            include: { children: true },
        });
        res.json(folders);
    }
    catch (error) {
        console.error('Error retrieving folders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
export default {
    createFolder,
    getFolders
};
