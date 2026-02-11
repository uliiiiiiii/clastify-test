import { Todo } from "@/types/todo";
import styles from "../page.module.css";

type Props = {
  currentListName?: string;
  title: string;
  onTitleChange: (value: string) => void;
  onAddTodo: () => void;
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
};

export function TodoMain({
  currentListName,
  title,
  onTitleChange,
  onAddTodo,
  todos,
  onToggleTodo,
  onDeleteTodo,
}: Props) {
  return (
    <section className={styles.mainColumn}>
      <h2 className={styles.listHeading}>{currentListName ?? "Tasks"}</h2>

      <div className={styles.inputRow}>
        <input
          value={title}
          onChange={e => onTitleChange(e.target.value)}
          placeholder="Add a new task..."
          className={styles.input}
        />
        <button onClick={onAddTodo} className={styles.button}>
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
            onClick={() => onToggleTodo(todo._id)}
          >
            <span className={styles.text}>{todo.title}</span>

            <button
              onClick={e => {
                e.stopPropagation();
                onDeleteTodo(todo._id);
              }}
              className={styles.delete}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

