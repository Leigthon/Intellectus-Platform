import React from 'react';
import { CheckCircle, Target, Heart, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#2c3e73]/5 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-5xl font-bold text-[#2c3e73] mb-6">About Intellectus Academy</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We believe every student has the potential to excel. Our mission is to unlock that potential 
              through personalized, high-quality tutoring that builds confidence and achieves results.
            </p>
          </div>

          {/* Story Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-[#2c3e73] mb-4">Our Story</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded with a passion for education, Intellectus Academy began as a small initiative 
                  to help struggling students find their academic footing. Today, we've grown into a 
                  trusted tutoring center serving hundreds of students across KwaZulu-Natal.
                </p>
                <p>
                  What started as one-on-one tutoring sessions has evolved into a comprehensive academic 
                  support system, offering specialized tutoring in Mathematics, Physical Sciences, Life 
                  Sciences, and Accounting. Our approach combines expert knowledge with genuine care for 
                  each student's success.
                </p>
                <p>
                  We understand that academic struggles can affect confidence and motivation. That's why 
                  we don't just teach subjects – we build relationships, foster understanding, and create 
                  an environment where students feel safe to ask questions and make mistakes.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=600&fit=crop" 
                alt="Students studying"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-[#2c3e73] text-center mb-12">Our Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Excellence',
                  description: 'We strive for excellence in everything we do, from teaching methods to student outcomes.'
                },
                {
                  icon: Heart,
                  title: 'Compassion',
                  description: 'We understand that every student is unique and approach each with empathy and patience.'
                },
                {
                  icon: CheckCircle,
                  title: 'Integrity',
                  description: 'We maintain the highest standards of honesty, reliability, and professionalism.'
                },
                {
                  icon: Users,
                  title: 'Community',
                  description: 'We build a supportive learning community where students and tutors grow together.'
                }
              ].map((value, index) => (
                <Card key={index} className="text-center border-2 hover:border-[#1ac8db] transition-all">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-[#1ac8db]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-[#1ac8db]" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#2c3e73] mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-[#2c3e73] text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-white/90 leading-relaxed">
                  To provide accessible, high-quality tutoring that empowers students to achieve 
                  their academic goals and develop a lifelong love for learning. We are committed 
                  to making education personal, engaging, and effective.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#1ac8db] text-black">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-white/90 leading-relaxed">
                  To be recognized as the leading tutoring academy in KwaZulu-Natal, known for 
                  transforming academic struggles into success stories and helping every student 
                  reach their full potential.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#2c3e73] text-center mb-12">Our Teaching Approach</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Assessment',
                description: 'We begin by understanding your current level, learning style, and academic goals through comprehensive assessment.'
              },
              {
                step: '02',
                title: 'Personalization',
                description: 'Based on the assessment, we create a customized learning plan that addresses your specific needs and challenges.'
              },
              {
                step: '03',
                title: 'Implementation',
                description: 'Our expert tutors work with you using proven teaching methods, regular feedback, and continuous progress monitoring.'
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-[#1ac8db]/20 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold text-[#2c3e73] mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;