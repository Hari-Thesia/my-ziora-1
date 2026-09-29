import { FormEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  Phone,
  Send,
  Sparkles,
  Waves,
  X,
} from 'lucide-react';

type Page = 'home' | 'story' | 'menu' | 'visit';
type BookingChoice = 'options' | 'call' | 'form' | null;

type Reservation = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  note: string;
};

const images = {
  hero: '/images/hero/reelsvideo.io_1790607781961.jpeg',
  garden: '/images/gallery/reelsvideo.io_1790607664765.jpeg',
  sushi: '/images/gallery/reelsvideo.io_1790607681662.jpeg',
  entrance: '/images/gallery/reelsvideo.io_1790607821727.jpeg',
  mood: '/images/gallery/reelsvideo.io_1790607635418.jpeg',
  tandoor: '/images/menu/unnamed_(5).webp',
  sides: '/images/menu/unnamed_(6).webp',
  wok: '/images/menu/unnamed_(7).webp',
  japanese: '/images/menu/unnamed_(8).webp',
  coffee: '/images/menu/unnamed_(9).webp',
};

type MenuSection = {
  name: string;
  image: string;
  note: string;
  items: { name: string; detail: string; price: string }[];
};

const menuSections: MenuSection[] = [
  { name: 'Small plates', image: images.japanese, note: 'A little something to begin.', items: [
    { name: 'Tejwari Avocado Chaat', detail: 'Avocado, yoghurt, coriander chutney and tomato dressing', price: '430' },
    { name: 'Crispy Charred Corn', detail: 'Crispy corn, sesame, spring onion and house seasoning', price: '400' },
    { name: 'Smoked Charred Lotus Stem', detail: 'Crispy lotus stem in a smoky chilli-garlic sauce', price: '380' },
    { name: 'Korean Cream Cheese with Garlic Bread', detail: 'Whipped cream cheese with crunchy garlic butter', price: '430' },
    { name: 'Mediterranean Balls', detail: 'Basil, sesame, peppers, roasted garlic and tomato sauce', price: '360' },
    { name: 'Hummus Platter', detail: 'Hummus, hummus & pita or hummus bash', price: '320–380' },
    { name: 'Nachos', detail: 'Classic, loaded, or nachos & salsa', price: '350–580' },
  ] },
  { name: 'Japanese', image: images.japanese, note: 'Delicate rolls, thoughtful bites.', items: [
    { name: 'Avocado Cream Cheese Maki', detail: 'Avocado and cream cheese maki · 6 pcs', price: '390' },
    { name: 'California Roll', detail: 'Cucumber, pickled vegetables and cream cheese · 6 pcs', price: '540' },
    { name: 'Raw House Dimsum', detail: 'Mixed vegetables with light seasoning · 6 pcs', price: '450' },
    { name: 'Truffle Mushroom Dimsum', detail: 'Mushroom and cream cheese with truffle · 6 pcs', price: '470' },
    { name: 'Coconut Taiwan Ramen', detail: 'Coconut broth, tofu, edamame, baby corn, mushrooms and chilli oil', price: '580' },
    { name: 'Spicy Ramen', detail: 'Spicy broth, ramen noodles, tofu, mushrooms, spring onions and crispy garlic', price: '580' },
  ] },
  { name: 'Wok tossed', image: images.wok, note: 'Big flavour, quick heat.', items: [
    { name: 'Mexican Cheese', detail: 'Crispy vegetables tossed in a flavourful chilli-garlic dressing', price: '390' },
    { name: 'Schezwan Chilli Lotus Stem', detail: 'Crispy lotus stem with Schezwan sauce', price: '450' },
    { name: 'Thai Basil Stir Fry', detail: 'Crispy vegetables with fragrant Thai chilli-garlic sauce', price: '450' },
    { name: 'Chilli Paneer', detail: 'Crispy paneer with peppers and onion', price: '390' },
    { name: 'Lotus Root', detail: 'Crispy lotus root with house seasoning', price: '450' },
    { name: 'Crispy Potato', detail: 'Crispy potato with house seasoning', price: '380' },
    { name: 'Crispy Vegetable', detail: 'Crispy seasonal vegetables', price: '400' },
    { name: 'Hakka Noodles', detail: 'Mixed vegetables tossed with noodles', price: '430' },
    { name: 'Schezwan Noodles', detail: 'Noodles with Schezwan sauce', price: '430' },
    { name: 'Burnt Garlic Noodles', detail: 'Noodles with burnt garlic and vegetables', price: '430' },
  ] },
  { name: 'Kebabs', image: images.wok, note: 'Skewered, charred and made to share.', items: [
    { name: 'Apple Cheese Kebab', detail: 'Crispy apple, cheese and soft cheese-stuffed kebab', price: '460' },
    { name: 'Chilli Cheese Kebab', detail: 'Chilli, cheese and vegetables served with mint', price: '480' },
    { name: 'Tandoori Kebab', detail: 'Seasoned vegetable kebab, served with mint sauce', price: '490' },
  ] },
  { name: 'Sides', image: images.sides, note: 'The things that make a table complete.', items: [
    { name: 'Salted Fries', detail: 'Crisp fries with sea salt', price: '300' },
    { name: 'Peri Peri Fries', detail: 'Crisp fries with peri peri seasoning', price: '320' },
    { name: 'Garlic Bread', detail: '5 pieces', price: '280' },
    { name: 'Cheese Garlic Bread', detail: '5 pieces', price: '340' },
    { name: 'Green Salad', detail: 'Fresh seasonal greens', price: '180' },
    { name: 'Sauteed Vegetables', detail: 'Seasonal vegetables', price: '280' },
    { name: 'Caesar Salad', detail: 'Classic Caesar salad', price: '280' },
  ] },
  { name: 'Accompaniments', image: images.sides, note: 'Small finishing touches.', items: [
    { name: 'Roasted Papad', detail: 'Crisp roasted papad', price: '80' },
    { name: 'Fried Papad', detail: 'Crisp fried papad', price: '60' },
    { name: 'Masala Papad', detail: 'Papad with fresh masala', price: '80' },
    { name: 'Plain Butter Naan', detail: 'Soft naan with butter', price: '80' },
    { name: 'Plain Buttermilk', detail: 'Chilled buttermilk', price: '70' },
    { name: 'Plain Curd', detail: 'Fresh curd', price: '80' },
    { name: 'Vegetable Raita', detail: 'Seasoned vegetable raita', price: '100' },
    { name: 'Boondi Raita', detail: 'Classic boondi raita', price: '100' },
  ] },
  { name: 'For sweet tooth', image: images.sides, note: 'A sweet ending, never an afterthought.', items: [
    { name: 'Darsaan', detail: 'Honey-glazed crispy noodles topped with vanilla ice cream', price: '350' },
    { name: 'Classic New York Cheesecake', detail: 'Classic baked cheesecake', price: '350' },
    { name: 'Biscoff Cheesecake', detail: 'Classic baked cheesecake with Biscoff', price: '350' },
    { name: 'Nutella Cheesecake', detail: 'Chocolate-hazelnut cheesecake', price: '300' },
    { name: 'Brownie with Ice Cream', detail: 'Warm chocolate brownie with ice cream', price: '300' },
    { name: 'Gulab Jamun with Ice Cream', detail: 'Gulab jamun with ice cream', price: '290' },
  ] },
  { name: 'Tandoor', image: images.tandoor, note: 'From the fire, with warmth.', items: [
    { name: 'Corn Lemon Tikka', detail: 'Corn, lemon and coriander marinated in curd', price: '490' },
    { name: 'Hara Bhara Paneer Tikka', detail: 'Paneer, mint, coriander and green chilli', price: '490' },
    { name: 'Angara Paneer Tikka', detail: 'Paneer in a smoky charcoal marinade', price: '470' },
    { name: 'Surahi Paneer Ka Tikka', detail: 'Paneer marinated in curd, chilli and Indian spices', price: '450' },
    { name: 'Paneer Malai Tikka', detail: 'Paneer, curd, cheese, cream and Indian spices', price: '450' },
    { name: 'Bharwan Khumbh', detail: 'Mushrooms marinated in curd, chilli and spices', price: '450' },
    { name: 'Tandoori Soya Chaap', detail: 'Soya chaap marinated in curd, chilli and Indian spices', price: '450' },
    { name: 'Subz E Tandoori', detail: 'Wood-fired assorted vegetables with onion', price: '520' },
  ] },
  { name: 'From wood fire', image: images.tandoor, note: 'Charred, smoky, straight from the flame.', items: [
    { name: 'Cheese & Green', detail: 'Marinara, buffalo mozzarella, green peppers and fresh greens', price: '800' },
    { name: 'Californian Veggie', detail: 'Marinara, garlic, mozzarella, summer vegetables and greens', price: '780' },
    { name: 'BBQ Mushroom', detail: 'Marinara, buffalo mozzarella, BBQ mushroom and onion', price: '780' },
    { name: 'Smokey Veggie', detail: 'Marinara, buffalo mozzarella, pesto and smoked vegetables', price: '780' },
    { name: 'Diablo', detail: 'Marinara, chilli, tomato, mozzarella, hot sauce, peppers and onion', price: '780' },
    { name: 'Margherita', detail: 'Fresh tomato, buffalo mozzarella and basil', price: '700' },
  ] },
  { name: 'Coffees', image: images.coffee, note: 'Slow sips for every kind of evening.', items: [
    { name: 'Cucumber Cooler', detail: 'Cucumber, lemon, mint, ice and soda', price: '220' },
    { name: 'Classic Lemon Mojito', detail: 'Fresh lemon, mint, ice and soda', price: '180' },
    { name: 'Green Apple Mojito', detail: 'Green apple, lemon, mint, ice and soda', price: '180' },
    { name: 'Kiwi Mojito', detail: 'Kiwi, lemon, mint, ice and soda', price: '180' },
    { name: 'Cranberry Mojito', detail: 'Cranberry, lemon, mint, ice and soda', price: '180' },
    { name: 'Classic Elevated', detail: 'Hot espresso, milk, served black or with orange peel', price: '180' },
    { name: 'Saffron Honey Flat White', detail: 'Espresso, saffron, honey and velvety microfoam', price: '240' },
    { name: 'Sesame Cortado', detail: 'Espresso with roasted sesame cream and milk', price: '220' },
    { name: 'Orange Blossom Mocha', detail: 'Espresso with orange blossom syrup and cocoa', price: '260' },
    { name: 'Raspberry Balsamic Cold Brew', detail: 'Cold brew with raspberry syrup and balsamic reduction', price: '240' },
    { name: 'Cold Brew Mojito', detail: 'Cold brew, lime juice and mint leaves', price: '240' },
  ] },
];

function useReveal(page: Page) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [page]);
}

function useParallax() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (ref.current) {
          const offset = window.scrollY * 0.35;
          ref.current.style.transform = `translateY(${offset}px) scale(1.06)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, []);
  return ref;
}

function App() {
  const [page, setPage] = useState<Page>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [booking, setBooking] = useState<BookingChoice>(null);
  const [scrolled, setScrolled] = useState(false);

  useReveal(page);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setMenuOpen(false);
  };

  return (
    <div className="site-shell">
      <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
        <button className="wordmark" onClick={() => navigate('home')} aria-label="Ziora home">
          <span>ZI<span className="wordmark-o">O</span>RA</span>
          <small>BY THE FALLS</small>
        </button>
        <nav className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'}>
          <button className={page === 'home' ? 'active' : ''} onClick={() => navigate('home')}>Home</button>
          <button className={page === 'story' ? 'active' : ''} onClick={() => navigate('story')}>Our story</button>
          <button className={page === 'menu' ? 'active' : ''} onClick={() => navigate('menu')}>The menu</button>
          <button className={page === 'visit' ? 'active' : ''} onClick={() => navigate('visit')}>Find us</button>
          <button className="nav-book-mobile" onClick={() => setBooking('options')}>Reserve a table</button>
        </nav>
        <button className="nav-cta" onClick={() => setBooking('options')}>Reserve a table <ArrowRight size={16} /></button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {page === 'home' && <HomePage navigate={navigate} openBooking={() => setBooking('options')} />}
      {page === 'story' && <StoryPage openBooking={() => setBooking('options')} />}
      {page === 'menu' && <MenuPage openBooking={() => setBooking('options')} />}
      {page === 'visit' && <VisitPage openBooking={() => setBooking('options')} />}

      <footer className="footer">
        <div className="footer-top">
          <div>
            <div className="footer-mark">ZIORA</div>
            <p>A place where ambience<br />and flavour meet gracefully.</p>
          </div>
          <div className="footer-links">
            <div><span className="eyebrow">Explore</span><button onClick={() => navigate('story')}>Our story</button><button onClick={() => navigate('menu')}>The menu</button><button onClick={() => navigate('visit')}>Find us</button></div>
            <div><span className="eyebrow">Connect</span><a href="tel:+919558490909"><Phone size={14} /> +91 95584 90909</a><a href="mailto:hello@ziorabythefalls.com"><Mail size={14} /> hello@ziorabythefalls.com</a><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><Instagram size={14} /> @ziora_bythefalls</a></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2024 Ziora By The Falls</span><span>Rajkot · Gujarat</span><span>Made for slow evenings.</span></div>
      </footer>

      {booking && <BookingModal choice={booking} setChoice={setBooking} />}
      <button className="mobile-reserve" onClick={() => setBooking('options')}><CalendarDays size={16} /> Reserve your table <ArrowRight size={15} /></button>
    </div>
  );
}

function HomePage({ navigate, openBooking }: { navigate: (page: Page) => void; openBooking: () => void }) {
  const heroImg = useParallax();
  return <main>
    <section className="hero">
      <div className="hero-bg" ref={heroImg}><img src={images.hero} alt="The waterfall lounge at Ziora By The Falls" /></div>
      <div className="hero-shade" />
      <div className="hero-content">
        <p className="eyebrow light">Rajkot · Gujarat</p>
        <h1>Where water<br /><em>meets wonder.</em></h1>
        <p className="hero-copy">An unhurried dining escape, shaped by falling water, warm light and food with a little soul.</p>
        <div className="hero-actions"><button className="button button-light" onClick={openBooking}>Reserve your evening <ArrowRight size={17} /></button><button className="text-link light" onClick={() => navigate('story')}>Discover Ziora <ArrowDownRight size={17} /></button></div>
      </div>
      <div className="hero-note"><Waves size={18} /><span>Rajkot’s first<br />waterfall restaurant</span></div>
      <div className="scroll-cue"><span>Scroll to explore</span><div /></div>
    </section>

    <section className="intro section-pad reveal">
      <div className="intro-number">01 <span>/ 04</span></div>
      <div className="intro-copy"><p className="eyebrow">The Ziora feeling</p><h2>Come for the view.<br /><em>Stay for the feeling.</em></h2><p>There are dinners you remember for the dish, and then there are evenings you remember for everything. At Ziora, each detail is designed to let the day fall away — from the first shimmer of the falls to the last note of dessert.</p><button className="text-link" onClick={() => navigate('story')}>The story behind the falls <ArrowRight size={16} /></button></div>
      <div className="intro-art"><span>Water</span><span>Light</span><span>Life</span><div className="art-ring" /></div>
    </section>

    <section className="image-split reveal"><div className="split-image"><img src={images.garden} alt="Ziora outdoor waterfall garden" /></div><div className="split-copy"><p className="eyebrow">The setting</p><h2>A table in<br /><em>another world.</em></h2><p>Sunlit gardens by day. A softly glowing hideaway by night. Ziora flows between the two, just like the water at its heart.</p><button className="text-link" onClick={() => navigate('visit')}>Find your way here <ArrowRight size={16} /></button></div></section>

    <section className="featured section-pad reveal"><div className="feature-heading"><div><p className="eyebrow">A taste of Ziora</p><h2>Made to be<br /><em>lingered over.</em></h2></div><button className="text-link" onClick={() => navigate('menu')}>Explore the menu <ArrowRight size={16} /></button></div><div className="dish-grid"><article><img src={images.sushi} alt="Sushi plate at Ziora" /><div><span>01</span><h3>Clean, considered,<br /><em>always surprising.</em></h3></div></article><article><img src={images.mood} alt="Warmly lit Ziora interior" /><div><span>02</span><h3>Slow down.<br /><em>Stay a while.</em></h3></div></article></div></section>

    <section className="quote-banner reveal"><img src={images.entrance} alt="Ziora entrance arch and falls" /><div><Sparkles size={22} /><blockquote>“Some places serve dinner.<br /><em>Ziora sets a scene.</em>”</blockquote><button className="button button-light" onClick={openBooking}>Make it an evening <ArrowRight size={17} /></button></div></section>
  </main>;
}

function StoryPage({ openBooking }: { openBooking: () => void }) {
  return <main className="inner-page"><section className="page-hero story-hero"><img src={images.entrance} alt="The entrance to Ziora" /><div className="hero-shade" /><div className="page-hero-content"><p className="eyebrow light">Chapter one</p><h1>A little more<br /><em>than dinner.</em></h1></div></section><section className="story-intro section-pad reveal"><p className="eyebrow">Our story</p><h2>Born from the belief that<br /><em>the setting is part of the meal.</em></h2><div className="story-columns"><p>Ziora began with a simple idea: create a place in Rajkot that feels like a departure. A place where the sound of water softens conversation, where the light changes the room, and where every plate arrives with intention.</p><p>Our waterfall is more than a backdrop. It is our rhythm — a reminder to be present, to take your time, and to make a little space for wonder. Come as you are. Leave a little lighter.</p></div></section><section className="story-gallery reveal"><img src={images.mood} alt="Ziora warm interior lighting" /><div><p className="eyebrow">The details matter</p><h2>Warm light.<br /><em>Wild textures.</em></h2><p>Natural stone, woven light, living green and the gentle theatre of falling water come together to make every corner feel discovered.</p></div></section><section className="closing-panel reveal"><p className="eyebrow">Your table is waiting</p><h2>Make an evening<br /><em>of it.</em></h2><button className="button" onClick={openBooking}>Reserve at Ziora <ArrowRight size={17} /></button></section></main>;
}

function MenuPage({ openBooking }: { openBooking: () => void }) {
  const [category, setCategory] = useState('Small plates');
  const selectedSection = menuSections.find((section) => section.name === category) ?? menuSections[0];
  return <main className="inner-page menu-page"><section className="menu-heading section-pad"><p className="eyebrow">The actual Ziora menu</p><h1>Made for<br /><em>the table.</em></h1><div className="menu-heading-side"><p>Every page, every dish, every price — built from the menu photographed at Ziora. Choose a chapter and explore.</p><button className="button" onClick={openBooking}>Reserve your table <ArrowRight size={17} /></button></div><div className="menu-tabs">{menuSections.map((section) => <button className={category === section.name ? 'selected' : ''} key={section.name} onClick={() => setCategory(section.name)}>{section.name}</button>)}</div></section><section className="menu-feature section-pad"><div className="menu-feature-image"><img src={selectedSection.image} alt={`${selectedSection.name} menu at Ziora`} /><span className="menu-image-label">Ziora · {selectedSection.name}</span></div><div className="menu-feature-copy"><p className="eyebrow">{selectedSection.note}</p><h2>{selectedSection.name}<br /><em>at the falls.</em></h2><p>Designed to be shared, lingered over and paired with the sound of water. Swipe through the photographed menu chapter below.</p><div className="menu-list">{selectedSection.items.map((item, index) => <article className="menu-item" key={item.name}><span className="menu-index">{String(index + 1).padStart(2, '0')}</span><div><h3>{item.name}</h3><p>{item.detail}</p></div><span className="menu-price">₹ {item.price}</span></article>)}</div></div></section><section className="menu-strip"><div><p className="eyebrow light">From the photographed menu</p><h2>Something for<br /><em>every mood.</em></h2><button className="button button-light" onClick={openBooking}>Book your table <ArrowRight size={17} /></button></div>{menuSections.map((section) => <button className="menu-strip-card" key={section.name} onClick={() => setCategory(section.name)}><img src={section.image} alt={section.name} /><span>{section.name}</span></button>)}</section></main>;
}

function VisitPage({ openBooking }: { openBooking: () => void }) {
  return <main className="inner-page visit-page"><section className="visit-heading section-pad reveal"><div><p className="eyebrow">Your next escape</p><h1>Find<br /><em>the falls.</em></h1></div><div className="visit-details"><div><MapPin size={19} /><p>Beside Face-Off Sports Arena,<br />Smart City, opposite Atal Sarovar Road,<br />Rajkot, Gujarat</p></div><div><Clock3 size={19} /><p>Every day<br /><strong>6:00 PM — 11:00 PM</strong></p></div><button className="button" onClick={openBooking}>Reserve a table <ArrowRight size={17} /></button></div></section><section className="map-card reveal"><div className="map-grid" /><div className="map-pin"><MapPin size={30} /><span>ZIORA<br /><small>BY THE FALLS</small></span></div><div className="map-label">Atal Sarovar Road <span>·</span> Rajkot</div></section><section className="visit-bottom section-pad reveal"><div><p className="eyebrow">Need a little help?</p><h2>Let’s make<br /><em>it easy.</em></h2></div><div className="visit-contact"><p>For celebrations, large groups or anything a little special, call us directly. Our team would love to help shape your evening.</p><a className="contact-line" href="tel:+919558490909"><Phone size={17} /> +91 95584 90909 <ArrowRight size={16} /></a></div></section></main>;
}

function BookingModal({ choice, setChoice }: { choice: BookingChoice; setChoice: (choice: BookingChoice) => void }) {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [reservation, setReservation] = useState<Reservation>({ name: '', phone: '', email: '', date: '', time: '8:00 PM', guests: '2 guests', note: '' });
  const update = (field: keyof Reservation, value: string) => setReservation((current) => ({ ...current, [field]: value }));
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    const message = `Hello Ziora, I would like to reserve a table.\n\nName: ${reservation.name}\nPhone: ${reservation.phone}\nDate: ${reservation.date}\nTime: ${reservation.time}\nGuests: ${reservation.guests}\nNote: ${reservation.note || '-'}`;
    window.open(`https://wa.me/919558490909?text=${encodeURIComponent(message)}`, '_blank');
    setSent(true);
  };
  const whatsappText = encodeURIComponent('Hello Ziora, I would like to reserve a table.');
  return <div className="modal-backdrop" onClick={() => setChoice(null)}><div className="booking-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setChoice(null)} aria-label="Close reservation options"><X size={20} /></button>{sent ? <div className="success-state"><div className="success-icon"><Check size={26} /></div><p className="eyebrow">Request received</p><h2>Your evening<br /><em>starts here.</em></h2><p>Thank you, {reservation.name || 'there'}. Our team will be in touch shortly to confirm your table.</p><button className="button" onClick={() => setChoice(null)}>Back to Ziora <ArrowRight size={17} /></button></div> : <>{choice === 'options' ? <><p className="eyebrow">A table by the falls</p><h2>How would you like<br /><em>to reserve?</em></h2><div className="booking-options"><a href="tel:+919558490909"><span className="option-icon"><Phone size={19} /></span><span><strong>Direct call</strong><small>Speak with our team now</small></span><ArrowRight size={17} /></a><a href={`https://wa.me/919825000000?text=${whatsappText}`} target="_blank" rel="noreferrer"><span className="option-icon whatsapp"><Send size={19} /></span><span><strong>WhatsApp</strong><small>Message us in a moment</small></span><ArrowRight size={17} /></a><button onClick={() => setChoice('form')}><span className="option-icon"><CalendarDays size={19} /></span><span><strong>Fill form + WhatsApp</strong><small>Send your request to Ziora</small></span><ArrowRight size={17} /></button></div></> : choice === 'call' ? <div className="direct-state"><div className="success-icon"><Phone size={23} /></div><p className="eyebrow">We’re here</p><h2>Call us<br /><em>directly.</em></h2><p>Our reservations team is available every day from 6 PM to 11 PM.</p><a className="phone-number" href="tel:+919558490909">+91 95584 90909</a><button className="back-link" onClick={() => setChoice(null)}>← Other ways to reserve</button></div> : <form className="reservation-form" onSubmit={submit}><p className="eyebrow">Your reservation</p><h2>Set the<br /><em>scene.</em></h2><div className="field-grid"><label>Name<input required value={reservation.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" /></label><label>Phone<input required type="tel" value={reservation.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91" /></label><label>Date<input required type="date" value={reservation.date} onChange={(e) => update('date', e.target.value)} /></label><label>Time<select value={reservation.time} onChange={(e) => update('time', e.target.value)}>{['6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM'].map((time) => <option key={time}>{time}</option>)}</select><ChevronDown size={15} /></label><label>Guests<select value={reservation.guests} onChange={(e) => update('guests', e.target.value)}>{['2 guests', '3 guests', '4 guests', '5 guests', '6+ guests'].map((guests) => <option key={guests}>{guests}</option>)}</select><ChevronDown size={15} /></label></div><label>Anything we should know? <textarea value={reservation.note} onChange={(e) => update('note', e.target.value)} placeholder="A celebration, dietary note, or little request..." rows={3} /></label>{formError && <p className="form-error">{formError}</p>}<button className="button" type="submit">Send reservation request <ArrowRight size={17} /></button><button className="back-link" type="button" onClick={() => setChoice(null)}>← Other ways to reserve</button></form>}</>}</div></div>;
}

export default App;
