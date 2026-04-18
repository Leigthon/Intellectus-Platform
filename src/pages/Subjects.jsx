import React from "react";
import { subjects } from "@/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calculator, Atom, Microscope, Receipt } from "lucide-react";

// Map icon names to icon components
const iconMap = {
  Calculator,
  Atom,
  Microscope,
  Receipt,
};

export default function Subjects() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-[#2c3e73] mb-3">Subjects</h1>
          <p className="text-gray-600 text-lg">
            Choose a subject and let’s build confidence and results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((s) => {
            const IconComponent = iconMap[s.icon];
            return (
              <Card
                key={s.id}
                className="border-2 hover:border-[#1ac8db] transition-all hover:shadow-xl"
              >
                <CardContent className="p-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${s.color}10` }}
                  >
                    {IconComponent && (
                      <IconComponent 
                        className="w-6 h-6" 
                        style={{ color: s.color }}
                      />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#2c3e73] mb-2">
                    {s.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {s.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 flex justify-center">
          <Link to="/contact">
            <Button className="bg-[#1ac8db] hover:bg-[#15a3c0] text-white px-8 py-3">
              Book a Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

