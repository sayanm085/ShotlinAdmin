// src/Layout/WebContentEdit.layout.jsx
import React from 'react';
import { useWebContent } from '@/Hooks/useWebContent.js';
import HeroContentForm from './WebContent layouts/HeroContent.layout';
import BrandPartnersManager from './WebContent layouts/BrandPartnersManager.layout';
import ServicesManager from './WebContent layouts/ServicesManager.layout';
import WhyChooseUsManager from './WebContent layouts/WhyChooseUsManager.layout';
import FAQsManager from './WebContent layouts/FAQsManager.layout';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Image, Users, Briefcase, Star, HelpCircle } from 'lucide-react';

export default function WebContentEdit() {
  // 1️⃣ Fetch the entire content object once
  const { data, isLoading, isError } = useWebContent();

  if (isLoading) {
    return <p className="p-8 text-center">Loading content…</p>;
  }
  if (isError || !data) {
    return <p className="p-8 text-center text-red-600">Error loading content.</p>;
  }

  // 2️⃣ Destructure each section for easy prop-drilling
  const {
    hero,
    BrandPartners,
    Services,
    WhyChooseUs,
    FAQs,
  } = data;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Web Content Editor</h1>

      <Accordion type="multiple" className="space-y-4">
        {/* Hero Section */}
        <AccordionItem value="hero">
          <AccordionTrigger className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <Image className="h-5 w-5 text-blue-500" />
            <span className="text-lg font-medium">Hero Section</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-6 rounded-lg shadow">
            {/* Pass only the hero slice */}
            <HeroContentForm initialData={hero} />
          </AccordionContent>
        </AccordionItem>

        {/* Brand Partners */}
        <AccordionItem value="brands">
          <AccordionTrigger className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <Users className="h-5 w-5 text-green-500" />
            <span className="text-lg font-medium">Brand Partners</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-6 rounded-lg shadow">
            <BrandPartnersManager initialData={BrandPartners} />
          </AccordionContent>
        </AccordionItem>

        {/* Services */}
        <AccordionItem value="services">
          <AccordionTrigger className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <Briefcase className="h-5 w-5 text-purple-500" />
            <span className="text-lg font-medium">Services</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-6 rounded-lg shadow">
            <ServicesManager initialData={Services} />
          </AccordionContent>
        </AccordionItem>

        {/* Why Choose Us */}
        <AccordionItem value="whychoose">
          <AccordionTrigger className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-lg font-medium">Why Choose Us</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-6 rounded-lg shadow">
            <WhyChooseUsManager initialData={WhyChooseUs} />
          </AccordionContent>
        </AccordionItem>

        {/* FAQs */}
        <AccordionItem value="faqs">
          <AccordionTrigger className="flex items-center space-x-2 bg-white p-4 rounded-lg shadow hover:bg-gray-100">
            <HelpCircle className="h-5 w-5 text-red-500" />
            <span className="text-lg font-medium">FAQs</span>
          </AccordionTrigger>
          <AccordionContent className="bg-white p-6 rounded-lg shadow">
            <FAQsManager initialData={FAQs} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
