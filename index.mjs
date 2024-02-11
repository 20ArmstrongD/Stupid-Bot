// Import necessary modules
import { config } from 'dotenv'; // Import config function from dotenv
import { Client, GatewayIntentBits } from 'discord.js'; // Import Client and GatewayIntentBits from discord.js

// Load environment variables from .env file
config();

// Create a new Discord client instance with specified intents
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Event listener for when the client is ready
client.once('ready', async () => {
    console.log('Bot is ready.'); // Log that the bot is ready

    try {
        // Create a slash command named "stupid" with description and options
        const stupidCommand = await client.application.commands.create({
            name: 'stupid',
            description: 'Drop it like its hot',
            options: [
                {
                    name: 'user',
                    description: 'The user to call a stupid',
                    type: 6,
                    required: true
                }
            ]
        });

        console.log(`Slash command "${stupidCommand.name}" registered.`); // Log that the command is registered
    } catch (error) {
        console.error('Error registering slash command:', error); // Log any errors that occur during command registration
    }
});

// Event listener for interaction (e.g., slash commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand() || interaction.user.bot) return; // If the interaction is not a command or initiated by a bot, return

    // Extract command name, options, member, and guild from the interaction
    const { commandName, options, member, guild } = interaction;

    // If the command is "stupid"
    if (commandName === 'stupid') {
        // Get the mentioned user from options
        const mentionedUser = interaction.options.getMember('user');
        if (!mentionedUser) {
            // If no user is mentioned, reply and return
            interaction.reply('You must mention a user.');
            return;
        }

        // Get sender and recipient nicknames
        const senderNickname = member.nickname || member.user.username;
        const recipientNickname = mentionedUser.nickname || mentionedUser.user.username;
        const messageContent = `${senderNickname} called ${recipientNickname} stupid.`;

        // Get the member object of the mentioned user
        const memberToMessage = guild.members.cache.get(mentionedUser.id);
        if (memberToMessage.id === client.user.id) {
            // If the bot is mentioned, reply and return
            interaction.reply(`Sorry ${senderNickname}, I can't call myself stupid!`);
            return;
        }

        // Get the channel where the interaction occurred
        const channel = interaction.channel;
        // Send the message content to the channel
        channel.send(messageContent);

        // Send a direct message to the mentioned user
        memberToMessage.send(`You're stupid`)
            .catch(error => {
                // If an error occurs while sending the message, log the error
                console.error(`Error sending message to ${recipientNickname}:`, error);
            });
    }
});

// Log in to Discord with the provided token from environment variables
client.login(process.env.DISCORD_TOKEN);
