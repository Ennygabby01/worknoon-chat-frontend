import { ChatView } from "@/features/chat/ChatView";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function ConversationPage({ params }: Params) {
  const { id } = await params;
  return <ChatView conversationId={id} />;
}
