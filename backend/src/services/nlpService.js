const productInfo = {
  products: [
    {
      name: "Enterprise CRM Suite",
      nameHi: "एंटरप्राइज़ CRM सूट",
      description: "Complete customer relationship management solution for large businesses.",
      descriptionHi: "बड़े व्यवसायों के लिए संपूर्ण ग्राहक संबंध प्रबंधन समाधान।",
      pricing: "Starting at $999/month",
      pricingHi: "$999/माह से शुरू",
      features: [
        "Advanced analytics dashboard",
        "Custom workflow automation",
        "Enterprise-grade security",
        "24/7 dedicated support"
      ],
      featuresHi: [
        "उन्नत एनालिटिक्स डैशबोर्ड",
        "कस्टम वर्कफ़्लो ऑटोमेशन",
        "एंटरप्राइज़-ग्रेड सुरक्षा",
        "24/7 समर्पित सहायता"
      ]
    },
    {
      name: "Small Business CRM",
      nameHi: "छोटे व्यवसाय CRM",
      description: "Streamlined CRM designed for small to medium businesses.",
      descriptionHi: "छोटे से मध्यम व्यवसायों के लिए डिज़ाइन किया गया सुव्यवस्थित CRM।",
      pricing: "Starting at $199/month",
      pricingHi: "$199/माह से शुरू",
      features: [
        "Contact management",
        "Sales pipeline tracking",
        "Email integration",
        "Basic reporting"
      ],
      featuresHi: [
        "संपर्क प्रबंधन",
        "बिक्री पाइपलाइन ट्रैकिंग",
        "ईमेल एकीकरण",
        "बुनियादी रिपोर्टिंग"
      ]
    },
    {
      name: "Sales Analytics Pro",
      nameHi: "सेल्स एनालिटिक्स प्रो",
      description: "Advanced analytics platform for sales data optimization.",
      descriptionHi: "बिक्री डेटा अनुकूलन के लिए उन्नत एनालिटिक्स प्लेटफॉर्म।",
      pricing: "Starting at $499/month",
      pricingHi: "$499/माह से शुरू",
      features: [
        "Predictive analytics",
        "Custom reporting",
        "Data visualization",
        "API access"
      ],
      featuresHi: [
        "भविष्यवाणी एनालिटिक्स",
        "कस्टम रिपोर्टिंग",
        "डेटा विज़ुअलाइज़ेशन",
        "API एक्सेस"
      ]
    },
    {
      name: "Customer Support Module",
      nameHi: "ग्राहक सहायता मॉड्यूल",
      description: "Integrated support ticketing and resolution system.",
      descriptionHi: "एकीकृत सहायता टिकटिंग और समाधान प्रणाली।",
      pricing: "Starting at $299/month as add-on",
      pricingHi: "ऐड-ऑन के रूप में $299/माह से शुरू",
      features: [
        "Ticket management",
        "SLA tracking",
        "Knowledge base",
        "Customer portal"
      ],
      featuresHi: [
        "टिकट प्रबंधन",
        "SLA ट्रैकिंग",
        "नॉलेज बेस",
        "ग्राहक पोर्टल"
      ]
    }
  ],
  competitors: [],
  metrics: {}
};

const context = {
  questionCount: 0
};

function analyzeContext(messages) {
  const lastUserMessage = messages
    .filter(m => m.sender === 'user')
    .slice(-2)
    .map(m => m.content.toLowerCase());

  if (lastUserMessage.length > 0) {
    const lastMessageLower = lastUserMessage[0];
    productInfo.products.forEach(product => {
      const productNameLower = product.name.toLowerCase();
      const productNameHiLower = product.nameHi ? product.nameHi.toLowerCase() : '';
      // Check for product name in English, Hindi, or a mix
      if (lastMessageLower.includes(productNameLower) || 
          (productNameHiLower && lastMessageLower.includes(productNameHiLower)) ||
          (lastMessageLower.includes('crm') && (lastMessageLower.includes('small business') || lastMessageLower.includes('छोटे व्यवसाय'))) ||
          (lastMessageLower.includes('sales analytics') && lastMessageLower.includes('pro')) ||
          (lastMessageLower.includes('customer support') && lastMessageLower.includes('module'))
         ) {
        context.lastProduct = product.name;
      }
    });

    // Check for topics in English, Hindi, or a mix
    if (lastMessageLower.includes('price') || lastMessageLower.includes('cost') || lastMessageLower.includes('pricing') ||
        lastMessageLower.includes('कीमत') || lastMessageLower.includes('मूल्य') || lastMessageLower.includes('दाम')) {
      context.lastTopic = 'pricing';
    } else if (lastMessageLower.includes('competitor') || lastMessageLower.includes('compare') || lastMessageLower.includes('difference') ||
               lastMessageLower.includes('प्रतियोगी') || lastMessageLower.includes('तुलना') || lastMessageLower.includes('अंतर')) {
      context.lastTopic = 'competitors';
    } else if (lastMessageLower.includes('product') || lastMessageLower.includes('feature') || lastMessageLower.includes('solution') ||
               lastUserMessage[0].includes('उत्पाद') || lastUserMessage[0].includes('फीचर') || lastUserMessage[0].includes('विशेषता')) {
      context.lastTopic = 'products';
    }

    context.questionCount++;
  }
}

function detectLanguage(text) {
  const hindiPattern = /[\u0900-\u097F]/;
  return hindiPattern.test(text) ? 'hi' : 'en';
}


const responses = {
  greeting: {
    en: [
      "Hello! I'm here to help you find the perfect solution for your business. What can I assist you with today?",
      "Welcome! I'd love to help you explore our products and services. What brings you here today?",
      "Hi there! I'm your AI sales assistant. How can I help make your business more successful?"
    ],
    hi: [
      "नमस्ते! मैं यहाँ आपके व्यवसाय के लिए सही समाधान खोजने में आपकी मदद करने के लिए हूँ। आज मैं आपकी कैसे सहायता कर सकता हूँ?",
      "स्वागत है! मुझे आपके उत्पादों और सेवाओं का पता लगाने में आपकी मदद करना अच्छा लगेगा। आज आप यहाँ क्यों आए हैं?",
      "नमस्कार! मैं आपका AI बिक्री सहायक हूँ। मैं आपके व्यवसाय को और सफल बनाने में कैसे मदद कर सकता हूँ?"
    ]
  },
  products: {
    en: (lastProduct) => {
      if (lastProduct) {
        const product = productInfo.products.find(p => 
          p.name.toLowerCase().includes(lastProduct.toLowerCase()) ||
          p.nameHi.toLowerCase().includes(lastProduct.toLowerCase())
        );
        if (product) {
          return `Let me tell you more about ${product.name}:\n\n` +
            `${product.description}\n\n` +
            `Key features:\n` +
            product.features.map(f => `• ${f}`).join('\n') +
            `\n\nPricing: ${product.pricing}\n\n` +
            `Would you like to schedule a demo or learn about other products?`;
        }
      }

      return "We offer several powerful solutions:\n\n" +
        productInfo.products.map(p => `• ${p.name}: ${p.description}\n  ${p.pricing}`).join('\n\n') +
        "\n\nWhich solution interests you most?";
    },
    hi: (lastProduct) => {
      if (lastProduct) {
        const product = productInfo.products.find(p => 
          p.name.toLowerCase().includes(lastProduct.toLowerCase()) ||
          p.nameHi.toLowerCase().includes(lastProduct.toLowerCase())
        );
        if (product) {
          return `मुझे ${product.nameHi} के बारे में और बताने दीजिए:\n\n` +
            `${product.descriptionHi}\n\n` +
            `मुख्य विशेषताएं:\n` +
            product.featuresHi.map(f => `• ${f}`).join('\n') +
            `\n\nमूल्य निर्धारण: ${product.pricingHi}\n\n` +
            `क्या आप डेमो शेड्यूल करना चाहेंगे या अन्य उत्पादों के बारे में जानना चाहेंगे?`;
        }
      }

      return "हम कई शक्तिशाली समाधान प्रदान करते हैं:\n\n" +
        productInfo.products.map(p => `• ${p.nameHi}: ${p.descriptionHi}\n  ${p.pricingHi}`).join('\n\n') +
        "\n\nकौन सा समाधान आपको सबसे ज्यादा दिलचस्प लगता है?";
    }
  },
  pricing: {
    en: (lastProduct) => {
      if (lastProduct) {
        const product = productInfo.products.find(p => 
          p.name.toLowerCase().includes(lastProduct.toLowerCase()) ||
          p.nameHi.toLowerCase().includes(lastProduct.toLowerCase())
        );
        if (product) {
          return `${product.name} ${product.pricing}.\n\n` +
            "This includes:\n" +
            product.features.map(f => `• ${f}`).join('\n') +
            "\n\nWould you like to discuss custom pricing options or learn about our other products?";
        }
      }

      return "Here's our pricing overview:\n\n" +
        productInfo.products.map(p => `• ${p.name}: ${p.pricing}`).join('\n\n') +
        "\n\nWe also offer custom enterprise pricing and flexible payment terms. Would you like to discuss specific pricing for your needs?";
    },
    hi: (lastProduct) => {
      if (lastProduct) {
        const product = productInfo.products.find(p => 
          p.name.toLowerCase().includes(lastProduct.toLowerCase()) ||
          p.nameHi.toLowerCase().includes(lastProduct.toLowerCase())
        );
        if (product) {
          return `${product.nameHi} ${product.pricingHi}।\n\n` +
            "इसमें शामिल है:\n" +
            product.featuresHi.map(f => `• ${f}`).join('\n') +
            "\n\nक्या आप कस्टम मूल्य निर्धारण विकल्पों पर चर्चा करना चाहेंगे या हमारे अन्य उत्पादों के बारे में जानना चाहेंगे?";
        }
      }

      return "यहाँ हमारा मूल्य निर्धारण अवलोकन है:\n\n" +
        productInfo.products.map(p => `• ${p.nameHi}: ${p.pricingHi}`).join('\n\n') +
        "\n\nहम कस्टम एंटरप्राइज़ मूल्य निर्धारण और लचीली भुगतान शर्तें भी प्रदान करते हैं। क्या आप अपनी आवश्यकताओं के लिए विशिष्ट मूल्य निर्धारण पर चर्चा करना चाहेंगे?";
    }
  },
  competitors: {
    en: (competitor) => {
      if (competitor) {
        const comp = productInfo.competitors.find(c =>
          c.name.toLowerCase().includes(competitor.toLowerCase())
        );
        if (comp) {
          return `Compared to ${comp.name}:\n\n` +
            comp.comparison + "\n\n" +
            "Key advantages:\n" +
            comp.advantages.map(a => `• ${a}`).join('\n') +
            "\n\nWould you like to see a detailed feature comparison?";
        }
      }

      return "Here's how we stand out:\n\n" +
        "• Industry-leading uptime: " + productInfo.metrics.uptime + "\n" +
        "• Customer satisfaction: " + productInfo.metrics.customerSatisfaction + "\n" +
        "• Average response time: " + productInfo.metrics.averageResponseTime + "\n\n" +
        "Would you like to know more about how we compare to a specific competitor?";
    },
    hi: (competitor) => {
      if (competitor) {
        const comp = productInfo.competitors.find(c =>
          c.name.toLowerCase().includes(competitor.toLowerCase())
        );
        if (comp) {
          return `${comp.name} की तुलना में:\n\n` +
            comp.comparisonHi + "\n\n" +
            "मुख्य लाभ:\n" +
            comp.advantagesHi.map(a => `• ${a}`).join('\n') +
            "\n\nक्या आप विस्तृत फीचर तुलना देखना चाहेंगे?";
        }
      }

      return "यहाँ बताया गया है कि हम कैसे अलग हैं:\n\n" +
        "• उद्योग-अग्रणी अपटाइम: " + productInfo.metrics.uptimeHi + "\n" +
        "• ग्राहक संतुष्टि: " + productInfo.metrics.customerSatisfactionHi + "\n" +
        "• औसत प्रतिक्रिया समय: " + productInfo.metrics.averageResponseTimeHi + "\n\n" +
        "क्या आप किसी विशिष्ट प्रतियोगी से हमारी तुलना के बारे में और जानना चाहेंगे?";
    }
  },
  demo: {
    en: [
      "I'd be happy to arrange a personalized demo! Our demos are tailored to your specific needs and typically last 30 minutes. Would you prefer a general overview or a deep dive into specific features?",
      "Great choice! Our demos show you exactly how our solutions can benefit your business. When would be a good time for you? We can also include your team members in the session.",
      "I'll help you schedule a demo with one of our product specialists. They can show you real-world examples and answer any specific questions. What's the best time for your schedule?"
    ],
    hi: [
      "मुझे व्यक्तिगत डेमो की व्यवस्था करने में खुशी होगी! हमारे डेमो आपकी विशिष्ट आवश्यकताओं के अनुसार तैयार किए जाते हैं और आमतौर पर 30 मिनट तक चलते हैं। क्या आप सामान्य अवलोकन पसंद करेंगे या विशिष्ट फीचर्स में गहराई से जाना चाहेंगे?",
      "बहुत अच्छा विकल्प! हमारे डेमो आपको बताते हैं कि हमारे समाधान आपके व्यवसाय को कैसे लाभ पहुंचा सकते हैं। आपके लिए कौन सा समय अच्छा होगा? हम आपकी टीम के सदस्यों को भी सेशन में शामिल कर सकते हैं।",
      "मैं आपको हमारे उत्पाद विशेषज्ञों में से किसी एक के साथ डेमो शेड्यूल करने में मदद करूंगा। वे आपको वास्तविक दुनिया के उदाहरण दिखा सकते हैं और किसी भी विशिष्ट प्रश्न का उत्तर दे सकते हैं। आपके शेड्यूल के लिए सबसे अच्छा समय क्या है?"
    ]
  },
  followUp: {
    en: [
      "Is there anything specific you'd like to know more about?",
      "What aspects are most important for your business needs?",
      "Would you like me to elaborate on any particular features?"
    ],
    hi: [
      "क्या कोई विशिष्ट चीज़ है जिसके बारे में आप और जानना चाहते हैं?",
      "आपके व्यवसायी आवश्यकताओं के लिए कौन से पहलू सबसे महत्वपूर्ण हैं?",
      "क्या आप चाहेंगे कि मैं किसी विशेष फीचर के बारे में विस्तार से बताऊं?"
    ]
  },
  fallback: {
    en: [
      "I want to make sure I understand your needs correctly. Could you rephrase that, or let me know which aspect of our solutions you'd like to explore?",
      "I apologize, but I want to provide you with the most accurate information. Could you clarify what you're looking to learn about?",
      "To better assist you, could you specify which area you're most interested in: products, pricing, features, or comparison with competitors?"
    ],
    hi: [
      "मैं यह सुनिश्चित करना चाहता हूं कि मैं आपकी आवश्यकताओं को सही तरीके से समझूं। क्या आप इसे दोबारा कह सकते हैं, या बता सकते हैं कि हमारे समाधानों के किस पहलू का आप पता लगाना चाहते हैं?",
      "मुझे खुशी है, लेकिन मैं आपको सबसे सटीक जानकारी प्रदान करना चाहता हूं। क्या आप स्पष्ट कर सकते हैं कि आप क्या जानना चाह रहे हैं?",
      "आपकी बेहतर सहायता के लिए, क्या आप बता सकते हैं कि आप किस क्षेत्र में सबसे ज्यादा रुचि रखते हैं: उत्पाद, मूल्य निर्धारण, फीचर्स, या प्रतियोगियों के साथ तुलना?"
    ]
  }
};

function getRandomResponse(category, language = 'en') {
  const options = responses[category][language];
  if (typeof options === 'function') {
    return options(context.lastProduct);
  }
  return options[Math.floor(Math.random() * options.length)];
}

function matchKeywords(query, messages, language) {
  const queryLower = query.toLowerCase();
  
  analyzeContext(messages);

  // Handle greetings in the selected language
  if (queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey') || queryLower.includes('नमस्ते') || queryLower.includes('नमस्कार') || queryLower.includes('हैलो')) {
    return getRandomResponse('greeting', language);
  }

  // Product queries
  // Check for product-related keywords in English, Hindi, or a mix
  if (queryLower.includes('product') || queryLower.includes('offer') || queryLower.includes('solution') || 
      queryLower.includes('feature') || queryLower.includes('उत्पाद') || queryLower.includes('समाधान') || 
      queryLower.includes('फीचर') || queryLower.includes('विशेषता') ||
      (queryLower.includes('kya') && (queryLower.includes('product') || queryLower.includes('solutions'))) || // "kya product/solutions hain"
      (queryLower.includes('aapke') && (queryLower.includes('paas') || queryLower.includes('pass')) && (queryLower.includes('products') || queryLower.includes('solutions'))) // "आपके पास products/solutions हैं"
     ) {
    return responses.products[language](context.lastProduct);
  }

  // Pricing queries
  // Check for pricing-related keywords in English, Hindi, or a mix
  if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('pricing') ||
      queryLower.includes('कीमत') || queryLower.includes('मूल्य') || queryLower.includes('दाम') ||
      (queryLower.includes('kya') && (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('कीमत'))) || // "kya price/cost/कीमत hai"
      (queryLower.includes('kitne') && (queryLower.includes('ka') || queryLower.includes('ka hai'))) // "kitne ka hai"
     ) {
    return responses.pricing[language](context.lastProduct);
  }

  // Competitor queries
  // Check for competitor-related keywords in English, Hindi, or a mix
  if (queryLower.includes('competitor') || queryLower.includes('compare') || queryLower.includes('difference') ||
      queryLower.includes('प्रतियोगी') || queryLower.includes('तुलना') || queryLower.includes('अंतर') ||
      (queryLower.includes('compare') && (queryLower.includes('to') || queryLower.includes('se')) && (queryLower.includes('competitor') || queryLower.includes('pratiyogi'))) // "compare to/se competitor/pratiyogi"
     ) {
    // For now, we don't have competitors in the productInfo, so we won't try to find a specific one.
    const competitor = null; 
    return responses.competitors[language](competitor);
  }

  // Demo requests
  if (queryLower.includes('demo') || queryLower.includes('demonstration') || queryLower.includes('show me') ||
      queryLower.includes('डेमो') || queryLower.includes('प्रदर्शन') || queryLower.includes('दिखाएं')) {
    return getRandomResponse('demo', language);
  }

  // Follow-up based on context
  if (context.lastTopic) {
    return responses[context.lastTopic][language](context.lastProduct) + '\n\n' + getRandomResponse('followUp', language);
  }

  // Fallback response
  return getRandomResponse('fallback', language);
}

export async function processQuery(query, messages = [], preferredLanguage = null) {
  const baseDelay = 1000;
  const complexityFactor = query.length / 20;
  const randomVariation = Math.random() * 500; // Increased random variation

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, baseDelay + complexityFactor * 100 + randomVariation));

  // Determine the output language: prioritize preferredLanguage from settings,
  // otherwise use detected language from the input.
  const language = preferredLanguage || detectLanguage(query);

  // The matchKeywords function needs to handle bilingual input and provide
  // output based on the 'language' variable. This requires the internal logic
  // to be able to understand both English and Hindi and potentially translate
  // if the input language doesn't match the output language.

  return matchKeywords(query, messages, language);
}