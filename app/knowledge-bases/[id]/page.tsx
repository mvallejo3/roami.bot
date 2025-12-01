import { getKnowledgeBaseDetails } from "@/app/actions/knowledgebase";
import KnowledgeBaseDetailsPageContent from "@/lib/components/KnowledgeBaseDetailsPageContent";
import { notFound } from "next/navigation";

interface KnowledgeBasePageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function KnowledgeBasePage({ params }: KnowledgeBasePageProps) {
  const { id } = await params;

  try {
    const knowledgeBaseDetails = await getKnowledgeBaseDetails(id);
    return (
      <KnowledgeBaseDetailsPageContent knowledgeBaseDetails={knowledgeBaseDetails} />
    );
  } catch (error) {
    console.error("Error fetching knowledge base details:", error);
    notFound();
  }
}

