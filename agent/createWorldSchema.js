import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { orgConfig } from './orgConfig.js';
import worldSchema from './worldSchema.json' assert { type: 'json' };

async function main() {
  try {
    const org = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials
    );
    await org.init();

    // create a new collectionschema
    const newWorldSchema = await org.createSchema(worldSchema, 'worlds');
    console.log('📚 New World Schema:', newWorldSchema);

  } catch (error) {
    console.error('❌ Failed to use SecretVaultWrapper:', error.message);
    process.exit(1);
  }
}

main();