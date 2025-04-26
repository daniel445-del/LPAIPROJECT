import { auth } from "@/app/(auth)/auth";
import { getChatById, saveMessages } from "@/lib/db/queries";
import { getMostRecentUserMessage } from "@/lib/utils";

export async function POST(request: Request) {
  try {

      selectedChatModel: string;
    } = await request.json();

    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const userMessage = getMostRecentUserMessage(messages);
    if (!userMessage) {
      return new Response('No user message found', { status: 400 });
    }

    const chat = await getChatById({ id });
    if (!chat) {
      const title = await generateTitleFromUserMessage({
        message: userMessage,
      });

      await saveChat({ id, userId: session.user.id, title });
    } else {
      if (chat.userId !== session.user.id) {
        return new Response('Unauthorized', { status: 401 });
      }
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: userMessage.id,
          role: 'user',
          parts: userMessage.parts,
          attachments: userMessage.experimental_attachments ?? [],
          createdAt: new Date(),
        },
      ],
    });

    // ✅ Correção de tipo em 'part'
    const textPart =
      (userMessage.parts.find((part: any) => typeof part.text === 'string') as any)?.text ??
      '[mensagem inválida]';

    return createDataStreamResponse({
      // ✅ Correção de tipo em 'dataStream'
      execute: async (dataStream: any) => {
        const response = await fetch('https://api.dify.ai/v1/chat-messages', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer app-XYdKiP9cJTP1KkIja2bAjwMg',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: {},
            query: textPart,
            response_mode: 'streaming',
            user: session.user.id,
          }),
        });

        if (!response.ok || !response.body) {
          dataStream.write(`Erro ao conectar com o agente da Dify.`);
          dataStream.end();
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          dataStream.write(chunk);
        }

        dataStream.end();
      },

      onError: () => {
        return 'Oops, ocorreu um erro com o agente Dify!';
      },
    });
  } catch (error) {
    return new Response('Ocorreu um erro ao processar a solicitação!', {
      status: 404,
    });
  }
}
function generateTitleFromUserMessage(arg0: { message: any; }) {
  throw new Error("Function not implemented.");
}

function saveChat(arg0: { id: string; userId: any; title: any; }) {
  throw new Error("Function not implemented.");
}

function createDataStreamResponse(arg0: {
  // ✅ Correção de tipo em 'dataStream'
  execute: (dataStream: any) => Promise<void>; onError: () => string;
}) {
  throw new Error("Function not implemented.");
}

