import PageHeader from "@/lib/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function DatasourcesPage() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <PageHeader
        title="Datasources"
        description="Manage your datasources"
      />
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-foreground-secondary">
            Datasources page coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

