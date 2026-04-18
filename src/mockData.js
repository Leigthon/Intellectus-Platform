// Mock data for Intellectus Academy

export const subjects = [
  {
    id: 1,
    name: "Mathematics",
    description: "From basic algebra to advanced calculus, we make math click",
    icon: "Calculator",
    color: "#1ac8db",
  },
  {
    id: 2,
    name: "Physical Sciences",
    description: "Master physics and chemistry with hands-on problem solving",
    icon: "Atom",
    color: "#2c3e73",
  },
  {
    id: 3,
    name: "Life Sciences",
    description: "Explore biology and life systems with engaging lessons",
    icon: "Microscope",
    color: "#1ac8db",
  },
  {
    id: 4,
    name: "Accounting",
    description: "Balance sheets, financial statements, and business acumen",
    icon: "Receipt",
    color: "#2c3e73",
  },
];

export const tutors = [
  {
    id: 1,
    name: "Leigthon Messina",
    subject: "Mathematics and Physical Sciences",
    qualification: "BSc Computer Science and Computer Engineering final year,UCT",
    experience: "4 years",
    image:
      "profile images/WhatsApp Image 2025-11-22 at 13.01.48.jpeg",
    // bio: "Passionate about making complex mathematical concepts simple and accessible.",
  },
  {
    id: 2,
    name: "Asheeqah Adonis",
    subject: "Mathematics , Physical Sciences,Accounting and Life Sciences",
    qualification: "MBChB third year",
    experience: "2 years",
    image:
      "profile images/WhatsApp Image 2026-02-02 at 15.05.54.jpeg",
    // bio: "Specializes in practical applications and exam preparation techniques.",
  },
  
];

export const testimonials = [
  {
    id: 1,
    student: "Lerato M.",
    grade: "Grade 12",
    subject: "Mathematics",
    text: "I went from 45% to 78% in just 3 months! The tutors really understand how to explain things clearly.",
    rating: 5,
  },
  {
    id: 2,
    student: "Bongani K.",
    grade: "Grade 11",
    subject: "Physical Sciences",
    text: "Best decision I made for my matric preparation. The personalized attention made all the difference.",
    rating: 5,
  },
  {
    id: 3,
    student: "Zanele N.",
    grade: "Grade 10",
    subject: "Accounting",
    text: "I finally understand accounting! My tutor is patient and explains everything step by step.",
    rating: 5,
  },
];

export const pricingPlans = [
  {
    id: 1,
    name: "Online Sessions",
    price: "R100",
    period: "per hour",
    features: [
      "Online",
      "One-on-one tutoring",
      "Flexible scheduling",
      "Personalized learning plan",
      "Progress tracking",
      "All subjects available",
    ],
    popular: false,
  },
  {
    id: 2,
    name: "In-Person Sessions",
    price: "R120",
    period: "per hour",
    features: [
      "In Person",
      "One-on-one tutoring",
      "Flexible scheduling",
      "Personalized learning plan",
      "Progress tracking",
      "All subjects available",,
    ],
    popular: true,
  },
  // {
  //   id: 3,
  //   name: "Intensive Prep",
  //   price: "R3200",
  //   period: "per month (16 hours)",
  //   features: [
  //     "16 hours of tutoring",
  //     "Exam preparation focus",
  //     "Past papers & memos",
  //     "Weekly progress reports",
  //     "WhatsApp support",
  //     "Save R800",
  //   ],
  //   popular: false,
  // },
];

export const images ={
  image:"images/Screenshot2026-02-04at21.43.48(2).jpg",
}

export const contactInfo = {
  phone: ["068 791 2425", "083 782 8477", "066 466 1333"],
  email: "myintellectusacademy@gmail.com",
  address: "Cape Town, South Africa",
  hours: "Mon-Fri: 2PM-8PM, Sat: 9AM-5PM",
};

export const bookings = [];
export const contactSubmissions = [];

