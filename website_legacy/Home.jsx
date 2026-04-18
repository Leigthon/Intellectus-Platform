import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, TrendingUp, Users, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { subjects, testimonials } from '../mockData';

const Home = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Students Tutored' },
    { icon: Award, value: '98%', label: 'Success Rate' },
    { icon: TrendingUp, value: '35%', label: 'Average Grade Improvement' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[90vh] flex items-center">
        {/* Organic Background Shapes inspired by flyer */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] opacity-60">
          <svg viewBox="0 0 600 600" className="w-full h-full">
            <path d="M150,0 Q300,100 450,0 T600,150 Q500,300 600,450 T450,600 Q300,500 150,600 T0,450 Q100,300 0,150 T150,0 Z" 
                  fill="#2c3e73" opacity="0.08" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] opacity-50">
          <svg viewBox="0 0 700 700" className="w-full h-full">
            <path d="M100,350 Q200,150 350,100 T600,350 Q500,550 350,600 T100,350 Z" 
                  fill="#1ac8db" opacity="0.12" />
          </svg>
        </div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] opacity-40">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <circle cx="200" cy="200" r="150" fill="#1ac8db" opacity="0.06" />
            <circle cx="200" cy="200" r="100" fill="#2c3e73" opacity="0.05" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="text-[#1ac8db] font-semibold text-lg tracking-wide uppercase">Welcome to</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-black text-[#2c3e73] leading-[1.1] tracking-tight">
                Struggling?<br />
                <span className="text-[#1ac8db] relative inline-block">
                  Let's fix that.
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none">
                    <path d="M2 10C100 3 200 3 298 10" stroke="#1ac8db" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
                  </svg>
                </span>
              </h1>
              <p className="text-2xl text-gray-600 leading-relaxed font-light">
                Tailored tutoring that helps you<br />
                <span className="font-semibold text-[#2c3e73]">own your academic success</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link to="/contact">
                  <Button className="bg-[#1ac8db] hover:bg-[#15a3c0] text-white px-10 py-7 text-lg font-semibold shadow-lg hover:shadow-xl group rounded-xl">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/subjects">
                  <Button variant="outline" className="border-2 border-[#2c3e73] text-[#2c3e73] hover:bg-[#2c3e73] hover:text-white px-10 py-7 text-lg font-semibold rounded-xl">
                    Explore Subjects
                  </Button>
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-[#1ac8db]">500+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#1ac8db]">98%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#1ac8db]">35%</div>
                  <div className="text-sm text-gray-600">Grade Boost</div>
                </div>
              </div>
            </div>

            {/* Image/Visual Element */}
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1ac8db]/30 to-[#2c3e73]/30 rounded-[3rem] blur-3xl" />
                <div className="relative bg-white/80 backdrop-blur-sm rounded-[3rem] p-10 shadow-2xl border border-gray-100">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_learn-ace/artifacts/edbnwe58_INTELLECTUS%20ACADEMY%20logo.jpg"
                    alt="Intellectus Academy"
                    className="w-full h-auto mb-8"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    {subjects.map((subject) => (
                      <div
                        key={subject.id}
                        className="bg-gradient-to-br from-[#2c3e73]/10 to-[#1ac8db]/10 rounded-2xl p-4 text-center hover:scale-105 transition-transform cursor-pointer border border-[#1ac8db]/20"
                      >
                        <p className="text-sm font-bold text-[#2c3e73]">{subject.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-24 bg-gradient-to-br from-[#2c3e73] via-[#2c3e73] to-[#1e2d5c] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,40 50,50 T100,50 L100,100 L0,100 Z" fill="white" opacity="0.1"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Real Results That Matter
            </h2>
            <p className="text-xl text-gray-300">Join hundreds of students achieving their dreams</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 hover:bg-white/20 transition-all border border-white/20">
                  <stat.icon className="w-16 h-16 text-[#1ac8db] mx-auto mb-6" />
                  <div className="text-5xl font-black text-white mb-3">{stat.value}</div>
                  <div className="text-lg text-gray-200 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] opacity-30">
          <svg viewBox="0 0 500 500" className="w-full h-full">
            <path d="M250,50 Q400,150 350,300 T250,450 Q100,400 50,250 T250,50 Z" 
                  fill="#1ac8db" opacity="0.08" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#1ac8db] font-semibold text-lg tracking-wide uppercase">Our Difference</span>
            <h2 className="text-5xl font-black text-[#2c3e73] mb-4 mt-2">
              Why Choose Intellectus Academy?
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto font-light">
              We're committed to helping you achieve your academic goals with personalized, 
              results-driven support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Personalized Learning',
                description: 'Every student learns differently. We tailor our approach to match your unique learning style.',
                icon: Users
              },
              {
                title: 'Experienced Tutors',
                description: 'Our tutors are qualified professionals with proven track records of student success.',
                icon: Award
              },
              {
                title: 'Flexible Scheduling',
                description: 'Book sessions that fit your timetable. We work around your schedule, not the other way around.',
                icon: CheckCircle
              },
              {
                title: 'Proven Results',
                description: 'Our students see an average 35% improvement in their grades within 3 months.',
                icon: TrendingUp
              },
              {
                title: 'Small Class Sizes',
                description: 'Maximum attention for every student. We focus on quality over quantity.',
                icon: Users
              },
              {
                title: 'Comprehensive Support',
                description: 'From homework help to exam prep, we cover all your academic needs.',
                icon: CheckCircle
              }
            ].map((feature, index) => (
              <Card key={index} className="group border-2 border-gray-100 hover:border-[#1ac8db] transition-all hover:shadow-2xl hover:-translate-y-1 bg-white">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1ac8db]/20 to-[#2c3e73]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-[#1ac8db]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#2c3e73] mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-30">
          <svg viewBox="0 0 600 600" className="w-full h-full">
            <path d="M0,300 Q150,200 300,300 T600,300 L600,600 L0,600 Z" 
                  fill="#2c3e73" opacity="0.05" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#1ac8db] font-semibold text-lg tracking-wide uppercase">Success Stories</span>
            <h2 className="text-5xl font-black text-[#2c3e73] mb-4 mt-2">
              What Our Students Say
            </h2>
            <p className="text-gray-600 text-xl font-light">
              Real success stories from real students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white hover:shadow-2xl transition-all border-2 hover:border-[#1ac8db] group hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-[#1ac8db] text-2xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="border-t pt-6 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1ac8db] to-[#2c3e73] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.student.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-[#2c3e73]">{testimonial.student}</p>
                      <p className="text-sm text-gray-500">{testimonial.grade} • {testimonial.subject}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1ac8db] to-[#15a3c0] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 Q50,20 100,0 L100,100 L0,100 Z" fill="white"/>
          </svg>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
            Ready to Transform Your Grades?
          </h2>
          <p className="text-2xl text-white/95 mb-10 font-light">
            Join hundreds of students who have achieved their academic goals with us
          </p>
          <Link to="/contact">
            <Button className="bg-blue text-[#1ac8db] hover:bg-gray-100 px-12 py-8 text-xl font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform">
              Book Your First Session
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;