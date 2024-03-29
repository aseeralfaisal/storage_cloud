import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const getFile = async (req: Request, res: Response) => {
  try {
    const { directoryId, userId } = req.query

    if (!directoryId || !userId) return;

    let resp;
    if (directoryId) {
      resp = await prisma.file.findMany({
        where: {
          directoryId: +directoryId
        }
      })
    } else {
      resp = await prisma.file.findMany({
        where: {
          userId: +userId
        }
      })
    }

    res.json(resp);

  } catch (error) {
    res.status(500).json({ error });
  }
}

const createFile = async (req: Request, res: Response) => {
  try {
    const { name, size, type, path, userId, directoryId } = req.body;

    const resp = await prisma.file.create({
      data: {
        name,
        size,
        type,
        path,
        userId,
        directoryId: +directoryId,
      },
    });

    res.json(resp);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const deleteFile = async (req: Request, res: Response) => {
  try {
    const fileId = +req.body.id;

    const existingFolder = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: 'File not found' });
    }

    const deletedFile = await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    res.json(deletedFile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};


const updateFile = async (req: Request, res: Response) => {
  try {
    const { id, name, size, type, path, directoryId } = req.body;

    const existingFile = await prisma.file.findUnique({
      where: {
        id,
      },
    });

    if (!existingFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    const updatedFile = await prisma.file.update({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


export default {
  createFile,
  getFile,
  deleteFile,
  updateFile
};

