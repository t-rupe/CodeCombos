import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { OpenAI } from "openai"; // Ensure you've installed the openai npm package

// Set up your OpenAI API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateRandomIdea = createTRPCRouter({
  // ... other procedures ...

  generateProjectIdea: publicProcedure.input(z.object({})).mutation(async () => {
    // Call to OpenAI API to generate project idea
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content:
              "Provide a technology stack and project idea for a web development project. Format the response as follows: Begin and end the frontend technologies section with '#', backend technologies with '^', database technologies with '$', additional tools with '*', and the project idea description with '!'. The project idea should have a title and a description. Choose only 1 frontend, backend and database technology, but additional tools can have multiple. Include details such as category, difficulty, use case, and documentation link for each technology. Don't always recommend React,     Node.js, and MongoDB.",
          },
        ],
        model: "gpt-4", // Specify the chat model you want to use
      });

      // Assuming the chatCompletion object has the response directly in it
      const idea = chatCompletion.choices[0].message.content.trim();
      return idea; // Send back the generated idea
    } catch (error) {
      console.error("Error generating project idea:", error);
      throw new Error("Failed to generate project idea.");
    }
  }),
});

// Export type definition of API
export type ProjectIdeaRouter = typeof generateRandomIdea;
