// /notes/[id] – сторінка деталей однієї нотатки (динамічний маршрут).
//  На цій сторінці відображається повна інформація про одну нотатку за її id.

import NoteDetailsClient from "./NoteDetails.client";
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
