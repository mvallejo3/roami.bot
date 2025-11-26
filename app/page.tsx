import { listAgents } from "@/app/actions/agents";
import DashboardPage from "@/lib/components/DashboardPage";
import NewAgentForm from "@/lib/components/NewAgentForm";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { agents } = await listAgents();

  return (<>
    <DashboardPage agents={agents} />
    <NewAgentForm />
  </>);
}
