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
    const res = await axios.get(`https://api.hyperliquid.market/v1/fills/nft`);
    const sales = res.data;

    for (const sale of sales) {
      if (
        sale.contract.toLowerCase() === contractAddress &&
        sale.txHash !== lastTx
      ) {
        lastTx = sale.txHash;

        const embed = {
          title: `CapyBros NFT Sold! 🎉`,
          description: `Token ID: **#${sale.tokenId}**\nPrice: **${sale.price} HYPE**`,
          fields: [
            { name: 'Marketplace', value: '[Drip.trade](https://drip.trade/)' },
            { name: 'Token', value: `[View Token](https://drip.trade/token/${sale.contract}/${sale.tokenId})` },
          ],
          image: {
            url: `https://bafybeiaxrxose2a5rqc5awcgdkvweu754ru6vae57ikxpaubedpenzsc7e.ipfs.w3s.link/${sale.tokenId}.png`,
          },
          footer: { text: `Tx: ${sale.txHash}` },
          timestamp: new Date().toISOString(),
          color: 0x00ffcc,
        };

        const channel = await client.channels.fetch(channelId);
        channel.send({ embeds: [embed] });
        console.log(`✅ New CapyBros sale posted.`);
      }
    }
  } catch (err) {
    console.error('Error fetching sales:', err.message);
  }
}

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  setInterval(fetchSales, 20000); // every 20s
});

client.login(process.env.DISCORD_TOKEN);
