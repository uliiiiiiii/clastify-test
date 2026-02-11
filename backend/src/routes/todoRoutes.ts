import { Router } from "express";
import { Request, Response } from "express";
import Todo from "../models/todo";



export const getTodos = async (req: Request, res: Response) => {
  const { listId } = req.query;
  const filter: Record<string, unknown> = {};

  if (listId) {
    filter.list = listId;
  }

  const todos = await Todo.find(filter).sort({ createdAt: -1 });
  res.json(todos);
};

export const createTodo = async (req: Request, res: Response) => {
  const { title, listId } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  if (!listId) {
    return res.status(400).json({ message: "listId is required" });
  }

  const todo = await Todo.create({ title, list: listId });
  res.status(201).json(todo);
};

export const toggleTodo = async (req: Request, res: Response) => {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
};

const deleteTodo = async (req: Request, res: Response) => {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }

    res.status(204).end();
};


const router = Router();

router.get("/", getTodos);
router.post("/", createTodo);
router.patch("/:id", toggleTodo);
router.delete("/:id", deleteTodo);

export default router;
