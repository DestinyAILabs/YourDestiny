import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { orgConfig } from './orgConfig.js';

// $allot signals that the value will be encrypted to one $share per node before writing to the collection. Encrypt messages
const data = [
    {
        walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
        currentWorld: 'earth'
    }
];



async function main() {
  try {
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      orgConfig.usersSchemaId
    );
    await collection.init();

    // const dataWritten = await collection.writeToNodes(data);

    // const newIds = [
    //   ...new Set(dataWritten.map((item) => item.result.data.created).flat()),
    // ];
    // console.log('created ids:', newIds);

    const dataRead = await collection.readFromNodes({});
    console.log(
      '📚 Read new records:',
      JSON.stringify(dataRead)
    );
  } catch (error) {
    console.error('❌ Failed to use SecretVaultWrapper:', error.message);
    process.exit(1);
  }
}

main();