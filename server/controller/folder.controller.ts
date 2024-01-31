
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


const createFolder = async (req: Request, res: Response) => {
  try {
    const { userId, name, path, directoryId } = req.body;

    const user = await prisma.user.findFirst({
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

    const createdFolder = await prisma.folder.create({
      data: folderData,
    });

    res.json(createdFolder);
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getFolders = async (req: Request, res: Response) => {
  try {
    const directoryId = req.query.directoryId;

    let resp;
    if (directoryId) {
      resp = await prisma.folder.findMany({
        where: {
          directoryId: +directoryId,
        },

      });
    } else {
      resp = await prisma.folder.findMany({
        where: {
          ownerId: 1
        },
      });
    }

    res.json(resp);
  } catch (error) {
    res.status(404).json({ error });
  }
};
const deleteFolder = async (req: Request, res: Response) => {
  try {
    const folderId = +req.body.id;

    const existingFolder = await prisma.folder.findUnique({
      where: {
        id: folderId,
      },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const deletedFolder = await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });

    res.json(deletedFolder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateFolder = async (req: Request, res: Response) => {
  try {
    const { name, id, directoryId } = req.body;

    const existingFolder = await prisma.folder.findUnique({
      where: {
        id: +id,
      },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const updatedFolder = await prisma.folder.update({
      where: {
        id: +id,
      },
      data: {
        name,
        directoryId: +directoryId
      },
    });

    res.json(updatedFolder);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export default {
  createFolder,
  getFolders,
  deleteFolder,
  updateFolder
}
