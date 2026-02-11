"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import styles from "./page.module.css"; // import module

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const API = `${process.env.NEXT_PUBLIC_API_URL}/api/todos`;

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setTodos)
      .catch(console.error);
  }, []);

  async function addTodo() {
    if (!title.trim()) return;
    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const todo = await res.json();
    setTodos(prev => [...prev, todo]);
    setTitle("");
  }

  async function toggleTodo(id: string) {
    const res = await fetch(`${API}/${id}`, { method: "PATCH" });
    const updated = await res.json();
    setTodos(prev => prev.map(t => (t._id === id ? updated : t)));
  }

  async function deleteTodo(id: string) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setTodos(prev => prev.filter(t => t._id !== id));
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Todo App</h1>

      <div className={styles.inputRow}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="New task..."
          className={styles.input}
        />
        <button onClick={addTodo} className={styles.button}>
          Add
        </button>
      </div>

      <ul className={styles.list}>
        {todos.map(todo => (
          <li key={todo._id} className={styles.todo}>
            <span
              onClick={() => toggleTodo(todo._id)}
              className={styles.text}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.title}
            </span>

            <button
              onClick={() => deleteTodo(todo._id)}
              className={styles.delete}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
