import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNote.module.css";

export default async function CreateNote() {
  const tags = [
    {
      id: "Todo",
      name: "Todo",
      description: "Tasks to be done",
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "Work",
      name: "Work",
      description: "Work-related tasks",
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "Personal",
      name: "Personal",
      description: "Personal tasks",
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "Meeting",
      name: "Meeting",
      description: "Meeting notes",
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "Shopping",
      name: "Shopping",
      description: "Shopping list",
      createdAt: "",
      updatedAt: "",
    },
  ];

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm tags={tags} />
      </div>
    </main>
  );
}
