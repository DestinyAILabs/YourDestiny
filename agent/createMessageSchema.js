import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { orgConfig } from './orgConfig.js';
import messageSchema from './messagesSchema.json' assert { type: 'json' };

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    );
    await org.init();

    const newMessageSchema = await org.createSchema(messageSchema, 'messages');
    console.log('📚 New Messages Schema:', newMessageSchema);

  } catch (error) {
    console.error('❌ Failed to use SecretVaultWrapper:', error.message);
    process.exit(1);
  }
}

main();