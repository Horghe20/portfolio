import type { APIRoute } from 'astro';
import { PERSONAL_INFO } from '../data/content';

export const GET: APIRoute = async () => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
N:Di Cristofalo;Giorgio;;;
FN:${PERSONAL_INFO.name}
TITLE:Software Engineer
ORG:Faidda Tech Lab
EMAIL;type=INTERNET;type=pref:${PERSONAL_INFO.email}
TEL;type=CELL;type=VOICE;type=pref:+393317234406
URL:${PERSONAL_INFO.linkedin}
URL:${PERSONAL_INFO.github}
NOTE:Software Engineer | Automation, Delivery & Applied AI
END:VCARD`;

  return new Response(vcard, {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="giorgio_dicristofalo.vcf"',
    },
  });
};
