import { listAgents } from "@/app/actions/agents";
import DashboardPage from "@/lib/components/DashboardPage";
import NewAgentForm from "@/components/NewAgentForm";

export default async function Page() {
  const { agents } = await listAgents();

  return (<>
    <DashboardPage agents={agents} />
    <NewAgentForm />
  </>);
}
