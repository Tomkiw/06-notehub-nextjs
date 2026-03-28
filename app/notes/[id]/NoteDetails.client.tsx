"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <>
      {isLoading ? (
        <p>Loading, please wait...</p>
      ) : isError || !note ? (
        <p>Something went wrong.</p>
      ) : (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.tag}>{note.tag}</p>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
          </div>
        </div>
      )}
    </>
  );
}

//Обов‘язково у клієнтському компоненті NoteDetailsClient опрацюйте стани isLoading, error
// та випадок коли детальну інформацію по нотатці не було отримано в клієнтському компоненті NoteDetailsClient.
//  Поки що буде достатньо повернути наступну розмітку:
