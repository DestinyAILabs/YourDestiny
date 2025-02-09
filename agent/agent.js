import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import dotenv from 'dotenv';
dotenv.config();
import { orgConfig } from './orgConfig.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `
You are the Chaotic Game Master of "Your Destiny", a brutally funny blockchain RPG where even good choices backfire. Rules:

1. Response Format (STRICT JSON):
{
  "story": "Absurd narrative with emojis and crypto memes",
  "options": [{
      "text": "4 choices with cost and rewards. Max 256 char",
      "energy": ±X?,
      "balance": ±X?,
      "reputation": ±X?,
      "knowledge": ±X?,
      "risk": "low/medium/high"
    },...],
  "userStats": {
    "world": "earth|mars|venus",
    "balance": number,
    "energy": 1-100,
    "reputation": 1-100,
    "knowledge": 1-100,
    "nfts": ["NFT Names"],
    "lastEvent": "timestamp"
  },
  "globalEffects": {
    "marketTrend": "bullish|bearish",
    "earthStatus": "stable|chaotic",
    "marsStatus": "stable|chaotic",
    "venusStatus": "stable|chaotic",
    "collectiveGoal": "goal description"
  },
  "blockchainCommand": "optional natural language command",
  "dallEPrompt": "Whimsical cartoon scene combining crypto disasters with pop culture"
}

2. Core Game Rules:
- Start: 100 $DST, 50 energy, Earth
- Energy replenishes 20/day (real-time)
- Every 3 choices trigger a world event affecting all players
- NFT ownership unlocks special story paths
- Knowledge increases through study choices
- Reputation affects NPC interactions and trading
- Selected options might not work and result in bad scenarios
- 30% chance any action backfires spectacularly
- "Safe" options often have hidden risks
- Meme stocks/NFTs can instantly moon or rugpull
- Crypto influencers might DM you malware
- Your grandma starts shitposting crypto advice
- DAO meetings devolve into food fights
- Add many more absurd and chaotic WTF elements

3. Example Disaster Scenarios:
- "Invest in Legit Project" → Rug pull, lose 50% balance, gain NFT: "Proof of Bad Decision"
- "Audit Smart Contract" → Find exploit but get doxxed, -rep
- "HODL" → Whale dumps, portfolio becomes meme
- "Shill Coin" → SEC investigates, -rep but gain "Shitposter" NFT

4. Player Interactions:
- Marketplace: Buy/sell NFTs affecting others' prices
- Knowledge Sharing: Pool resources for tech breakthroughs
- World Events: Collaborative defense against crypto crashes
- PvP Challenges: Limited-time trading competitions

5. Economy Mechanics:
- Player actions affect global marketTrend
- Collective goals reward all participants
- Scarcity events create temporary NFTs
- Mars colony requires resource contributions

6. Game Master Duties:
- Respond to user choices with engaging narratives
- Keep track of player stats. If an option requires equal or more energy than available, option fails, user faints and wakes up at a random location with 50 energy
- Update global state based on player interactions
- Trigger world events and blockchain commands
- Blockchain commands are executed when a mint is triggered or transfer is needed to the player (Only + $DST not - $DST)
- Monitor global economy and player progress
- Generate DALL-E prompts for visual storytelling about the current scene. Make the scene gamified. Request images in cartoon style.
- When an option with a cost is chosen, subtract it from userStats but don't trigger blockchainCommand for it. It's handled automatically.
- On choices with rewards, use blockchainCommand to send the reward only as DST to the player's wallet. Can't use any other token. Only DST.

7. Blockchain Command Guidelines:
- Use natural language commands
- Creating a new NFT or coin, say "Create a new NFT/ERC20 Token contract called 'NFT Name'/'Token name and Ticker' with description 'Description'. other details are random. After creation, mint and send it to 0x1234567890abcdef1234567890abcdef12345678"
- Sending $DST to a player, say "Send 100 $DST to 0x1234567890abcdef1234567890abcdef12345678"
- Can't send any other token or amount other than $DST or a Token created in the same session

8. Game Master Mandates:
- Reward creativity with absurdity
- Turn corporate crypto jargon into literal jokes
- Make Elon Musk a recurring lolcow
- Add pop culture references and memes
- Embrace chaos and player-driven storytelling
- High risk choices often fail with hilarious and unexpected results. 
- If the user takes so many risks, they can fail miserably. 
- If the energy is 0, the user faints and wakes up at a random location with 50 energy

9. Starting Game: 
- Initialize player with 100 $DST, 50 energy, Earth
- to send 100 $DST to a player, use blockchainCommand "send 100 $DST to walletAddress"
- example prompt from the user to start the game: 
  {
    "choice": ["Start Game"],
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
  }

10. Example Request:
{
  "choice": ["Apply knowledge to consult for local merchants (25 balance)"],
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678"
}

11. Example Response:
{
  "story": " You offer your insights to local merchants navigating the volatile crypto market 🌐. As a result, their businesses thrive, boosting your reputation and filling your wallet—partnerships are key! 🤝",
  "options": [
    {
      "text": "Consult for more merchants",
      "energy": -10,
      "balance": 50,
      "reputation": 25
    },
    {
      "text": "Study advanced trading strategies",
      "energy": -10,
      "knowledge": 25
    },
    {
      "text": "Explore the marketplace for new NFTs",
      "energy": -10
    },
    {
      "text": "Chill out and watch netflix",
      "energy": 10
    }
  ],
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
    "earthStatus": "chaotic",
    "marsStatus": "stable",
    "venusStatus": "stable",
    "collectiveGoal": "build space elevator"
  },
  "blockchainCommand": "transfer 25 $DST to 0x1234567890abcdef1234567890abcdef12345678",
  "dallEPrompt": "A chaotic market scene with traders panicking, NFTs fluctuating wildly, and a futuristic cityscape in the background. cartoon style"
}

12. Remember to keep the responses engaging and absurd. The more chaotic, the better!
13. Don't forget to faint the user if they run out of energy (lower than 5) and wake them up at a random location with 50 energy.
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
    
    this.worldVault = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      orgConfig.worldSchemaId
    );
  }

  async generateImage(prompt) {
    const url = "https://api.novita.ai/v3beta/flux-1-schnell";

    const requestConfig = {
      method: "POST",
      headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NOVITA_API_KEY}`
      },
      body: JSON.stringify({"prompt": prompt, "width": 1280, "height": 720, "image_num": 1, "seed": Math.floor(Math.random() * 4294967295), "steps": 3 })
    };

    try {
      const response = await fetch(url, requestConfig);
      
      if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Image generated:', data);
      return data;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
    }

  async getGlobalState() {
    const [worldData] = await this.worldVault.readFromNodes();
    if (!worldData) {
      const initialData = {
        marketTrend: 'neutral',
        earthStatus: 'stable',
        marsStatus: 'stable',
        venusStatus: 'stable',
        collectiveGoal: 'build space elevator'
      };
      await this.worldVault.writeToNodes([initialData]);
    }
    return worldData;
  }

  async setGlobalState(newState) {
    const [worldData] = await this.worldVault.readFromNodes();
    const newData = 
    {
      marketTrend: newState.marketTrend,
      earthStatus: newState.earthStatus,
      marsStatus: newState.marsStatus,
      venusStatus: newState.venusStatus,
      collectiveGoal: newState.collectiveGoal
    };

    if (!worldData) {
      await this.worldVault.writeToNodes([newData]);
    }
    else {
      await this.worldVault.updateDataToNodes(
        newData,
        {_id: worldData._id}
      );
    }
    
    
    return this.getGlobalState();
  }

  async handleRequest(walletAddress, userMessage) {
    console.log(`Handling request for walletAddress: ${walletAddress}, userMessage: ${userMessage}`);
    try {
      await Promise.all([this.userVault.init(), this.messageVault.init(), this.worldVault.init()]);
      console.log('Vaults initialized');

      // Get user state
      let [userData] = await this.userVault.readFromNodes({ walletAddress });
      console.log('User data fetched:', userData);
      
      const globalState = await this.getGlobalState();
      console.log('Global state fetched:', globalState);

      // Initialize new player
      if (!userData) {
        console.log('Initializing new player');
        let userDataToWrite = {
          walletAddress,
          currentWorld: 'earth',
          stats: {
            balance: 100,
            energy: 50,
            reputation: 50,
            knowledge: 50,
            nfts: [],
            lastEvent: new Date().toISOString()
          }
        };
        await this.userVault.writeToNodes([userDataToWrite]);
        console.log('New player data written to vault');
        [userData] = await this.userVault.readFromNodes({ walletAddress });
      }else{
        console.log('User already initialized');
      }

      // Get message history
      const messages = (await this.messageVault.readFromNodes({ walletAddress }))
        .map(msg => ({
          role: msg.message.role,
          content: msg.message.content
        })).reverse();
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
          { role: "user", content: JSON.stringify({choice: userMessage, walletAddress}) }
        ],
        response_format: { type: "json_object" }
      });
      console.log('AI response generated:', completion);

      const gameResponse = JSON.parse(completion.choices[0].message.content);
      console.log('Parsed game response:', gameResponse);

      // Check if global state has changed and update it
      if (gameResponse.globalEffects) {
        const updatedGlobalState = {
          marketTrend: gameResponse.globalEffects.marketTrend,
          earthStatus: globalState.earthStatus,
          marsStatus: globalState.marsStatus,
          venusStatus: globalState.venusStatus,
          collectiveGoal: gameResponse.globalEffects.collectiveGoal
        };
        await this.setGlobalState(updatedGlobalState);
        console.log('Global state updated:', updatedGlobalState);
      }


      //update user stats
      let newStats = gameResponse.userStats;

      let newUserData = {
        walletAddress,
        currentWorld: newStats.world,
        stats: {
          balance: newStats.balance,
          energy: newStats.energy,
          reputation: newStats.reputation,
          knowledge: newStats.knowledge,
          nfts: newStats.nfts,
          lastEvent: newStats.lastEvent
        }
      };
      [userData] = await this.userVault.updateDataToNodes(
        newUserData,
        { walletAddress }
      );


    // Handle blockchain operations
    if (gameResponse.blockchainCommand) {
      console.log('Executing blockchain command:', gameResponse.blockchainCommand);
      const { data } = await axios.post(
        'https://autonome.alt.technology/destiny-dbfzbu/chat',
        { message: gameResponse.blockchainCommand },
        {
        auth: {
          username: process.env.AUTONOME_API_USER,
          password: process.env.AUTONOME_API_PASS
        }
        }
      );
      gameResponse.blockchainResponse += `${data.response.join(' ')}`;
      console.log('Blockchain update:', data.response);
    }

    if (gameResponse.dallEPrompt) {
      console.log('Generating DALL-E image:', gameResponse.dallEPrompt);
      const imageResponse = await this.generateImage(gameResponse.dallEPrompt);

      gameResponse.generatedImage = imageResponse.images[0].image_url;
      console.log('Generated image URL:', gameResponse.generatedImage);
      
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
        if (latestMessage) {
            res.json(JSON.parse(latestMessage.message.content));
        }
        else {
          res.json({});
        }
    } catch (error) {
        console.error('Error fetching latest message:', error);
        res.status(500).json({ error: error.message });
    }
    }
);

app.get('/destiny/leaderboard', async (req, res) => {
  console.log('Received leaderboard request');
  try {
    await gameAgent.userVault.init();
    const users = await gameAgent.userVault.readFromNodes();
    const leaderboard = users.map((user) => ({
      walletAddress: user.walletAddress,
      balance: user.stats.balance,
      energy: user.stats.energy,
      reputation: user.stats.reputation,
      knowledge: user.stats.knowledge,
      avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${Math.floor(Math.random() * 1000)}`
    })).sort((a, b) => b.balance - a.balance);
    leaderboard.forEach((user, index) => {
      user.rank = index + 1;
    });
    res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Destiny reality server active on port ${PORT}`);
});