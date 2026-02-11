import { Router, Request, Response } from "express";
import List from "../models/list";
import Todo from "../models/todo";

const router = Router();


  
export const getLists = async (_req: Request, res: Response) => {
  const lists = await List.find().sort({ createdAt: 1 });
  res.json(lists);
};


export const createList = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const list = await List.create({ name });
  res.status(201).json(list);
};


export const deleteList = async (req: Request, res: Response) => {
  const { id } = req.params;

  const list = await List.findByIdAndDelete(id);

  if (!list) {
    return res.status(404).json({ message: "List not found" });
  }

  await Todo.deleteMany({ list: id });

  res.status(204).end();
};

router.get("/", getLists);
router.post("/", createList); 
router.delete("/:id", deleteList);

export default router;

