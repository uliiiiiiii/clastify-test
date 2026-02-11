"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import styles from "./page.module.css"; // import module

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
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
    <main
      className={`${styles.app} ${
        theme === "dark" ? styles.appDark : styles.appLight
      }`}
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Neon Todo</h1>
          <button
            type="button"
            aria-label="Toggle light and dark mode"
            className={`${styles.themeToggle} ${
              theme === "dark" ? styles.themeToggleDark : styles.themeToggleLight
            }`}
            onClick={() =>
              setTheme(current => (current === "dark" ? "light" : "dark"))
            }
          >
            <span className={styles.themeIcon}>
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>
        </header>

        <div className={styles.inputRow}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className={styles.input}
          />
          <button onClick={addTodo} className={styles.button}>
            Add
          </button>
        </div>

        <ul className={styles.list}>
          {todos.map(todo => (
            <li
              key={todo._id}
              className={`${styles.todo} ${
                todo.completed ? styles.todoCompleted : ""
              }`}
              onClick={() => toggleTodo(todo._id)}
            >
              <span className={styles.text}>{todo.title}</span>

              <button
                onClick={e => {
                  e.stopPropagation();
                  deleteTodo(todo._id);
                }}
                className={styles.delete}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
