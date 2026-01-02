const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`✅ Logado como ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "PRF • Avisos oficiais" }],
    status: "online",
  });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // ✅ /pingprf
  if (interaction.commandName === "pingprf") {
    return interaction.reply({ content: "✅ Bot PRF online!", ephemeral: true });
  }

  // ✅ /aviso
  if (interaction.commandName === "aviso") {
    const member = interaction.member;

    // Permissão pra usar o comando
    const allowed =
      member.permissions.has(PermissionsBitField.Flags.Administrator) ||
      member.permissions.has(PermissionsBitField.Flags.ManageGuild) ||
      member.permissions.has(PermissionsBitField.Flags.ManageMessages);

    if (!allowed) {
      return interaction.reply({
        content: "❌ Você não tem permissão para enviar avisos.",
        ephemeral: true,
      });
    }

    const titulo = interaction.options.getString("titulo", true);
    const mensagem = interaction.options.getString("mensagem", true);

    // Canal opcional: se escolher um canal, manda lá
    // se não escolher, manda no canal atual
    const canalEscolhido = interaction.options.getChannel("canal");
    const canal = canalEscolhido ?? interaction.channel;

    // Menção opcional (cargo)
    const cargo = interaction.options.getRole("cargo"); // pode ser null
    const mentionText = cargo ? `<@&${cargo.id}>` : "";

    const embed = new EmbedBuilder()
      .setTitle(`📢 ${titulo}`)
      .setDescription(mensagem)
      .setFooter({ text: "PRF • Aviso Oficial" })
      .setTimestamp();

    await canal.send({ content: mentionText, embeds: [embed] });

    return interaction.reply({
      content: `✅ Aviso enviado em ${canal}.`,
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);