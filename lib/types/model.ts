/**
 * Model type definitions
 */

export interface Model {
  id: string;
  name: string;
  uuid: string;
  agreement: {
    description: string;
    name: string;
    url: string;
    uuid: string;
  };
  created_at: string; // ISO8601 date string
  updated_at: string; // ISO8601 date string
  is_foundational: boolean;
  parent_uuid: string;
  upload_complete: boolean;
  version: {
    major: number;
  };
}

