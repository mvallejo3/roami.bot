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

export interface CreateBucketInput {
  name: string;
  region: string;
}

export interface BucketResponse {
  bucket: {
    name: string;
    region: string;
  };
  status: string;
}

export interface CreateKnowledgeBaseInput {
  name: string;
  description?: string;
  project_id?: string;
  embedding_model_uuid?: string;
  database_id?: string;
  datasources: Array<{
    spaces_data_source: {
      bucket_name: string;
      region: string;
    };
  }>;
}

export interface KnowledgeBaseResponse {
  knowledge_base: KnowledgeBase;
  status: string;
}

export interface DataSourceJob {
  completed_at: string | null;
  data_source_uuid: string;
  indexed_file_count: string;
  indexed_item_count: string;
  started_at: string;
  status: string;
  total_bytes: string;
  total_bytes_indexed: string;
  total_file_count: string;
}

export interface LastIndexingJobDetails {
  completed_datasources: number;
  created_at: string;
  data_source_jobs: DataSourceJob[];
  finished_at: string | null;
  is_report_available: boolean;
  knowledge_base_uuid: string;
  phase: string;
  started_at: string;
  status: string;
  tokens: number;
  total_datasources: number;
  total_tokens: string;
  updated_at: string;
  uuid: string;
}

export interface KnowledgeBaseWithTags extends KnowledgeBase {
  tags?: string[];
}

export interface LastDatasourceIndexingJob {
  completed_at: string | null;
  data_source_uuid: string;
  status: string;
}

export interface SpacesDataSource {
  bucket_name: string;
  item_path: string;
  region: string;
}

export interface FileUploadDataSource {
  original_file_name: string;
  size_in_bytes: string;
  stored_object_key: string;
}

export interface DataSource {
  bucket_name: string;
  created_at: string;
  last_datasource_indexing_job: LastDatasourceIndexingJob | null;
  region: string;
  spaces_data_source?: SpacesDataSource;
  file_upload_data_source?: FileUploadDataSource;
  
  updated_at: string;
  uuid: string;
}

export interface KnowledgeBaseDetailsResponse {
  data_sources: DataSource[];
  database_status: string;
  knowledge_base: KnowledgeBaseWithTags;
  status: string;
}

