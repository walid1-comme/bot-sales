import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const channelId = process.env.CHANNEL_ID;
const contractAddress = process.env.CONTRACT_ADDRESS.toLowerCase();

let lastTx = '';

async function fetchSales() {
  try {
    const response = await axios.get('https://api.hyperliquid.market/v1/fills/nft');
    const sales = response.data;

    for (const sale of sales) {
      const saleContract = sale.contract.toLowerCase();
      const saleType = sale.type || ''; // check for "bid" or "sale"

      // ONLY post if:
      // 1. it's our contract
      // 2. it's a sale (not just bid)
      // 3. it's new tx
      if (
        saleContract === contractAddress &&
        sale.txHash !== lastTx &&
        saleType.toLowerCase() !== 'bid'
      ) {
        lastTx = sale.txHash;

        const embed = {
          title: `🎉 New CapyBros NFT Sale`,
          description: `**Token ID:** #${sale.tokenId}\n**Price:** ${sale.price} HYPE`,
          fields: [
            {
              name: 'Marketplace',
              value: '[View on Drip.trade](https://drip.trade/)',
            },
            {
              name: 'NFT Link',
              value: `[Token #${sale.tokenId}](https://drip.trade/token/${sale.contract}/${sale.tokenId})`,
            },
          ],
          image: {
            url: `https://bafybeiaxrxose2a5rqc5awcgdkvweu754ru6vae57ikxpaubedpenzsc7e.ipfs.w3s.link/${sale.tokenId}.png`,
          },
          footer: {
            text: `Tx Hash: ${sale.txHash}`,
          },
          timestamp: new Date().toISOString(),
          color: 0x00ffcc,
        };

        const channel = await client.channels.fetch(channelId);
        await channel.send({ embeds: [embed] });
        console.log(`✅ Posted sale for token #${sale.tokenId}`);
      }
    }
  } catch (error) {
    console.error('❌ Error fetching sales:', error.message);
  }
}

client.once('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
  setInterval(fetchSales, 15000); // every 15 seconds
});

client.login(process.env.DISCORD_TOKEN);
