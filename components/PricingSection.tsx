"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Crown, Zap, Shield } from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

const PricingSection = () => {
  const { t } = useLanguage()
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: t("pricing.basic.name") || "Basic",
      icon: <Shield className="w-6 h-6" />,
      monthlyPrice: 9.99,
      annualPrice: 7.99,
      features: [
        t("pricing.basic.feature1") || "1 Device Connection",
        t("pricing.basic.feature2") || "50+ Server Locations",
        t("pricing.basic.feature3") || "Standard Speed",
        t("pricing.basic.feature4") || "24/7 Support",
      ],
      popular: false,
      gradient: "from-slate-600 to-slate-700",
    },
    {
      name: t("pricing.pro.name") || "Professional",
      icon: <Zap className="w-6 h-6" />,
      monthlyPrice: 14.99,
      annualPrice: 11.99,
      features: [
        t("pricing.pro.feature1") || "5 Device Connections",
        t("pricing.pro.feature2") || "100+ Server Locations",
        t("pricing.pro.feature3") || "High Speed Priority",
        t("pricing.pro.feature4") || "Ad Blocker Included",
        t("pricing.pro.feature5") || "Kill Switch Protection",
      ],
      popular: true,
      gradient: "from-purple-600 to-blue-600",
    },
    {
      name: t("pricing.premium.name") || "Premium",
      icon: <Crown className="w-6 h-6" />,
      monthlyPrice: 19.99,
      annualPrice: 15.99,
      features: [
        t("pricing.premium.feature1") || "Unlimited Devices",
        t("pricing.premium.feature2") || "200+ Server Locations",
        t("pricing.premium.feature3") || "Maximum Speed",
        t("pricing.premium.feature4") || "Advanced Security",
        t("pricing.premium.feature5") || "Dedicated IP Option",
        t("pricing.premium.feature6") || "Priority Support",
      ],
      popular: false,
      gradient: "from-yellow-500 to-orange-600",
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {t("pricing.title") || "Choose Your Plan"}
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            {t("pricing.subtitle") || "Select the perfect plan for your security needs"}
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? "text-slate-200" : "text-slate-500"}`}>
              {t("pricing.monthly") || "Monthly"}
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                isAnnual ? "bg-purple-600" : "bg-slate-600"
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  isAnnual ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? "text-slate-200" : "text-slate-500"}`}>
              {t("pricing.annual") || "Annual"}
            </span>
            {isAnnual && (
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                {t("pricing.save") || "Save 20%"}
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? "border-purple-500 shadow-2xl shadow-purple-500/20"
                  : "border-slate-700/50 hover:border-slate-600"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t("pricing.popular") || "Most Popular"}
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${plan.gradient} text-white mb-4`}
                >
                  {plan.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-2">{plan.name}</h3>
                <div className="text-4xl font-extrabold text-slate-200 mb-1">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  <span className="text-lg font-normal text-slate-400">/mo</span>
                </div>
                {isAnnual && <div className="text-sm text-slate-500 line-through">${plan.monthlyPrice}/mo</div>}
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                className={`w-full py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t("pricing.getStarted") || "Get Started"}
              </motion.button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-full border border-green-500/30">
            <Shield className="w-5 h-5" />
            <span className="font-medium">{t("pricing.guarantee") || "30-Day Money Back Guarantee"}</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default PricingSection
