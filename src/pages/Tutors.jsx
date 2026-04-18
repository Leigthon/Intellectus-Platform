import React from "react";
import { tutors } from "@/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Tutors() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-[#2c3e73] mb-3">Our Tutors</h1>
          <p className="text-gray-600 text-lg">
            Experienced, supportive, and focused on your success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tutors.map((t) => (
            <Card
              key={t.id}
              className="border-2 bg-white hover:border-[#1ac8db] transition-all hover:shadow-xl"
            >
              <CardContent className="p-6">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-50 object-cover rounded-xl mb-4"
                />
                <h3 className="text-xl font-bold text-[#2c3e73]">{t.name}</h3>
                <p className="text-[#1ac8db] font-semibold text-sm mt-1">
                  {t.subject}
                </p>
                <p className="text-gray-600 text-sm mt-3">{t.bio}</p>
                <div className="mt-4 text-xs text-gray-500 space-y-1">
                  <p>{t.qualification}</p>
                  <p>{t.experience} experience</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/contact">
            <Button className="bg-[#1ac8db] hover:bg-[#15a3c0] text-white px-8 py-3">
              Book With a Tutor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

