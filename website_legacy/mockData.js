// Mock data for Intellectus Academy

export const subjects = [
  {
    id: 1,
    name: "Mathematics",
    description: "From basic algebra to advanced calculus, we make math click",
    icon: "Calculator",
    color: "#1ac8db"
  },
  {
    id: 2,
    name: "Physical Sciences",
    description: "Master physics and chemistry with hands-on problem solving",
    icon: "Atom",
    color: "#2c3e73"
  },
  {
    id: 3,
    name: "Life Sciences",
    description: "Explore biology and life systems with engaging lessons",
    icon: "Microscope",
    color: "#1ac8db"
  },
  {
    id: 4,
    name: "Accounting",
    description: "Balance sheets, financial statements, and business acumen",
    icon: "Receipt",
    color: "#2c3e73"
  }
];

export const tutors = [
  {
    id: 1,
    name: "Thandi Mthembu",
    subject: "Mathematics",
    qualification: "BSc Mathematics, UKZN",
    experience: "5 years",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    bio: "Passionate about making complex mathematical concepts simple and accessible."
  },
  {
    id: 2,
    name: "Sipho Ndlovu",
    subject: "Physical Sciences",
    qualification: "BSc Physics & Chemistry, Wits",
    experience: "7 years",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
    bio: "Specializes in practical applications and exam preparation techniques."
  },
  {
    id: 3,
    name: "Nomsa Dlamini",
    subject: "Life Sciences",
    qualification: "BSc Biological Sciences, UCT",
    experience: "4 years",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    bio: "Creates engaging lessons that bring biology to life for every student."
  },
  {
    id: 4,
    name: "Mandla Khumalo",
    subject: "Accounting",
    qualification: "BCom Accounting, UKZN",
    experience: "6 years",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    bio: "Expert in simplifying financial concepts and building confidence."
  }
];

export const testimonials = [
  {
    id: 1,
    student: "Lerato M.",
    grade: "Grade 12",
    subject: "Mathematics",
    text: "I went from 45% to 78% in just 3 months! The tutors really understand how to explain things clearly.",
    rating: 5
  },
  {
    id: 2,
    student: "Bongani K.",
    grade: "Grade 11",
    subject: "Physical Sciences",
    text: "Best decision I made for my matric preparation. The personalized attention made all the difference.",
    rating: 5
  },
  {
    id: 3,
    student: "Zanele N.",
    grade: "Grade 10",
    subject: "Accounting",
    text: "I finally understand accounting! My tutor is patient and explains everything step by step.",
    rating: 5
  }
];

export const pricingPlans = [
  {
    id: 1,
    name: "Individual Sessions",
    price: "R250",
    period: "per hour",
    features: [
      "One-on-one tutoring",
      "Flexible scheduling",
      "Personalized learning plan",
      "Progress tracking",
      "All subjects available"
    ],
    popular: false
  },
  {
    id: 2,
    name: "Weekly Package",
    price: "R900",
    period: "per week (4 hours)",
    features: [
      "4 hours of tutoring",
      "Same tutor consistency",
      "Priority scheduling",
      "Progress reports",
      "Study materials included",
      "Save R100"
    ],
    popular: true
  },
  {
    id: 3,
    name: "Intensive Prep",
    price: "R3200",
    period: "per month (16 hours)",
    features: [
      "16 hours of tutoring",
      "Exam preparation focus",
      "Past papers & memos",
      "Weekly progress reports",
      "WhatsApp support",
      "Save R800"
    ],
    popular: false
  }
];

export const contactInfo = {
  phone: ["068 791 2425", "083782 8477", "064661333"],
  email: "info@intellectusacademy.co.za",
  address: "KwaZulu-Natal, South Africa",
  hours: "Mon-Fri: 2PM-8PM, Sat: 9AM-5PM"
};

export const bookings = [];
export const contactSubmissions = [];