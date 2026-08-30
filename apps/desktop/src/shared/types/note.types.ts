export type TNoteSummary = {
  id: number;
  kind: string;
  preview: string;
  selected_text: string;
  user_note: string;
  location: string;
  source: string;
  enrichment_status: string;
  created_at: string;
};

export type TSourceSummary = {
  id: number;
  kind: string;
  title: string;
  subtitle: string;
  note_count: number;
};

export type TListNotesResult = {
  notes: TNoteSummary[];
};

export type TListSourcesResult = {
  sources: TSourceSummary[];
};
