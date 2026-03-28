import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";
import { deleteNote } from "@/lib/api";
import Link from "next/link";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // Локальний стан для зберігання ID нотаток, які наразі видаляються
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  //Налаштування мутації для видалення нотаток
  const { mutate: removeNote } = useMutation({
    mutationFn: deleteNote,
    onMutate: (id) => {
      setDeletingIds((prev) => [...prev, id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
    onError: (error) => {
      console.error(error);
    },
    onSettled: (_, __, id) => {
      setDeletingIds((prev) => prev.filter((prevId) => prevId !== id));
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link href={`/notes/${note.id}`}>View details</Link>
            <button
              type="button"
              className={css.button}
              disabled={deletingIds.includes(note.id)}
              onClick={() => removeNote(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
