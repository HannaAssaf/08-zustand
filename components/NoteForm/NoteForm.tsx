"use client";
import { useId } from "react";
import * as Yup from "yup";
import css from "../NoteForm/NoteForm.module.css";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TagType, createNote, NewNoteData } from "@/lib/api";
import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "NoteForm",
  description: "NoteHub App",
  openGraph: {
    title: `NoteForm 08-zustand`,
    description: "Create your new note with React Query and Zustand",
    url: `https://08-zustand-fawn.vercel.app/notes/action/create`,
    siteName: "NoteHub",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub 08-zustand",
      },
    ],
    type: "article",
  },
};

export default function NoteForm() {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      router.push("/notes/filter/all");
    },
    onError() {
      toast.error("Error creating note.");
    },
  });

  const handleCancel = () => router.push("/notes/filter/all");

  const handleSubmit = async (formData: FormData) => {
    const rawValues = Object.fromEntries(formData) as unknown as NewNoteData;
    try {
      const values = await NoteSchema.validate(rawValues);
      toast.success("Note created successfully");
      router.push("/notes/filter/All");
      console.log(values);
      mutate(rawValues);
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
          className={css.textarea}
          id={`${fieldId}-content`}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select name="tag" className={css.select} id={`${fieldId}-tag`}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? "Creating new note..." : "Create Note"}
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
