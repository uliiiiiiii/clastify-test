import styles from "../page.module.css";

type Props = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onToggleLists: () => void;
};

export function AppHeader({ theme, onToggleTheme, onToggleLists }: Props) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>ToDo App</h1>
      <div className={styles.headerControls}>
        <button
          type="button"
          aria-label="Toggle light and dark mode"
          className={`${styles.themeToggle} ${
            theme === "dark" ? styles.themeToggleDark : styles.themeToggleLight
          }`}
          onClick={onToggleTheme}
        >
          <span className={styles.themeIcon}>
            {theme === "dark" ? "🌙" : "☀️"}
          </span>
        </button>
        <button
          type="button"
          className={styles.listsToggleButton}
          onClick={onToggleLists}
        >
          Lists
        </button>
      </div>
    </header>
  );
}

