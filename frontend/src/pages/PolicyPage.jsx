import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Truck, RefreshCcw, HelpCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const iconMap = {
  'delivery-policy': ShieldCheck,
  'shipping-info': Truck,
  'returns-refunds': RefreshCcw,
  'faq': HelpCircle,
};

const titleMap = {
  'delivery-policy': 'Live Delivery Policy',
  'shipping-info': 'Shipping Information',
  'returns-refunds': 'Returns & Refunds',
  'faq': 'Frequently Asked Questions',
};

const keyMap = {
  'delivery-policy': 'delivery_policy',
  'shipping-info': 'shipping_info',
  'returns-refunds': 'returns_refunds',
  'faq': 'faq_content',
};

export default function PolicyPage() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const Icon = iconMap[slug] || ShieldCheck;
  const title = titleMap[slug] || 'Policy';

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        const key = keyMap[slug];
        setContent(data[key] || 'No information available.');
      } catch (err) {
        console.error('Error fetching policy:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 pt-32 pb-20">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Mart
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a1a] rounded-3xl p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Icon size={120} />
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
              <Icon size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">{title}</h1>
          </div>

          <div className="prose prose-invert max-w-none">
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
              </div>
            ) : (
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {content}
              </p>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
