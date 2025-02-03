export const scenario = {
    start: {
      id: 'start',
      title: 'Welcome to the Blockchain',
      description: 'You materialize in a vibrant digital realm, your consciousness taking form as a newly spawned digital entity. The air buzzes with cryptographic energy, and streams of data flow through the virtual atmosphere. As you gain awareness, you notice different paths branching out before you.',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832',
      choices: [
        {
          id: '1',
          text: 'Approach the glowing marketplace filled with NFTs and digital artifacts',
          nextScenarioId: 'marketplace'
        },
        {
          id: '2',
          text: 'Follow the path to the Decentralized Finance district',
          nextScenarioId: 'defi'
        },
        {
          id: '3',
          text: 'Seek guidance from a wise blockchain elder',
          nextScenarioId: 'elder'
        }
      ]
    },
    marketplace: {
      id: 'marketplace',
      title: 'The Digital Bazaar',
      description: 'You find yourself in a bustling marketplace where digital art pieces float in the air, and creatures of all kinds trade unique tokens. The atmosphere is electric with possibility.',
      image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=2832',
      choices: [
        {
          id: '1',
          text: 'Examine a curious-looking NFT collection',
          nextScenarioId: 'start'
        },
        {
          id: '2',
          text: 'Talk to a merchant about trading basics',
          nextScenarioId: 'start'
        }
      ]
    },
    defi: {
      id: 'defi',
      title: 'DeFi District',
      description: 'Towering smart contracts rise into the digital sky, their algorithms humming with financial calculations. Liquidity pools shimmer like lakes of pure potential.',
      image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=2832',
      choices: [
        {
          id: '1',
          text: 'Investigate a yield farming protocol',
          nextScenarioId: 'start'
        },
        {
          id: '2',
          text: 'Learn about liquidity pools',
          nextScenarioId: 'start'
        }
      ]
    },
    elder: {
      id: 'elder',
      title: 'The Blockchain Elder',
      description: 'You encounter a wise entity, its form shifting between various cryptographic symbols. It emanates an aura of deep knowledge about the blockchain realm.',
      image: 'https://images.unsplash.com/photo-1645726290626-8ecc8c517e02?auto=format&fit=crop&q=80&w=2832',
      choices: [
        {
          id: '1',
          text: 'Ask about the origins of blockchain',
          nextScenarioId: 'start'
        },
        {
          id: '2',
          text: 'Seek advice about your journey',
          nextScenarioId: 'start'
        }
      ]
    }
  };