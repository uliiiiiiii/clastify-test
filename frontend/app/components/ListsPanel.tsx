import { TodoList } from "@/types/list";
import styles from "../page.module.css";

type Props = {
  lists: TodoList[];
  selectedListId: string | null;
  isOpen: boolean;
  newListName: string;
  onChangeNewListName: (value: string) => void;
  onSelectList: (id: string) => void;
  onAddList: () => void;
  onDeleteList: (id: string) => void;
};

export function ListsPanel({
  lists,
  selectedListId,
  isOpen,
  newListName,
  onChangeNewListName,
  onSelectList,
  onAddList,
  onDeleteList,
}: Props) {
  return (
    <aside
      className={`${styles.listsPanel} ${
        isOpen ? styles.listsPanelOpen : ""
      }`}
    >
      <div className={styles.listsHeader}>
        <span className={styles.listsTitle}>Lists</span>
      </div>
      <ul className={styles.lists}>
        {lists.map(list => (
          <li key={list._id} className={styles.listRow}>
            <button
              type="button"
              className={`${styles.listItem} ${
                list._id === selectedListId ? styles.listItemActive : ""
              }`}
              onClick={() => onSelectList(list._id)}
            >
              {list.name}
            </button>
            <button
              type="button"
              className={styles.listDelete}
              onClick={e => {
                e.stopPropagation();
                onDeleteList(list._id);
              }}
              aria-label={`Delete list ${list.name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className={styles.newListRow}>
        <input
          className={styles.newListInput}
          placeholder="New list name..."
          value={newListName}
          onChange={e => onChangeNewListName(e.target.value)}
        />
        <button type="button" className={styles.smallButton} onClick={onAddList}>
          +
        </button>
      </div>
    </aside>
  );
}

