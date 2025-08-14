import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import css from "../NoteForm/NoteForm.module.css";
import { createNote } from "../../lib/api";
import type { NoteTag } from "../../types/note";
import { toast } from "react-hot-toast";

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

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

interface NoteFormProps {
  onCloseModal: () => void;
}

const formValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

export default function NoteForm({ onCloseModal }: NoteFormProps) {
  const fieldId = useId();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
      onCloseModal();
    },
    onError() {
      toast.error("Error creating note.");
    },
  });

  const handleSubmit = (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    console.log(values);
    formikHelpers.resetForm();
    mutate({
      title: values.title,
      content: values.content ? values.content : "",
      tag: values.tag,
    });
  };

  return (
    <Formik
      initialValues={formValues}
      onSubmit={handleSubmit}
      validationSchema={NoteSchema}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            type="text"
            name="title"
            className={css.input}
            id={`${fieldId}-title`}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            name="content"
            rows={8}
            className={css.textarea}
            id={`${fieldId}-content`}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            name="tag"
            className={css.select}
            id={`${fieldId}-tag`}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={onCloseModal}
          >
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            {isPending ? "Creating new note..." : "Create Note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
