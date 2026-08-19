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

    // Validazione formato email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 422 });
    }

    const adminEmail = 'giorgiodicristofalo77@gmail.com';
    const senderEmail = 'Giorgio Di Cristofalo <no-reply@giorgiodicristofalo.com>'; // Richiede dominio verificato su resend.com/domains

    // 3. Prima invia la mail di cortesia al cliente
    //    Se fallisce (email rifiutata dal provider), blocchiamo tutto e avvisiamo l'utente
    const clientResponse = await resend.emails.send({
      from: senderEmail,
      to: [email],
      reply_to: adminEmail,
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
    });

    if (clientResponse.error) {
      // L'email del cliente è stata rifiutata dal provider → non inviamo nulla a noi
      console.error('Client email rejected:', clientResponse.error);
      return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 422 });
    }

    // 4. Solo se la mail al cliente è andata a buon fine, notifica l'admin
    const adminResponse = await resend.emails.send({
      from: senderEmail,
      to: [adminEmail],
      reply_to: email,
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
    });

    if (adminResponse.error) {
      console.error('Admin email error:', adminResponse.error);
      return new Response(JSON.stringify({ error: 'Failed to send notification email' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

