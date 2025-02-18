import { AzureChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";

class ChatService {
  constructor() {
    console.log("Initializing ChatService...");
    // Add a map to store chat histories
    this.messageHistories = new Map();
    
    try {
      // Initialize the chat model using environment variables
      this.chatModel = new AzureChatOpenAI({
        azureOpenAIApiKey: process.env.REACT_APP_AZURE_OPENAI_API_KEY,
        azureOpenAIApiVersion: process.env.REACT_APP_AZURE_OPENAI_API_VERSION,
        azureOpenAIApiInstanceName: process.env.REACT_APP_AZURE_OPENAI_INSTANCE_NAME,
        azureOpenAIApiDeploymentName: process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT_NAME,
        temperature: 0.7,
      });
      console.log("Chat model initialized successfully");

      // Create prompt template
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a sports betting assistant. Provide helpful betting advice and always include disclaimers about responsible gambling when needed."],
        new MessagesPlaceholder("history"),
        ["human", "{input}"],
      ]);

      // Create the chain
      const chain = prompt.pipe(this.chatModel);

      // Create runnable with history
      this.chainWithHistory = new RunnableWithMessageHistory({
        runnable: chain,
        getMessageHistory: (sessionId) => {
          // Get existing history or create new one
          if (!this.messageHistories.has(sessionId)) {
            this.messageHistories.set(sessionId, new ChatMessageHistory());
          }
          return this.messageHistories.get(sessionId);
        },
        inputMessagesKey: "input",
        historyMessagesKey: "history",
      });

      console.log("Chain with history created successfully");
    } catch (error) {
      console.error("Error in ChatService constructor:", error);
      throw error;
    }
  }

  async sendMessage(message, sessionId) {
    console.log("Sending message:", message, "SessionId:", sessionId);
    try {
      const result = await this.chainWithHistory.invoke(
        {
          input: message,
        },
        {
          configurable: {
            sessionId: sessionId,
          },
        }
      );
      console.log("Received response:", result);
      
      return { content: result.content };
    } catch (error) {
      console.error("Error in sendMessage:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      throw error;
    }
  }
}

const chatService = new ChatService();
export default chatService; 