"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/types/todo";
import { TodoList } from "@/types/list";
import styles from "./page.module.css"; // import module
import { AppHeader } from "./components/AppHeader";
import { TodoMain } from "./components/TodoMain";
import { ListsPanel } from "./components/ListsPanel";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [lists, setLists] = useState<TodoList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isListsOpen, setIsListsOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [title, setTitle] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  const TODOS_API = `${API_BASE}/api/todos`;
  const LISTS_API = `${API_BASE}/api/lists`;

  useEffect(() => {
    async function bootstrap() {
      try {
        const res = await fetch(LISTS_API);
        const data: TodoList[] = await res.json();

        if (data.length === 0) {
          const created = await createListOnServer("My first list");
          setLists([created]);
          setSelectedListId(created._id);
        } else {
          setLists(data);
          setSelectedListId(data[0]._id);
        }
      } catch (error) {
        console.error(error);
      }
    }

    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedListId) return;

    fetch(`${TODOS_API}?listId=${selectedListId}`)
      .then(res => res.json())
      .then(setTodos)
      .catch(console.error);
  }, [TODOS_API, selectedListId]);

  async function createListOnServer(name: string): Promise<TodoList> {
    const res = await fetch(LISTS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return res.json();
  }

  async function addList() {
    if (!newListName.trim()) return;

    const list = await createListOnServer(newListName.trim());
    setLists(prev => [...prev, list]);
    setSelectedListId(list._id);
    setNewListName("");
    setIsListsOpen(false);
  }

  async function addTodo() {
    if (!title.trim() || !selectedListId) return;
    const res = await fetch(TODOS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, listId: selectedListId }),
    });
    const todo = await res.json();
    setTodos(prev => [...prev, todo]);
    setTitle("");
  }

  async function toggleTodo(id: string) {
    const res = await fetch(`${TODOS_API}/${id}`, { method: "PATCH" });
    const updated = await res.json();
    setTodos(prev => prev.map(t => (t._id === id ? updated : t)));
  }

  async function deleteTodo(id: string) {
    await fetch(`${TODOS_API}/${id}`, { method: "DELETE" });
    setTodos(prev => prev.filter(t => t._id !== id));
  }

  async function deleteList(id: string) {
    if (lists.length <= 1) {
      return;
    }

    await fetch(`${LISTS_API}/${id}`, { method: "DELETE" });

    setLists(prev => {
      const next = prev.filter(list => list._id !== id);

      if (!next.length) {
        setSelectedListId(null);
        setTodos([]);
        return next;
      }

      if (id === selectedListId) {
        setSelectedListId(next[0]._id);
      }

      return next;
    });
  }

  const currentList = lists.find(list => list._id === selectedListId);

  return (
    <main
      className={`${styles.app} ${
        theme === "dark" ? styles.appDark : styles.appLight
      }`}
    >
      <div className={styles.page}>
        <AppHeader
          theme={theme}
          onToggleTheme={() =>
            setTheme(current => (current === "dark" ? "light" : "dark"))
          }
          onToggleLists={() => setIsListsOpen(open => !open)}
        />

        <div className={styles.body}>
          <TodoMain
            currentListName={currentList?.name}
            title={title}
            onTitleChange={setTitle}
            onAddTodo={addTodo}
            todos={todos}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
          />

          <ListsPanel
            lists={lists}
            selectedListId={selectedListId}
            isOpen={isListsOpen}
            newListName={newListName}
            onChangeNewListName={setNewListName}
            onSelectList={id => {
              setSelectedListId(id);
              setIsListsOpen(false);
            }}
            onAddList={addList}
            onDeleteList={deleteList}
          />
        </div>
      </div>
    </main>
  );
}
