import dotenv from 'dotenv';
dotenv.config();

export const orgConfig = {
  usersSchemaId: "640e7f54-2003-44e0-8599-0e68665b9ad5",
  messagesSchemaId: "7c4780f4-1709-4e2c-a258-f8a9cf05b09e",
  orgCredentials: {
    secretKey: process.env.NILLION_ORG_SECRET_KEY,
    orgDid: process.env.NILLION_ORG_DID,
  },
  nodes: [
    {
      url: 'https://nildb-zy8u.nillion.network',
      did: 'did:nil:testnet:nillion1fnhettvcrsfu8zkd5zms4d820l0ct226c3zy8u',
    },
    {
      url: 'https://nildb-rl5g.nillion.network',
      did: 'did:nil:testnet:nillion14x47xx85de0rg9dqunsdxg8jh82nvkax3jrl5g',
    },
    {
      url: 'https://nildb-lpjp.nillion.network',
      did: 'did:nil:testnet:nillion167pglv9k7m4gj05rwj520a46tulkff332vlpjp',
    },
  ],
};