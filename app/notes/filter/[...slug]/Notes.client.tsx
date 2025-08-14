"use client";

import React, { useState } from "react";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./page.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { useDebouncedCallback } from "use-debounce";
import type { Note } from "@/types/note";
import type { FetchNotesProps } from "@/lib/api";

interface NotesClientProps {
  initialData: FetchNotesProps;
  tag?: string | undefined;
}

function NotesClient({ initialData, tag }: NotesClientProps) {
  const [page, setPage] = useState<number>(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [searchNote, setSearchNote] = useState<string>("");

  const updateSearchNote = useDebouncedCallback((newSearchNote: string) => {
    setSearchNote(newSearchNote);
    setPage(1);
  }, 300);

  const { data, isSuccess } = useQuery({
    queryKey: ["notes", searchNote, page, tag],
    queryFn: () => fetchNotes(searchNote, page, tag),
    placeholderData: keepPreviousData,
    initialData:
      searchNote === "" && page === 1
        ? {
            notes: initialData.notes,
            totalPages: initialData.totalPages,
          }
        : undefined,
  });

  return (
    <>
      <div className={css.app}>
        <div className={css.toolbar}>
          <SearchBox value={searchNote} onSearch={updateSearchNote} />
          {isSuccess && (
            <Pagination
              page={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </div>
        {data && data.notes.length > 0 ? (
          <NoteList notes={data.notes} />
        ) : (
          <p>No notes found.</p>
        )}
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onCloseModal={closeModal} />
          </Modal>
        )}
      </div>
    </>
  );
}

export default NotesClient;
