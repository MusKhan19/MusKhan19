require('dotenv').config();
const fs = require('fs');
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const prefix = '!';

client.commands = new Map();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const [commandName, ...args] = message.content.slice(prefix.length).trim().split(' ');
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred while executing the command.');
  }
});

client.on('messageCreate', (message) => {
  // Call the chatlog module's execute function
  const chatlogCommand = client.commands.get('chatlog');
  if (chatlogCommand) {
    chatlogCommand.execute(message);
  }
  // Add any other message handling or commands here
});

client.login(process.env.BOT_TOKEN);
