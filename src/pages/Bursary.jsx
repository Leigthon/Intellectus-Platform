import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  CheckCircle,
  Clock,
  MapPin,
  ArrowRight,
  Banknote,
} from "lucide-react";

export default function Bursary() {
  const eligibility = [
    "Currently enrolled in Grade 8–12 or equivalent",
    "Demonstrated financial need",
    "Motivated to improve academic performance",
    "Willing to commit to regular tutoring sessions",
  ];

  const covers = [
    "A portion or full coverage of tutoring fees",
    "Access to learning materials and resources",
    "Regular progress check-ins and feedback",
    "Guidance on study habits and exam preparation",
  ];

  const steps = [
    {
      title: "Complete the Application Form",
      description:
        "Provide your details, school information, and a short motivation about why you’re applying.",
    },
    {
      title: "Submit Supporting Documents",
      description:
        "Upload or send proof of income and latest school report so we can fairly assess your application.",
    },
    {
      title: "Review & Feedback",
      description:
        "Our team reviews applications and will contact you with the outcome and next steps.",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Hero / Intro */}
        <section className="mb-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase text-[#1ac8db] mb-3">
              Intellectus Academy Bursary Assistant and University Assistant
            </p>
            <h1 className="text-4xl md:text-5xl font-black text-[#2c3e73] mb-4 leading-tight">
              Matric Bursary and University Guide
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Are you a matriculant ? are you overwelmed with by University applications and unsure how you are going to fund your studies?
              We can help you with that
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-stretch">
            <Card className="border-2 border-[#1ac8db]/10 bg-[#1ac8db]/5">
              <CardContent className="p-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1ac8db]/15 flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-[#1ac8db]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1ac8db] uppercase tracking-wide">
                        University Guide
                    </p>
                    <p className="text-lg font-semibold text-[#2c3e73]">
                      Lets apply to you dream University
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Track the application dates for you dream University and apply now
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1ac8db]" />
                    <span>Applications reviewed on a rolling basis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1ac8db]" />
                    <span>Cape Town and surrounding areas</span>
                  </div>
                </div>
              </CardContent>
            </Card>


        <Card className="border-2 border-[#1ac8db]/10 bg-[#1ac8db]/5">
              <CardContent className="p-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1ac8db]/15 flex items-center justify-center">
                    <Banknote className="w-8 h-8 text-[#1ac8db]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1ac8db] uppercase tracking-wide">
                        Funding Guide
                    </p>
                    <p className="text-lg font-semibold text-[#2c3e73]">
                      Lets apply for University funding
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">
                  Track the application dates for funding providers
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#1ac8db]" />
                    <span>Applications reviewed on a rolling basis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#1ac8db]" />
                    <span>Cape Town and surrounding areas</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            
            

            {/* <Card className="border-2 border-gray-200">
              <CardContent className="p-8 h-full flex flex-col justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#2c3e73] mb-2">
                    Quick overview
                  </h2>
                  <p className="text-gray-600">
                    Bursaries are awarded based on both{" "}
                    <span className="font-semibold text-[#2c3e73]">
                      financial need
                    </span>{" "}
                    and{" "}
                    <span className="font-semibold text-[#2c3e73]">
                      academic motivation
                    </span>
                    .
                  </p>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    • Available for Maths, Physical Sciences, Life Sciences and
                    Accounting.
                  </p>
                  <p>• Flexible options for partial or full support.</p>
                  <p>• Progress is reviewed regularly with students and parents.</p>
                </div>
                <div className="mt-4">
                  <Link to="/contact">
                    <Button className="w-full bg-[#2c3e73] hover:bg-[#23325f] text-white flex items-center justify-center gap-2">
                      Talk to us about bursaries
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </section>

        {/* Eligibility & Coverage */}
        <section className="mb-14 grid gap-8 md:grid-cols-2">
          <Card className="border-2 border-gray-200 hover:border-[#1ac8db] transition-colors">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-[#2c3e73] mb-4">
                Who can apply?
              </h2>
              <p className="text-gray-600 mb-5">
                We look for students who show potential, commitment, and a
                genuine desire to grow academically.
              </p>
              <ul className="space-y-3">
                {eligibility.map((item) => (
                  <li key={item} className="flex gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#1ac8db] flex-none" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200 hover:border-[#1ac8db] transition-colors">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-[#2c3e73] mb-4">
                What does the bursary cover?
              </h2>
              <p className="text-gray-600 mb-5">
                Support is tailored to each learner’s situation and academic
                goals.
              </p>
              <ul className="space-y-3">
                {covers.map((item) => (
                  <li key={item} className="flex gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-[#1ac8db] flex-none" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* How to apply */}
        <section className="mb-16">
          <div className="max-w-3xl mb-8">
            <h2 className="text-3xl font-bold text-[#2c3e73] mb-3">
              How to apply
            </h2>
            <p className="text-gray-600">
              The application process is simple and designed to help us
              understand your needs and how we can best support you.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="text-5xl font-black text-[#1ac8db]/15 mb-3">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-semibold text-[#2c3e73] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#2c3e73] rounded-3xl px-8 py-10 md:px-12 md:py-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">
              Ready to apply for a bursary?
            </h2>
            <p className="text-white/80 max-w-xl">
              If you’ve reached this page after logging in, please contact your
              tutor or complete the bursary enquiry form so we can guide you
              through the next steps.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/contact">
              <Button className="bg-[#1ac8db] hover:bg-[#15a3c0] text-white px-8">
                Contact Intellectus Academy
              </Button>
            </Link>
            <Link to="/">
              <Button
                variant="outline"
                className="border-white/70 text-white hover:bg-white/10"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}