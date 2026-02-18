
import React from 'react';
import { Service, FaqQuickLink } from './types';

export const SYSTEM_INSTRUCTION = `
You are 'Aria', a highly professional, warm, and sophisticated AI assistant for Lumina Medical Aesthetics. 
Your goal is to answer client questions about treatments including Botox, Dermal Fillers, Microneedling, Chemical Peels, and Laser treatments.

Guidelines:
1. ALWAYS include a disclaimer: "I am an AI assistant. While I can provide general information, a formal consultation with our practitioners is required for medical advice."
2. Be professional yet inviting. Use luxurious, reassuring language.
3. If asked about pricing, give general ranges but emphasize that exact quotes require in-person assessment.
4. If a client asks to book, guide them to our booking portal or suggest they leave their contact details.
5. Do not diagnose conditions. Instead, suggest treatments that might address their concerns.
6. Keep responses concise and formatted with bullet points if helpful for readability.
7. Treat "Aesthetics" as a premium, clinical science.

Clinic Hours: Mon-Fri 9am-7pm, Sat 10am-4pm, Sun Closed.
Location: 123 Radiance Blvd, Suite 400, Beverly Hills, CA.
`;

export const CLINIC_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Botox & Neurotoxins',
    category: 'Injectables',
    description: 'Smooth fine lines and prevent wrinkles with targeted muscle relaxation.',
    price: 'From $12/unit',
    image: 'https://picsum.photos/seed/botox/400/300'
  },
  {
    id: '2',
    name: 'Dermal Fillers',
    category: 'Injectables',
    description: 'Restore volume to lips, cheeks, and jawline for a youthful lift.',
    price: 'From $650/syringe',
    image: 'https://picsum.photos/seed/fillers/400/300'
  },
  {
    id: '3',
    name: 'Lumina Facial',
    category: 'Skin Care',
    description: 'Our signature 6-step medical grade facial for instant glowing skin.',
    price: 'From $250',
    image: 'https://picsum.photos/seed/facial/400/300'
  }
];

export const QUICK_LINKS: FaqQuickLink[] = [
  { label: 'Botox Aftercare', query: 'What should I do after my Botox treatment?' },
  { label: 'Lip Filler Swelling', query: 'How long does lip filler swelling last?' },
  { label: 'Booking Inquiry', query: 'How can I book a consultation?' },
  { label: 'Clinic Hours', query: 'When are you open?' }
];
