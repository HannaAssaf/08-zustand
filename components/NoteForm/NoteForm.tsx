"use client";
import { useId } from "react";
import * as Yup from "yup";
import css from "../NoteForm/NoteForm.module.css";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { TagType } from "@/lib/api";

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content can be at most 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

interface Props {
  tags: TagType[];
}

export default function NoteForm({ tags }: Props) {
  const fieldId = useId();

  const router = useRouter();

  const handleCancel = () => router.push("/notes/filter/All");

  const handleSubmit = async (formData: FormData) => {
    const rawValues = Object.fromEntries(formData.entries());
    try {
      const values = await NoteSchema.validate(rawValues);
      toast.success("Note created successfully");
      router.push("/notes/filter/All");
      console.log(values);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create note");
      }
    }
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          type="text"
          name="title"
          className={css.input}
          id={`${fieldId}-title`}
        />
      </div>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <input
          type="text"
          name="content"
          // rows={8}
          className={css.textarea}
          id={`${fieldId}-content`}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select name="tag" className={css.select} id={`${fieldId}-tag`}>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton} disabled={false}>
          Create Note
        </button>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
