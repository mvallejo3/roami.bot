import { listKnowledgeBases } from "@/app/actions/knowledgebase";
import KnowledgeBasesPageContent from "@/lib/components/KnowledgeBasesPageContent";

export const dynamic = "force-dynamic";

export default async function KnowledgeBasesPage() {
  const result = await listKnowledgeBases();

  return (
    <KnowledgeBasesPageContent
      knowledgeBases={result.knowledge_bases}
      total={result.meta.total}
    />
  );
}

