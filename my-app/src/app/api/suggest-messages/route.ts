import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';

export async function POST(){
   try {
      const prompt = `
      Generate exactly three anonymous, friendly, open-ended questions.

      Separate each question with ||

      Return only the questions and nothing else.
      `;

      const {text} = await generateText({
         model: openai('gpt-5'),
         prompt
      })

      return Response.json({
         success: true,
         message: text
      });
   } catch (error) {
    console.error("Error generating message:", error);

    return Response.json(
        {
            success: false,
            message: "Failed to generate message",
        },
        { status: 500 }
    );
}
}