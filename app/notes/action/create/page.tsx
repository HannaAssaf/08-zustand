import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

export default async function CreateNote() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>Create note</h1>
      <NoteForm />
    </div>
  );
}
