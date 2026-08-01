/* ---------------------------------------------------------------------------
   TESTIMONIALS

   Hardcoded for now , there is no table for these yet. Replace the names,
   roles and words with real ones before this goes live.

   `quote`   the short line on the card
   `outcome` the one thing they walked away with , shown as a chip
   `story`   the longer piece on its own page at /testimonials/<id>

   Add a `photo` (e.g. "/images/testimonials/priya.jpg") and it is used instead
   of the initials.
   --------------------------------------------------------------------------- */

export const testimonials = [
  {
    id: "priya",
    name: "Priya Menon",
    role: "Founder, small-batch skincare",
    outcome: "Cut packaging costs by a third",
    quote:
      "I came for the networking and stayed because someone in the room had already solved my packaging problem.",
    story: [
      "I had been running my skincare brand for about eight months and had hit a wall with packaging costs. Every supplier I found wanted a minimum order I could not justify.",
      "At my second Business 4.0 meetup I mentioned it during intros. Two people came up afterwards , one had used a smaller supplier in Noida, the other offered to split a bulk order with me.",
      "That one conversation cut my unit cost by a third. I have not missed a Saturday since.",
    ],
  },
  {
    id: "arjun",
    name: "Arjun Pillai",
    role: "Freelance developer",
    outcome: "Two long-term clients",
    quote:
      "Nobody pitches at you here. You say what you are stuck on and the room actually answers.",
    story: [
      "Most networking events I had been to felt like a queue of people waiting to sell me something. This one is different because of how it starts , everyone introduces themselves and says what they are working on.",
      "I have picked up two long-term clients from those introductions, but honestly the more useful part has been the advice. I priced my work far too low for years and it took one honest conversation here to fix that.",
    ],
  },
  {
    id: "sana",
    name: "Sana Qureshi",
    role: "Marketing consultant",
    outcome: "Learned what to charge",
    quote:
      "It is the only room in Delhi where I can ask a stupid question and get a straight answer.",
    story: [
      "I moved into consulting after years in-house and did not know what I did not know , how to scope work, when to say no, what to charge.",
      "The group is generous with the unglamorous details. People will tell you what actually went wrong in their business, which you never get at a conference.",
    ],
  },
  {
    id: "rohit",
    name: "Rohit Bansal",
    role: "Building a logistics start-up",
    outcome: "Met his first two hires",
    quote:
      "I turned up on my own knowing nobody. By eleven-thirty I was in a conversation that mattered.",
    story: [
      "Walking into a room of strangers is the part everyone dreads. The format takes that away, because the introductions mean you already know who is worth talking to before the break.",
      "I met my first two hires through this meetup. Both were in the room for their own reasons and neither was looking for a job at the time.",
    ],
  },
  {
    id: "meera",
    name: "Meera Iyer",
    role: "Chartered accountant",
    outcome: "Found her first three clients",
    quote:
      "I came to help other people with their books and left with a practice of my own.",
    story: [
      "I started coming because founders kept asking tax questions in a WhatsApp group I was in, and someone suggested I say it in person instead.",
      "Three of the people I answered that first Saturday are clients now. I did not sell anything , I just answered the question properly and they came back the following month.",
    ],
  },
  {
    id: "vikram",
    name: "Vikram Sethi",
    role: "Runs a café in Karol Bagh",
    outcome: "Fixed a money-losing menu",
    quote:
      "Two hours in that room did more for my margins than a year of reading about it.",
    story: [
      "I had been running the café for three years on instinct and it was busy but barely profitable. I said so out loud, which I had never done in front of other business owners.",
      "Somebody sat with me and worked out which items were actually losing money. We cut four things off the menu that week. That was the difference between breaking even and not.",
    ],
  },
  {
    id: "neha",
    name: "Neha Chauhan",
    role: "Product designer, going independent",
    outcome: "Doubled her rate",
    quote:
      "Everyone told me my rate was too low. Here, someone told me exactly what to charge instead.",
    story: [
      "Going independent after six years in a company is mostly a pricing problem and nobody warns you about it.",
      "The specificity is what helped , not 'charge more' but a number, from a person who bills for the same work. I doubled my rate on the next project and nobody blinked.",
    ],
  },
  {
    id: "imran",
    name: "Imran Sheikh",
    role: "Second-generation textile trader",
    outcome: "Took the business online",
    quote:
      "My father built this on phone calls. I needed a room that understood both halves of that.",
    story: [
      "Taking a forty-year-old trading business online is not a technology problem, it is a family one. Most start-up crowds could not help me with that.",
      "Here there were people who had done exactly this. One of them walked me through what to keep offline, which mattered more than anything I got from the internet.",
    ],
  },
];

export const getTestimonial = (id) =>
  testimonials.find((testimonial) => testimonial.id === id);
