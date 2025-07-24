import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const channelId = process.env.CHANNEL_ID;
const contractAddress = process.env.CONTRACT_ADDRESS?.toLowerCase();

// Simulate 1 sale (hardcoded)
const simulateManualSale = async () => {
  const sale = {
    tokenId: 271,
    price: '0.1',
    contract: contractAddress,
    txHash: '0x7eb7ad15c5b7d3c64d4208c73076340a21fe57c82cb6023d5e8f23cd94c4fc0c',
  };

  const embed = {
    title: `🎉 CapyBros NFT Sold!`,
    description: `Token ID: **#${sale.tokenId}**\nPrice: **${sale.price} HYPE**`,
    fields: [
      { name: 'Marketplace', value: '[Drip.trade](https://drip.trade/)' },
      {
        name: 'Token',
        value: `[View Token](https://drip.trade/token/${sale.contract}/${sale.tokenId})`,
      },
    ],
    image: {
      url: `https://bafybeiaxrxose2a5rqc5awcgdkvweu754ru6vae57ikxpaubedpenzsc7e.ipfs.w3s.link/${sale.tokenId}.png`,
    },
    footer: {
      text: `Tx: ${sale.txHash}`,
    },
    timestamp: new Date().toISOString(),
    color: 0x00ffcc,
  };

  try {
    const channel = await client.channels.fetch(channelId);
    await channel.send({ embeds: [embed] });
    console.log(`✅ Simulated sale posted!`);
  } catch (err) {
    console.error(`❌ Failed to send embed: ${err.message}`);
  }
};

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  simulateManualSale();
});

client.login(process.env.DISCORD_TOKEN);
