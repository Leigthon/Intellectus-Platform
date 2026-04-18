import React from "react";
import { pricingPlans } from "@/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Pricing() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-[#2c3e73] mb-3">Pricing</h1>
          <p className="text-gray-600 text-lg">
            Simple packages to fit your goals and schedule.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.id}
              className={`border-2 transition-all hover:shadow-2xl ${
                plan.popular
                  ? "border-[#1ac8db] bg-[#1ac8db]/5"
                  : "border-gray-200 bg-white hover:border-[#1ac8db]"
              }`}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#2c3e73]">
                    {plan.name}
                  </h3>
                  {plan.popular && (
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#1ac8db] text-white">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-4xl font-black text-[#2c3e73]">
                    {plan.price}
                  </div>
                  <div className="text-sm text-gray-600">{plan.period}</div>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-3 text-sm text-gray-700">
                      <Check className="w-5 h-5 text-[#1ac8db] flex-none" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link to="/contact">
                    <Button className="w-full bg-[#2c3e73] hover:bg-[#23325f] text-white">
                      Choose Plan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

