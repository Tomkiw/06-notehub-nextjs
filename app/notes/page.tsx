// notes – сторінка списку нотатків. На цій сторінці відображається перелік усіх створених нотаток.
// Реалізовано функцію пошуку за ключовим словом, а також можливість створення нової нотатки.

import NoteDetailsClient from "@/app/notes/[id]/NoteDetails.client";
import { fetchNoteById } from "@/lib/api";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

interface NoteProps {
  params: Promise<{ id: string }>;
}

async function NoteDetailsPage({ params }: NoteProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  queryClient.prefetchQuery({
    queryKey: ["notes", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

export default NoteDetailsPage;
