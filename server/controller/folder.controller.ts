
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createFolder = async (req: Request, res: Response) => {
  try {
    const { userId, name, path, directoryId, parentId } = req.body;

    const user = await prisma.user.findUnique({
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

    const createdFolder = await prisma.folder.create({
      data: folderData,
    });

    res.json(createdFolder);
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteFolder = async (req: Request, res: Response) => {
  try {
    const id = req.body.id;

    const existingFolder = await prisma.folder.findUnique({
      where: {
        id,
      },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const deletedFolder = await prisma.folder.delete({
      where: {
        id,
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
    const { name, id, directoryId, parentId } = req.body;

    const existingFolder = await prisma.folder.findUnique({
      where: {
        id,
      },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    const updatedFolder = await prisma.folder.update({
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
  } catch (error) {
    res.status(500).json({ error });
  }
};


const getFoldersBasedOnPath = async (req: Request, res: Response) => {
  try {
    const folderIdString = req.query.folderId as string;
    const id = parseInt(folderIdString);

    const userIdString = req.query.userId as string;
    const userId = parseInt(userIdString);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let folders;

    if (id) {
      folders = await prisma.folder.findMany({
        where: {
          id,
          userId
        },
        include: { children: true },
      });
    } else {
      folders = await prisma.folder.findMany({
        where: {
          userId,
          parentId: null
        },
        include: { children: true },
      });
    }

    res.json(folders);
  } catch (error) {
    console.log(error)
  }
}

export default {
  createFolder,
  getFoldersBasedOnPath,
  deleteFolder,
  updateFolder,
}
