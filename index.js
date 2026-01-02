const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");

require("dotenv").config();

// 🔒 Verificação de TOKEN (Railway)
if (!process.env.TOKEN) {
  console.log("❌ TOKEN não encontrado. Configure no Railway (Variables).");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// ✅ Bot online
client.once("clientReady", () => {
  console.log(`✅ Logado como ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "PRF • Avisos Oficiais" }],
    status: "online",
  });
});

// 📌 Interações
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // 🟢 /pingprf
  if (interaction.commandName === "pingprf") {
    return interaction.reply({
      content: "✅ Bot PRF online e operando!",
      ephemeral: true,
    });
  }

  // 🚨 /aviso
  if (interaction.commandName === "aviso") {
    const member = interaction.member;

    // 🔐 Permissões
    const allowed =
      member.permissions.has(PermissionsBitField.Flags.Administrator) ||
      member.permissions.has(PermissionsBitField.Flags.ManageGuild) ||
      member.permissions.has(PermissionsBitField.Flags.ManageMessages);

    if (!allowed) {
      return interaction.reply({
        content: "❌ Você não tem permissão para enviar avisos oficiais.",
        ephemeral: true,
      });
    }

    // 📥 Opções do comando
    const titulo = interaction.options.getString("titulo", true);
    const mensagemExtra = interaction.options.getString("mensagem", false);
    const canalEscolhido = interaction.options.getChannel("canal");
    const cargo = interaction.options.getRole("cargo");

    const canal = canalEscolhido ?? interaction.channel;
    const mentionText = cargo ? `<@&${cargo.id}>` : "";

    // 📦 EMBED PROFISSIONAL PRF (GRANDE)
    const embed = new EmbedBuilder()
      .setColor(0x0f7ae5)
      .setTitle(`🚨 ${titulo} 🚨`)
      .setDescription(
        "**📢 COMUNICADO OFICIAL DA POLÍCIA RODOVIÁRIA FEDERAL**\n\n" +
          "A Diretoria-Geral da PRF informa a todos os seus integrantes sobre a seguinte deliberação:"
      )

      .addFields({ name: "━━━━━━━━━━━━━━━━━━━━", value: "⠀" })

      .addFields(
        { name: "📅 DATA", value: "**A DEFINIR / INFORMADO NO TEXTO**", inline: true },
        { name: "⏰ HORÁRIO", value: "**A DEFINIR**", inline: true },
        { name: "📍 LOCAL", value: "**DISCORD OFICIAL PRF**", inline: true }
      )

      .addFields({ name: "━━━━━━━━━━━━━━━━━━━━", value: "⠀" })

      .addFields({
        name: "📌 INFORMAÇÕES",
        value:
          mensagemExtra ??
          "Informações detalhadas constam neste aviso oficial.",
      })

      .addFields({
        name: "⚠️ ATENÇÃO",
        value:
          "**PRESENÇA OBRIGATÓRIA.**\n" +
          "O não comparecimento sem justificativa plausível poderá acarretar **medidas disciplinares**, conforme normas internas.",
      })

      .addFields({
        name: "🛡️ MENSAGEM DA DIRETORIA",
        value:
          "A PRF segue firme em seus princípios de **disciplina, hierarquia e compromisso**.\n" +
          "Quem permanece, permanece para **somar**.",
      })

      .addFields({ name: "━━━━━━━━━━━━━━━━━━━━", value: "⠀" })

      .setThumbnail("https://i.imgur.com/8Q2Q9vM.png")
      .setImage("https://i.imgur.com/2yKp7YV.png")

      .setFooter({
        text: "PRF • Aviso Oficial • Diretoria Geral",
      })
      .setTimestamp();

    // 📤 Envio
    await canal.send({
      content: mentionText,
      embeds: [embed],
    });

    // ✅ Confirmação
    await interaction.reply({
      content: `✅ Aviso enviado com sucesso em ${canal}.`,
      ephemeral: true,
    });
  }
});

// 🔑 Login
client.login(process.env.TOKEN);
