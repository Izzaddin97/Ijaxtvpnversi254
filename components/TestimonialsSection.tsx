"use client"

import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

const TestimonialsSection = () => {
  const { t } = useLanguage()

  const testimonials = [
    {
      name: "Ahmad Rahman",
      role: t("testimonials.testimonial1.role"),
      content: t("testimonials.testimonial1.content"),
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "Sarah Chen",
      role: t("testimonials.testimonial2.role"),
      content: t("testimonials.testimonial2.content"),
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    },
    {
      name: "David Kumar",
      role: t("testimonials.testimonial3.role"),
      content: t("testimonials.testimonial3.content"),
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
  ]

  const TestimonialCard = ({ testimonial, index }: { testimonial: (typeof testimonials)[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 group hover:-translate-y-2"
    >
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      <div className="relative mb-6">
        <Quote className="absolute -top-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 text-purple-500/30" />
        <p className="text-slate-300 leading-relaxed text-sm sm:text-base pl-4 sm:pl-6">{testimonial.content}</p>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src={testimonial.avatar || "/placeholder.svg"}
          alt={testimonial.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-purple-500/30"
        />
        <div>
          <h4 className="font-semibold text-slate-50 text-sm sm:text-base">{testimonial.name}</h4>
          <p className="text-slate-400 text-xs sm:text-sm">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  )

  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-slate-50">
            {t("testimonials.title")}
          </h2>
          <p className="text-base sm:text-lg text-slate-400">{t("testimonials.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
