export type ArtifactStatus = "captured" | "transformed" | "published" | "measured";

export type ArtifactType =
  | "commit"
  | "retro"
  | "design"
  | "note"
  | "screenshot"
  | "tutorial"
  | "snippet";

export interface Artifact {
  id: string;
  source: string;
  type: ArtifactType;
  content: string;
  attachments?: string[];
  metadata: {
    tags: string[];
    createdAt: string;
    author?: string;
    sprint?: string;
    visibility?: "internal" | "public";
  };
  transformers: string[];
  status: ArtifactStatus;
}