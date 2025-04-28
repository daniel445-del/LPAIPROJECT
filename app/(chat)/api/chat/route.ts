import { auth } from "@/app/(auth)/auth";
import { saveMessages } from "@/lib/db/queries";

const questions = [
  { question: "Qual é a capital da França?", answer: "Paris" },
  { question: "Quanto é 5 + 7?", answer: "12" },
  { question: "Qual é o maior oceano do mundo?", answer: "Oceano Pacífico" },
  { question: "Quem pintou a Mona Lisa?", answer: "Leonardo da Vinci" },
];

let currentQuestionIndex = 0;

export async function POST(request: Request) {
  try {
    const { userAnswer } = await request.json();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    const currentQuestion = questions[currentQuestionIndex];

    let feedback = "";
    if (!userAnswer) {
      feedback = `Pergunta: ${currentQuestion.question}`;
    } else if (userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase()) {
      feedback = "✅ Resposta correta!";
      currentQuestionIndex++;
    } else {
      feedback = `❌ Resposta errada! Tente novamente: ${currentQuestion.question}`;
    }

    if (currentQuestionIndex >= questions.length) {
      feedback = "🎉 Quiz finalizado! Parabéns!";
      currentQuestionIndex = 0; // Reinicia o quiz
    }

    await saveMessages({
      messages: [
        {
          chatId: session.user.id,
          id: crypto.randomUUID(),
          role: 'system',
          parts: [{ text: feedback }],
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    return new Response(JSON.stringify({ feedback }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response('Erro no servidor!', { status: 500 })
  }
}
