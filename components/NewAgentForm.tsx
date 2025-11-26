"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tabs from "./Tabs";
import { useListModelsQuery } from "@/store/features/models/modelApi";
import { useCreateAgentMutation } from "@/store/features/agents/agentApi";
import { closeForm } from "@/store/features/agentForm/agentFormSlice";
import { selectAgentFormIsOpen } from "@/store/features/agentForm/agentFormSelectors";
import type { CreateAgentInput } from "@/lib/types/agent";
import RoamiBotForm from "@/components/RoamiBotForm";
import CustomForm from "@/components/CustomForm";


export default function NewAgentForm() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectAgentFormIsOpen);
  const [createAgent] = useCreateAgentMutation();
  const [isCreating, setIsCreating] = useState(false);
  const { data: modelsData } = useListModelsQuery();
  const [agentType, setAgentType] = useState<"roami-bot" | "custom-agent">("roami-bot");
  
  const handleCreateAgent = async (data: CreateAgentInput) => {
    setIsCreating(true);
    try {
      await createAgent(data).unwrap();
      dispatch(closeForm());
    } catch (error) {
      console.error("Error creating agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-secondary border border-divider rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Create New Agent
          </h2>
          <button
            onClick={() => dispatch(closeForm())}
            className="text-foreground-secondary hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <Tabs
          tabs={[
            {
              id: "roami-bot",
              label: "Roami Bot",
              content: (
                <RoamiBotForm
                  onSubmit={handleCreateAgent}
                  isSubmitting={isCreating}
                  modelsData={modelsData}
                />
              ),
            },
            {
              id: "custom-agent",
              label: "Custom Agent",
              content: (
                <CustomForm
                  onSubmit={handleCreateAgent}
                  isSubmitting={isCreating}
                />
              ),
            },
          ]}
          defaultTab="roami-bot"
          onTabChange={(tabId) =>
            setAgentType(tabId as "roami-bot" | "custom-agent")
          }
        />
      </div>
    </div>
  );
}
