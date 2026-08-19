import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(process.env.RESEND_API_KEY || '');

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, topic, message, honeypot, lang = 'it' } = data;

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

    // Traduzioni email di cortesia
    const isEn = lang === 'en';
    const clientSubject = isEn ? `Thanks for reaching out, ${name}` : `Grazie per avermi contattato, ${name}`;
    
    // Testo plain-text obbligatorio per ridurre il punteggio di spam
    const clientText = isEn
      ? `Hi ${name},\n\nThis is an automated email to confirm I've received your message regarding "${topic}".\nI'll review your request and get back to you as soon as possible at this email address.\n\nBest regards,\nGiorgio Di Cristofalo\nhttps://giorgiodicristofalo.com\n\n---\nMessage summary:\n${message}\n\n---\nYou received this email because you submitted a contact form on giorgiodicristofalo.com.\nGiorgio Di Cristofalo, Italy`
      : `Ciao ${name},\n\nQuesta è un'email automatica per confermarti di aver ricevuto il tuo messaggio riguardante "${topic}".\nLeggerò la tua richiesta e ti risponderò il prima possibile all'indirizzo che mi hai lasciato.\n\nA presto,\nGiorgio Di Cristofalo\nhttps://giorgiodicristofalo.com\n\n---\nRiepilogo del tuo messaggio:\n${message}\n\n---\nHai ricevuto questa email perché hai compilato il modulo di contatto su giorgiodicristofalo.com.\nGiorgio Di Cristofalo, Italia`;

    const clientHtml = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <p>${isEn ? `Hi ${name},` : `Ciao ${name},`}</p>
        <p>${isEn 
          ? `This is an automated email to confirm I've received your message regarding <strong>"${topic}"</strong>.` 
          : `Questa è un'email automatica per confermarti di aver ricevuto il tuo messaggio riguardante <strong>"${topic}"</strong>.`}</p>
        <p>${isEn 
          ? `I'll review your request and get back to you as soon as possible at this email address.` 
          : `Leggerò la tua richiesta e ti risponderò il prima possibile all'indirizzo che mi hai lasciato.`}</p>
        <br/>
        <p>${isEn ? `Best regards,` : `A presto,`}</p>
        <p><strong>Giorgio Di Cristofalo</strong><br/>
        <a href="https://giorgiodicristofalo.com" style="color: #5B7FA0;">giorgiodicristofalo.com</a></p>
        
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        
        <p style="font-size: 13px; color: #666; background: #f9f9f9; padding: 15px; border-radius: 6px;">
          <em>${isEn ? `Message summary:` : `Riepilogo del tuo messaggio:`}</em><br/>
          ${message.replace(/\n/g, '<br/>')}
        </p>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 11px; color: #999; text-align: center;">
          <p>${isEn 
            ? `You received this email because you submitted a contact form on giorgiodicristofalo.com.` 
            : `Hai ricevuto questa email perché hai compilato il modulo di contatto su giorgiodicristofalo.com.`}</p>
          <p>Giorgio Di Cristofalo, Italy</p>
        </div>
      </div>
    `;

    // 3. Prima invia la mail di cortesia al cliente
    //    Se fallisce (email rifiutata dal provider), blocchiamo tutto e avvisiamo l'utente
    const clientResponse = await resend.emails.send({
      from: senderEmail,
      to: [email],
      reply_to: adminEmail,
      subject: clientSubject,
      text: clientText,
      html: clientHtml,
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
      text: `New Contact Request from Portfolio\n\nName: ${name}\nEmail: ${email}\nTopic: ${topic}\n\nMessage:\n${message}`,
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

