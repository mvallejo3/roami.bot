/**
 * Knowledge Base types matching the API structure
 */

export interface LastIndexingJob {
  created_at: string;
  finished_at: string | null;
  is_report_available: boolean;
  knowledge_base_uuid: string;
  phase: string;
  started_at: string;
  status: string;
  updated_at: string;
  uuid: string;
}

export interface KnowledgeBase {
  created_at: string;
  database_id: string;
  embedding_model_uuid: string;
  last_indexing_job: LastIndexingJob | null;
  name: string;
  project_id: string;
  region: string;
  updated_at: string;
  uuid: string;
}

export interface KnowledgeBasesListResponse {
  knowledge_bases: KnowledgeBase[];
  links: {
    pages: {
      first: string;
      last: string;
    };
  };
  meta: {
    page: number;
    pages: number;
    total: number;
  };
  status: string;
}

