import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(process.env.RESEND_API_KEY || '');

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, topic, message, honeypot } = data;

    // Server-side honeypot check
    if (honeypot) {
      return new Response(JSON.stringify({ error: 'Bot detected' }), { status: 400 });
    }

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const adminEmail = 'giorgiodicristofalo77@gmail.com';
    const senderEmail = 'Portfolio Contact <onboarding@resend.dev>'; // Da cambiare in no-reply@giorgiodicristofalo.com

    // Invia entrambe le email in parallelo
    const [adminResponse, clientResponse] = await Promise.all([
      // 1. Notifica a te (Admin)
      resend.emails.send({
        from: senderEmail,
        to: [adminEmail],
        reply_to: email, // Se fai "Rispondi", rispondi direttamente al cliente
        subject: `New Contact Request: [${topic}] from ${name}`,
        html: `
          <h2>New Contact Request from Portfolio</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Topic:</strong> ${topic}</p>
          <br/>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      }),
      // 2. Email automatica di cortesia al Cliente
      resend.emails.send({
        from: senderEmail,
        to: [email],
        reply_to: adminEmail, // Se il cliente risponde a questa mail automatica, arriva a te
        subject: `Grazie per avermi contattato, ${name}`,
        html: `
          <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <p>Ciao ${name},</p>
            <p>Questa è un'email automatica per confermarti di aver ricevuto il tuo messaggio riguardante <strong>"${topic}"</strong>.</p>
            <p>Leggerò la tua richiesta e ti risponderò il prima possibile all'indirizzo che mi hai lasciato.</p>
            <br/>
            <p>A presto,</p>
            <p><strong>Giorgio Di Cristofalo</strong><br/>
            <a href="https://giorgiodicristofalo.com" style="color: #5B7FA0;">giorgiodicristofalo.com</a></p>
            <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
            <p style="font-size: 12px; color: #888;">
              <em>Riepilogo del tuo messaggio:</em><br/>
              ${message.replace(/\n/g, '<br/>')}
            </p>
          </div>
        `,
      })
    ]);

    if (adminResponse.error || clientResponse.error) {
      console.error('Resend Error:', adminResponse.error || clientResponse.error);
      return new Response(JSON.stringify({ error: 'Failed to send one or more emails' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, data: adminResponse.data }), { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
