import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

const luhn = (c: AbstractControl): ValidationErrors | null => {
  const s = (c.value || '').replace(/\D/g, '');
  if (!s) return null;
  let sum = 0, alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = +s[i];
    if (alt && (n *= 2) > 9) n -= 9;
    sum += n; alt = !alt;
  }
  return s.length >= 13 && sum % 10 === 0 ? null : { luhn: true };
};

const expiry = (c: AbstractControl): ValidationErrors | null => {
  if (!/^\d{2}\/\d{2}$/.test(c.value || '')) return { expiry: true };
  const [m, y] = c.value.split('/').map(Number);
  const n = new Date(), yy = n.getFullYear() % 100;
  return m > 0 && m < 13 && (y > yy || (y === yy && m >= n.getMonth() + 1)) ? null : { expiry: true };
};

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './page.component.html',
  styleUrl: './page.component.css',
  animations: [
    trigger('loom', [
      transition('* => *', [
        style({ opacity: .65, transform: 'translateY(18px) scale(.985)' }),
        animate('520ms cubic-bezier(.16,1,.3,1)', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class PageComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  page: string = (this.route.snapshot.data['page'] || '') as string;
  weave = signal(0);
  selected = signal('Children welfare');
  amount = signal(2500);
  done = signal(false);
  sent = signal(false);
  activeTab = signal('mission');
  galleryFilter = signal('All');

  causes: string[][] = [
    ['Children welfare', 'A safe place to learn and play', 'coral'],
    ['Education', 'Books, buses and patient teachers', 'gold'],
    ['Disabled', 'Tools for fuller participation', 'leaf'],
    ['Women', 'Skills that stay in a family', 'berry'],
    ['Youth', 'Room to make and lead', 'blue'],
    ['Elderly', 'Neighbourhood care, close by', 'lavender']
  ];

  impactText = computed(() => {
    const a = this.amount();
    const cause = this.selected();
    const map: Record<string, Record<number, string>> = {
      'Children welfare': { 1000: '1 child receives safe shelter for a week', 2500: '3 children get nutritious meals for a month', 5000: '1 family receives complete child welfare support', 10000: '4 families receive comprehensive child care' },
      'Education': { 1000: '1 student gets school supplies for a term', 2500: '2 students receive monthly travel passes', 5000: '1 classroom gets new learning materials', 10000: '5 students receive a full-term scholarship' },
      'Disabled': { 1000: '1 therapy session for a child', 2500: '1 family therapy kit assembled', 5000: '2 months of accessible learning tools', 10000: '1 child receives a year of therapy support' },
      'Women': { 1000: '1 woman joins skills training', 2500: '1 micro-enterprise seed fund', 5000: '3 women complete vocational training', 10000: '1 women\'s cooperative gets startup support' },
      'Youth': { 1000: '1 youth attends leadership workshop', 2500: '1 month of mentorship programme', 5000: '1 youth starts an internship placement', 10000: '1 complete youth development programme' },
      'Elderly': { 1000: '1 week of home care visits', 2500: '1 month of neighbourhood meals', 5000: '3 months of companionship programme', 10000: '1 year of weekly wellness checks' }
    };
    return map[cause]?.[a] || 'Your gift will be directed where it\'s needed most';
  });

  programmes = [
    { num: '01', title: 'Education Without Barriers', subtitle: 'When the fare isn\'t the problem, the future changes', desc: 'School material, transport, family support and small catch-up classes keep children in the room when a term gets difficult. We don\'t just fund schools — we fund the 14-year-old girl who will change her community.', stat: '1,240', statLabel: 'students supported', img: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80', color: 'gold' },
    { num: '02', title: 'Health That Comes to You', subtitle: 'Because the clinic shouldn\'t be the hardest part', desc: 'Mobile health desks connect families with check-ups, medicine guidance and referrals they can actually follow. No waiting rooms. No complicated forms. Just a neighbour who knows medicine.', stat: '3,600', statLabel: 'consultations delivered', img: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80', color: 'berry' },
    { num: '03', title: 'Every Child Plays', subtitle: 'Inclusion isn\'t a programme — it\'s a promise', desc: 'Therapy tools, family sessions and accessible play help children take part on their own terms. Every kit is assembled with the family, not for them.', stat: '92', statLabel: 'families reached', img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80', color: 'leaf' },
    { num: '04', title: 'Women Who Build', subtitle: 'Skills that outlast any single donation', desc: 'Vocational training, micro-enterprise support, and cooperative development give women tools that multiply across generations. When one woman learns, a whole family benefits.', stat: '340', statLabel: 'women trained', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80', color: 'coral' },
    { num: '05', title: 'Youth Who Lead', subtitle: 'Give them a room and watch what happens', desc: 'Leadership workshops, mentorship circles, and internship placements let young people build something real before anyone asks them to.', stat: '180', statLabel: 'youth in programmes', img: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80', color: 'blue' },
    { num: '06', title: 'Elders, Not Forgotten', subtitle: 'Because dignity doesn\'t retire', desc: 'Neighbourhood meals, home visits, and weekly wellness checks keep elderly neighbours connected, cared for, and seen.', stat: '215', statLabel: 'elders in care', img: 'https://images.unsplash.com/photo-1560252829-804f1aedf1be?auto=format&fit=crop&w=900&q=80', color: 'lavender' }
  ];

  team = [
    { name: 'Saba Khan', role: 'Programme Listening', bio: 'Asks what changed after the camera leaves. 8 years in community welfare across Karachi.', initial: 'S', color: 'berry' },
    { name: 'Umar Riaz', role: 'Partner Care', bio: 'Keeps the working table clear and honest. Former NGO operations lead with a gift for hard conversations.', initial: 'U', color: 'gold' },
    { name: 'Meher Ali', role: 'Product & Access', bio: 'Turns a complicated path into a kind one. Accessibility-first design for every screen.', initial: 'M', color: 'leaf' },
    { name: 'Noor Ahmed', role: 'Community Events', bio: 'Knows where a spare hour can help. Connects 46 programmes to 7,200 donors.', initial: 'N', color: 'blue' },
    { name: 'Farah Malik', role: 'Finance & Reporting', bio: 'Makes every rupee accountable. Chartered accountant who believes transparency is a service.', initial: 'F', color: 'coral' },
    { name: 'Hassan Syed', role: 'Field Coordination', bio: 'Lives between the office and the field. Knows every partner by first name.', initial: 'H', color: 'lavender' }
  ];

  milestones = [
    { year: '2021', title: 'The First Thread', desc: 'Give-AID begins with 3 partner teams and a belief: local care should be easy to find.' },
    { year: '2022', title: 'Finding Our Stride', desc: '8 partners join. First 500 donations completed. Education programme launches.' },
    { year: '2023', title: 'Trust Takes Root', desc: '1,000th gift completed. Health desk programme starts. Transparency commitments published.' },
    { year: '2024', title: 'Widening the Circle', desc: 'Women\'s programme and youth leadership launch. 14 partners now active.' },
    { year: '2025', title: 'Deepening Impact', desc: '5,000 donations directed. Elderly care programme begins. Gallery of field stories opens.' },
    { year: '2026', title: 'Where We Stand', desc: '18 partners, 46 active programmes, 7,200+ donations. And we\'re just getting started.' }
  ];

  partners = [
    { name: 'Northstar', type: 'Community Bank', impact: 'Made school transport boring — in the best way', desc: 'Quarterly route support means families can plan around school, not around a fare.', stat: '340', statLabel: 'passes funded' },
    { name: 'PakWell', type: 'Health Network', impact: 'Put a health desk where the queue already was', desc: 'Mobile clinics now share space with neighbourhood gatherings instead of asking people to travel twice.', stat: '1,200', statLabel: 'check-ups enabled' },
    { name: 'Kindred', type: 'Learning Trust', impact: 'Kept the books in the room', desc: 'Reading kits and catch-up sessions are placed with teachers who know which child needs them next.', stat: '890', statLabel: 'kits distributed' },
    { name: 'Harbour', type: 'Logistics', impact: 'Delivered care where roads don\'t go', desc: 'Last-mile delivery of medical supplies, food packages, and learning materials to underserved areas.', stat: '46', statLabel: 'areas reached' },
    { name: 'MADE', type: 'Studio Collective', impact: 'Gave the work a voice people trust', desc: 'Brand strategy, field photography, and storytelling that respects the people it portrays.', stat: '24', statLabel: 'stories published' },
    { name: 'Fieldwork', type: 'Foundation', impact: 'Funded what others wouldn\'t', desc: 'Seed grants for experimental programmes that traditional funders consider too small or too new.', stat: '8', statLabel: 'pilot programmes' }
  ];

  galleryImages = [
    { src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80', caption: 'Children at Noor Learning Centre', category: 'Education', size: 'tall' },
    { src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=900&q=80', caption: 'Youth leadership workshop, Gulshan', category: 'Youth', size: 'wide' },
    { src: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80', caption: 'Volunteers at community health desk', category: 'Health', size: 'normal' },
    { src: 'https://images.unsplash.com/photo-1560252829-804f1aedf1be?auto=format&fit=crop&w=900&q=80', caption: 'Shared table for elderly neighbours', category: 'Elderly', size: 'normal' },
    { src: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=900&q=80', caption: 'Women\'s vocational training', category: 'Women', size: 'tall' },
    { src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80', caption: 'Back-to-school drive preparation', category: 'Education', size: 'wide' },
    { src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80', caption: 'Mobile health consultation', category: 'Health', size: 'normal' },
    { src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80', caption: 'Inclusive play session', category: 'Children', size: 'normal' }
  ];

  galleryCategories = ['All', 'Education', 'Health', 'Youth', 'Women', 'Children', 'Elderly'];

  filteredGallery = computed(() => {
    const f = this.galleryFilter();
    return f === 'All' ? this.galleryImages : this.galleryImages.filter(i => i.category === f);
  });

  faqs = [
    { q: 'How does Give-AID choose NGO partners?', a: 'We meet the team, review at least 6 months of active work, verify community impact, and agree on regular, honest updates before a programme is listed. Every partner signs our accountability charter.' },
    { q: 'Can I donate to a specific programme?', a: 'Absolutely. Choose a cause on the Donate page and your selected programme stays visible throughout checkout. Your receipt names the exact programme your gift supports.' },
    { q: 'Where exactly does my money go?', a: 'Every donation is linked to a specific programme need. We publish quarterly breakdowns showing how funds were allocated. Zero administrative fees are taken from programme donations.' },
    { q: 'Will I receive a receipt?', a: 'Yes. A detailed receipt is emailed within 24 hours including the programme name, partner NGO, and expected impact timeline.' },
    { q: 'How can I volunteer?', a: 'Register on our platform and browse upcoming events. You can filter by location, cause area, and time commitment. Most activities need just 2–3 hours.' },
    { q: 'Can I visit a programme site?', a: 'Yes, with advance arrangement. Contact us and we\'ll coordinate with the partner team. We encourage donors to see the work firsthand.' },
    { q: 'How do you handle safeguarding?', a: 'We seek permission before sharing stories or images, minimise personal data, train all field staff, and provide a direct route to raise concerns with our safeguarding lead.' },
    { q: 'What if I\'m unhappy with how my donation was used?', a: 'Contact us directly. We respond within 2 working days. If a programme has changed direction, we\'ll explain why and offer to redirect your next gift.' }
  ];

  transparencyStats = [
    { number: '18', label: 'Partner NGOs assessed and verified' },
    { number: '46', label: 'Active programmes with named local teams' },
    { number: '7,200+', label: 'Donations directed with full traceability' },
    { number: '2 days', label: 'Maximum response time for any query' },
    { number: '0%', label: 'Admin fees taken from programme donations' },
    { number: '100%', label: 'Of partners sign our accountability charter' }
  ];

  commitments = [
    { num: '01', area: 'Governance', title: 'Who makes decisions', desc: 'Programme choices are made with partner teams and reviewed against need, capacity and safeguarding requirements. Major funding decisions are recorded for annual reporting. Our board meets quarterly and publishes meeting summaries.' },
    { num: '02', area: 'Partner Standards', title: 'How partners are selected', desc: 'Before listing a programme, we meet the team, review at least 6 months of their work, verify community relationships, and agree on what updates can be shared safely and honestly.' },
    { num: '03', area: 'Safeguarding', title: 'People come before publicity', desc: 'We seek permission before sharing stories or images, minimise personal data, train all staff and volunteers, and provide a direct route to raise a concern with our designated safeguarding lead.' },
    { num: '04', area: 'Financial Integrity', title: 'Every rupee has a name', desc: 'Each listed gift is linked to a current programme need. We publish quarterly financial summaries. An independent auditor reviews our accounts annually.' },
    { num: '05', area: 'Reporting', title: 'What we share and when', desc: 'Monthly field notes from active programmes. Quarterly financial summaries. Annual impact report. All published on our platform and available on request.' }
  ];

  supportServices = [
    { num: '01', title: 'Education Support', desc: 'School transport, learning materials, catch-up classes, and family guidance for children at risk of missing class.', who: 'For families with school-age children in Karachi' },
    { num: '02', title: 'Health & Referral', desc: 'Local health desks, practical guidance, medicine information, and help finding the next appropriate medical service.', who: 'For families needing health guidance in partner areas' },
    { num: '03', title: 'Disability & Family Support', desc: 'Therapy tools, family sessions, accessible play, and guidance for families navigating disability services.', who: 'For families with children who have special needs' },
    { num: '04', title: 'Women\'s Programmes', desc: 'Vocational training, skills development, micro-enterprise support, and cooperative building for women.', who: 'For women seeking skills and independence' },
    { num: '05', title: 'Youth Development', desc: 'Leadership workshops, mentorship, internship placements, and creative programmes for young people.', who: 'For youth aged 15–25 in programme areas' },
    { num: '06', title: 'Elderly Care', desc: 'Neighbourhood meals, home care visits, companionship programmes, and wellness checks for elderly neighbours.', who: 'For elderly community members living alone or in need' }
  ];

  checkout = this.fb.group({
    cardholder: ['', [Validators.required, Validators.minLength(3)]],
    card: ['', [Validators.required, luhn]],
    expiry: ['', [Validators.required, expiry]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
  });

  contact = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    subject: [''],
    message: ['', Validators.required]
  });

  weaveAgain() { this.weave.update(v => v + 1); }
  choose(c: string) { this.selected.set(c); }
  setAmount(n: number) { this.amount.set(n); }
  setTab(t: string) { this.activeTab.set(t); }
  setGalleryFilter(f: string) { this.galleryFilter.set(f); }
  field(n: string) { return this.checkout.get(n)!; }
  invalid(n: string) { const c = this.field(n); return c.invalid && c.touched; }
  donate() { this.checkout.markAllAsTouched(); if (this.checkout.valid) this.done.set(true); }
  submitContact() { this.contact.markAllAsTouched(); if (this.contact.valid) this.sent.set(true); }
}
