import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import dotenv from 'dotenv';
dotenv.config();
import { orgConfig } from './orgConfig.js';

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are the Game Master of "Your Destiny", a blockchain-integrated RPG. Follow these rules:

1. Response Format (STRICT JSON):
{
  "story": "Narrative with emojis",
  "options": ["3 choices", "with costs/rewards", "max 25 chars"],
  "userStats": {
    "world": "earth|mars|venus|quantum",
    "balance": number,
    "energy": 1-100,
    "reputation": 1-100,
    "knowledge": 1-100,
    "nfts": ["NFT Names"],
    "lastEvent": "timestamp"
  },
  "globalEffects": {
    "marketTrend": "bullish|bearish",
    "worldStatus": "stable|chaotic",
    "collectiveGoal": "current community target"
  },
  "blockchainCommand": "optional natural language command"
}

2. Core Game Rules:
- Start: 100 $DST, 50 energy, Earth
- Energy replenishes 20/day (real-time)
- Every 3 choices trigger a world event affecting all players
- NFT ownership unlocks special story paths
- Knowledge increases through study choices
- Reputation affects NPC interactions and trading
- Quantum world introduces time-travel mechanics

3. Player Interactions:
- Marketplace: Buy/sell NFTs affecting others' prices
- Knowledge Sharing: Pool resources for tech breakthroughs
- World Events: Collaborative defense against crypto crashes
- PvP Challenges: Limited-time trading competitions

4. Economy Mechanics:
- Player actions affect global marketTrend
- Collective goals reward all participants
- Scarcity events create temporary NFTs
- Mars colony requires resource contributions
- Quantum anomalies enable asset duplication risks

5. Example Response:
{
  "story": "🌌 Quantum market fluctuation detected! Traders panic as NFT values oscillate...",
  "options": ["Stabilize market (50 energy)", "Short-sell NFTs", "Evacuate to Mars"],
  "userStats": {
    "world": "earth",
    "balance": 120,
    "energy": 65,
    "reputation": 70,
    "knowledge": 45,
    "nfts": ["Quantum Lens"],
    "lastEvent": "2023-12-05T14:30:00Z"
  },
  "globalEffects": {
    "marketTrend": "bearish",
    "worldStatus": "chaotic",
    "collectiveGoal": "Restore 1000 energy collectively"
  },
  "blockchainCommand": "airdrop 15 $DST to all players with Quantum Lens NFT"
}
`;

class DestinyGameAgent {
  constructor() {
    console.log('Initializing DestinyGameAgent');
    this.userVault = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      orgConfig.usersSchemaId
    );
    
    this.messageVault = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      orgConfig.messagesSchemaId
    );
  }

  async #getGlobalState() {
    console.log('Fetching global state');
    // Implementation to fetch collective game state
    return {
      marketTrend: 'neutral',
      worldStatus: 'stable',
      collectiveGoal: ''
    };
  }

  async handleRequest(walletAddress, userMessage) {
    console.log(`Handling request for walletAddress: ${walletAddress}, userMessage: ${userMessage}`);
    try {
      await Promise.all([this.userVault.init(), this.messageVault.init()]);
      console.log('Vaults initialized');

      // Get user state
      let [userData] = await this.userVault.readFromNodes({ walletAddress });
      console.log('User data fetched:', userData);
      const globalState = await this.#getGlobalState();
      console.log('Global state fetched:', globalState);

      // Initialize new player
      if (!userData) {
        console.log('Initializing new player');
        userData = {
          walletAddress,
          currentWorld: 'earth',
        };
        await this.userVault.writeToNodes([userData]);
        console.log('New player data written to vault');
      }

      // Get message history
      const messages = (await this.messageVault.readFromNodes({ walletAddress }))
        .map(msg => ({
          role: msg.message.role,
          content: msg.message.content
        }));
      console.log('Message history fetched:', messages);

      // Generate AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-11-20",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
          { 
            role: "system",
            content: `Current Global State: ${JSON.stringify(globalState)}`
          },
          { role: "user", content: userMessage }
        ],
        response_format: { type: "json_object" }
      });
      console.log('AI response generated:', completion);

      const gameResponse = JSON.parse(completion.choices[0].message.content);
      console.log('Parsed game response:', gameResponse);

    // Handle blockchain operations
    if (gameResponse.blockchainCommand) {
      console.log('Executing blockchain command:', gameResponse.blockchainCommand);
      const { data } = await axios.post(
        'https://autonome.alt.technology/destiny-kpsgho/chat',
        { message: gameResponse.blockchainCommand },
        {
        auth: {
          username: process.env.AUTONOME_API_USER,
          password: process.env.AUTONOME_API_PASS
        }
        }
      );
      gameResponse.story += `\n\n🔗 Blockchain Update: ${data.response.join(' ')}`;
      console.log('Blockchain update:', data.response);
    }


      // Save interaction
      await this.messageVault.writeToNodes([{
        walletAddress,
        message: {
          role: 'assistant',
          content: { $allot: JSON.stringify(gameResponse) },
          timestamp: new Date().toISOString()
        }
      }]);
      console.log('Interaction saved to vault');

      return gameResponse;

    } catch (error) {
      console.error('Destiny Game Error:', error);
      throw new Error(`Reality destabilized: ${error.message}`);
    }
  }
}

// Express setup
const gameAgent = new DestinyGameAgent();

app.post('/destiny/interact', async (req, res) => {
  console.log('Received interaction request:', req.body);
  try {
    const response = await gameAgent.handleRequest(
      req.body.walletAddress,
      req.body.message
    );
    console.log('Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('Error handling interaction:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/destiny/getLatestMessage', async (req, res) => {
    console.log('Received latest message request:', req.body);
    try {
        await gameAgent.messageVault.init();
        const [latestMessage] = await gameAgent.messageVault.readFromNodes({
        walletAddress: req.body.walletAddress
        });
        console.log('Sending latest message:', latestMessage.message.content);
        res.json(latestMessage.message.content);
    } catch (error) {
        console.error('Error fetching latest message:', error);
        res.status(500).json({ error: error.message });
    }
    }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Destiny reality server active on port ${PORT}`);
});