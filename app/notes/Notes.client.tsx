// Усю клієнтську логіку (отримання списку нотаток за допомогою useQuery та їх відображення)
// винесіть в окремий файл компонента app/notes/Notes.client.tsx.

"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNoteById, fetchNotes } from "@/lib/api";
import css from "./NotePage.module.css";
import { useParams } from "next/navigation";

import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteForm from "@/components/NoteForm/NoteForm";

export default function NoteDetailsClient() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id } = useParams<{ id: string }>(); // Читає Id з URL

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", id],
    queryFn: () => fetchNoteById(id),
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <button
          className={css.button}
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          Create note +
        </button>
      </header>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
      {isLoading && <p>Is loading...</p>}

      {!isLoading && data?.notes && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {!isLoading && data?.notes?.length === 0 && <p>Нотаток не знайдено</p>}
    </div>
  );
}
