// Vercel Serverless Function: api/notify.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { grupoId, grupoNombre, categoriaKey, fecha, asistencia } = req.body;

    const envMap = {
      parvularia: process.env.DISCORD_WEBHOOK_PARVULARIA || "https://discord.com/api/webhooks/1567538090560589905/5YKKxnw2U1mj3thwV1UD-Pl4iBsV4Qi2H-_-eVMBFkkMSo79tmIQcWhCyqs7TtmU83Wz",
      primer_ciclo: process.env.DISCORD_WEBHOOK_PRIMER_CICLO || "https://discord.com/api/webhooks/1567538341870837860/B1LX9s3um4KSBNG7GR-UO3xk3H9pUDw5wjPNPPt33CCoGnAmgCYtjH7vkRdPZkhKTPFv",
      segundo_ciclo: process.env.DISCORD_WEBHOOK_SEGUNDO_CICLO || "https://discord.com/api/webhooks/1567538539757834402/uKEVwGmJZsnq1WXbzHQDgOVn6K-8S_JApXmNHJDvuIzdUgpNbb7E94FEmly4LVrzDNou",
      tercer_ciclo: process.env.DISCORD_WEBHOOK_TERCER_CICLO || "https://discord.com/api/webhooks/1567538760244142241/SnvUQEo-Cc35NYr97-6sbXb3G6MDVRSQm-8zlkD54KEw3NCeoBsoTR8SqG2DA2JJDmu1",
      bachillerato: process.env.DISCORD_WEBHOOK_BACHILLERATO || "https://discord.com/api/webhooks/1567538935993868422/H4h2yd9FNchMV7On5WuQtbsm4yOgN-WYXmNuNtCfzkKry_f4Gd7sbwiQo1j6ev8oCMet",
    };

    const webhookUrl = envMap[categoriaKey] || envMap.parvularia;

    let puntuales = [], tardes = [], ausentes = [];
    if (asistencia) {
      Object.entries(asistencia).forEach(([nombre, estado]) => {
        if (estado === 'puntual') puntuales.push(nombre);
        else if (estado === 'tarde') tardes.push(nombre);
        else if (estado === 'ausente') ausentes.push(nombre);
      });
    }

    const embed = {
      title: `📋 Reporte de Asistencia: ${grupoNombre || 'Grupo'}`,
      color: 0x007AFF,
      timestamp: new Date().toISOString(),
      fields: [
        { name: '📅 Fecha', value: fecha || new Date().toLocaleDateString('es-ES'), inline: true },
        { name: '📊 Total Alumnos', value: `${Object.keys(asistencia || {}).length}`, inline: true },
        { name: '✅ Puntuales (' + puntuales.length + ')', value: puntuales.join('\n') || 'Ninguno', inline: false },
        { name: '⚠️ Tardanzas (' + tardes.length + ')', value: tardes.join('\n') || 'Ninguna', inline: false },
        { name: '❌ Ausentes (' + ausentes.length + ')', value: ausentes.join('\n') || 'Ninguno', inline: false },
      ],
      footer: {
        text: 'Sistema de Control de Asistencia Estudiantil · 23 Grupos Académicos',
      }
    };

    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return res.status(200).json({ success: true, message: 'Notificación enviada a Discord' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
