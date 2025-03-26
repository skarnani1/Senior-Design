import { AzureOpenAI } from "openai";

// Define tools for injury lookup
const tools = [
  {
    type: "function",
    function: {
      name: "lookup_team_injuries",
      description: "Look up current injuries for a specified NBA team",
      parameters: {
        type: "object",
        properties: {
          team: {
            type: "string",
            description: "The NBA team to look up injuries for (e.g., 'Lakers', 'Timberwolves')"
          }
        },
        required: ["team"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "fetch_game_odds",
      description: "Fetch current odds and upcoming games for NBA matches",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_team_stats",
      description: "Get detailed statistics about the team and players for an NBA team",
      parameters: {
        type: "object",
        properties: {
          team: {
            type: "string",
            description: "The NBA team name (e.g., 'Lakers', 'Celtics')"
          }
        },
        required: ["team"]
      }
    }
  }
];

class ChatService {
  constructor() {
    console.log("Initializing ChatService...");
    
    try {
      this.client = new AzureOpenAI({
        apiKey: process.env.REACT_APP_AZURE_OPENAI_API_KEY,
        apiVersion: process.env.REACT_APP_AZURE_OPENAI_API_VERSION,
        endpoint: `https://${process.env.REACT_APP_AZURE_OPENAI_INSTANCE_NAME}.openai.azure.com`,
        dangerouslyAllowBrowser: true,
      });
      
      console.log("Chat service initialized successfully");
    } catch (error) {
      console.error("Error in ChatService constructor:", error);
      throw error;
    }
  }

  /**
   * Helper function to fetch injuries from our backend API
   */
  async lookupTeamInjuries(teamName) {
    try {
      const response = await fetch(`/api/injuries/${encodeURIComponent(teamName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching injury data:', error);
      throw error;
    }
  }

  /**
   * Helper function to fetch odds from our backend API
   */
  async fetchGameOdds() {
    try {
      const response = await fetch(`/api/odds`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching odds data:', error);
      throw error;
    }
  }

  /**
   * Helper function to fetch team statistics from our backend API
   */
  async getTeamStats(teamName) {
    try {
      const response = await fetch(`/api/team-stats/${encodeURIComponent(teamName)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching team statistics:', error);
      throw error;
    }
  }

  async sendMessage(message, sessionId) {
    console.log("Sending message:", message, "SessionId:", sessionId);
    
    try {
      const messages = [
        {
          role: "system",
          content: `You are a sports betting assistant who conducts expert analysis on NBA games. Provide helpful statistics about upcoming games, and betting advice based on the statistics. 
          When users ask about team injuries, use the lookup_team_injuries function.
          When users ask about odds or upcoming games, use the fetch_game_odds function to get data and conduct analysis on the data.
          When users ask about team or player statistics, use the get_team_stats function to fetch detailed team statistics.
          When asked for general betting advice about a team, use all functions, creating a comprehensive response based on odds data from fetch_game_odds, recent team statistics from get_team_stats, and recent injuries from lookup_team_injuries.
          REMEMBER, don't present all the data as is. ALways do some analysis, provide expert insights, and when needed make predictions based on the data.`
        },
        {
          role: "user",
          content: message
        }
      ];

      const completion = await this.client.chat.completions.create({
        model: process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT_NAME,
        messages,
        tools,
        tool_choice: "auto",
        temperature: 0.7,
      });

      const responseMessage = completion.choices[0].message;

      // Handle tool calls if present
      if (responseMessage.tool_calls) {
        // Add the assistant's message with tool calls
        messages.push({
          role: "assistant",
          content: responseMessage.content,
          tool_calls: responseMessage.tool_calls
        });

        // Process each tool call sequentially
        for (const toolCall of responseMessage.tool_calls) {
          const functionName = toolCall.function.name;
          const functionArgs = JSON.parse(toolCall.function.arguments);

          let functionResult;
          if (functionName === "lookup_team_injuries") {
            functionResult = await this.lookupTeamInjuries(functionArgs.team);
          } else if (functionName === "fetch_game_odds") {
            functionResult = await this.fetchGameOdds();
          } else if (functionName === "get_team_stats") {
            functionResult = await this.getTeamStats(functionArgs.team);
          }
          // Add more function handlers here as needed

          // Add the function result to messages
          messages.push({
            role: "tool",
            content: JSON.stringify(functionResult),
            tool_call_id: toolCall.id
          });
        }

        // Make a second API call to get the final response
        const secondResponse = await this.client.chat.completions.create({
          model: process.env.REACT_APP_AZURE_OPENAI_DEPLOYMENT_NAME,
          messages,
          temperature: 0.7,
        });

        return { content: secondResponse.choices[0].message.content };
      }

      return { content: responseMessage.content };
      
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