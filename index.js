const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const prefix = "!";

client.once("clientReady", () => {
  console.log(`✅ Bot conectado como ${client.user.tag}`);
});

function parseTime(time) {
  if (!time) return null;

  const num = parseInt(time);

  if (time.endsWith("s")) return num * 1000;
  if (time.endsWith("m")) return num * 60 * 1000;
  if (time.endsWith("h")) return num * 60 * 60 * 1000;
  if (time.endsWith("d")) return num * 24 * 60 * 60 * 1000;

  return null;
}

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  // AVATAR
  if (command === "avatar") {

    const user = message.mentions.users.first() || message.author;

    message.reply(`🖼 Avatar de **${user.tag}**\n${user.displayAvatarURL({ size: 1024 })}`);

  }

  // WARN
  if (command === "warn") {

    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ") || "Sin razón";

    if (!user) return message.reply("❌ Debes mencionar a un usuario.");

    message.channel.send(`⚠️ **${user.tag}** fue advertido.\n📄 Motivo: ${reason}`);

  }

  // BAN
  if (command === "ban") {

    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("❌ No tienes permiso para banear.");

    const user = message.mentions.members.first();

    if (!user) return message.reply("❌ Debes mencionar un usuario.");

    await user.ban();

    message.channel.send(`🔨 **${user.user.tag}** fue baneado por **${message.author.tag}**`);

  }

  // MUTE
  if (command === "mute") {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply("❌ No tienes permiso.");

    const user = message.mentions.members.first();
    const tiempo = args[1];
    const reason = args.slice(2).join(" ") || "Sin razón";

    if (!user) return message.reply("❌ Debes mencionar un usuario.");

    const ms = parseTime(tiempo);

    if (!ms) return message.reply("⏱ Usa tiempo válido: 10m / 1h / 1d");

    await user.timeout(ms, reason);

    message.channel.send(
      `🔇 **${user.user.tag}** fue muteado\n⏱ Tiempo: **${tiempo}**\n📄 Motivo: **${reason}**`
    );

  }

  // UNMUTE
  if (command === "unmute") {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply("❌ No tienes permiso.");

    const user = message.mentions.members.first();

    if (!user) return message.reply("❌ Debes mencionar un usuario.");

    await user.timeout(null);

    message.channel.send(`🔊 **${user.user.tag}** fue desmuteado.`);

  }

  // LOCK
  if (command === "lock") {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply("❌ No tienes permiso.");

    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: false
    });

    message.channel.send("🔒 **Canal bloqueado.**");

  }

  // UNLOCK
  if (command === "unlock") {

    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
      return message.reply("❌ No tienes permiso.");

    await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
      SendMessages: true
    });

    message.channel.send("🔓 **Canal desbloqueado.**");

  }

});

client.login(process.env.TOKEN);
