/* ---------------------------------------------------------------------------
   TESTIMONIALS

   Hardcoded for now , there is no table for these yet. Replace the names,
   roles and words with real ones before this goes live.

   `quote` is the short line on the card. `story` is the longer piece shown on
   its own page at /testimonials/<id>. Add a `photo` (e.g.
   "/images/testimonials/priya.jpg") and it is used instead of the initial.
   --------------------------------------------------------------------------- */

export const testimonials = [
  {
    id: "priya",
    name: "Priya Menon",
    role: "Founder, small-batch skincare",
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
    quote:
      "I turned up on my own knowing nobody. By eleven-thirty I was in a conversation that mattered.",
    story: [
      "Walking into a room of strangers is the part everyone dreads. The format takes that away, because the introductions mean you already know who is worth talking to before the break.",
      "I met my first two hires through this meetup. Both were in the room for their own reasons and neither was looking for a job at the time.",
    ],
  },
];

export const getTestimonial = (id) =>
  testimonials.find((testimonial) => testimonial.id === id);
