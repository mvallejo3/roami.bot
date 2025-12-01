import PageHeader from "@/lib/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function KnowledgeBasesPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground pt-16">
      <PageHeader
        title="Knowledge Bases"
        description="Manage your knowledge bases"
      />
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-foreground-secondary">
            Knowledge bases page coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

