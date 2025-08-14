import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type NotesAllProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesAll({ params }: NotesAllProps) {
  const { slug } = await params;
  const tag = slug[0] === "All" ? undefined : slug[0];

  const initialData = await fetchNotes("", 1, tag);
  return <NotesClient initialData={initialData} tag={tag} />;
}
