const productInfo = {
  products: [
    {
      name: "Enterprise CRM Suite",
      description: "Complete customer relationship management solution for large businesses.",
      pricing: "Starting at $999/month",
      features: [
        "Advanced analytics dashboard",
        "Custom workflow automation",
        "Enterprise-grade security",
        "24/7 dedicated support"
      ]
    },
    {
      name: "Small Business CRM",
      description: "Streamlined CRM designed for small to medium businesses.",
      pricing: "Starting at $199/month",
      features: [
        "Contact management",
        "Sales pipeline tracking",
        "Email integration",
        "Basic reporting"
      ]
    },
    {
      name: "Sales Analytics Pro",
      description: "Advanced analytics platform for sales data optimization.",
      pricing: "Starting at $499/month",
      features: [
        "Predictive analytics",
        "Custom reporting",
        "Data visualization",
        "API access"
      ]
    },
    {
      name: "Customer Support Module",
      description: "Integrated support ticketing and resolution system.",
      pricing: "Starting at $299/month as add-on",
      features: [
        "Ticket management",
        "SLA tracking",
        "Knowledge base",
        "Customer portal"
      ]
    }
  ],
  competitors: [
    {
      name: "CompetitorX",
      comparison: "Our solution offers 30% more features with better integration capabilities",
      advantages: [
        "More comprehensive analytics",
        "Better customization options",
        "Faster implementation time"
      ]
    },
    {
      name: "CompetitorY",
      comparison: "We provide dedicated support unlike their tiered system",
      advantages: [
        "24/7 dedicated support",
        "Personalized onboarding",
        "Regular strategy reviews"
      ]
    }
  ],
  metrics: {
    uptime: "99.9%",
    customerSatisfaction: "96%",
    averageResponseTime: "< 2 hours"
  }
};

const context = {
  questionCount: 0
};

const responses = {
  greeting: [
    "Hello! I'm here to help you find the perfect solution for your business. What can I assist you with today?",
    "Welcome! I'd love to help you explore our products and services. What brings you here today?",
    "Hi there! I'm your AI sales assistant. How can I help make your business more successful?"
  ],
  products: (lastProduct) => {
    if (lastProduct) {
      const product = productInfo.products.find(p => p.name.toLowerCase().includes(lastProduct.toLowerCase()));
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
  pricing: (lastProduct) => {
    if (lastProduct) {
      const product = productInfo.products.find(p => p.name.toLowerCase().includes(lastProduct.toLowerCase()));
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
  competitors: (competitor) => {
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
  demo: [
    "I'd be happy to arrange a personalized demo! Our demos are tailored to your specific needs and typically last 30 minutes. Would you prefer a general overview or a deep dive into specific features?",
    "Great choice! Our demos show you exactly how our solutions can benefit your business. When would be a good time for you? We can also include your team members in the session.",
    "I'll help you schedule a demo with one of our product specialists. They can show you real-world examples and answer any specific questions. What's the best time for your schedule?"
  ],
  followUp: [
    "Is there anything specific you'd like to know more about?",
    "What aspects are most important for your business needs?",
    "Would you like me to elaborate on any particular features?"
  ],
  fallback: [
    "I want to make sure I understand your needs correctly. Could you rephrase that, or let me know which aspect of our solutions you'd like to explore?",
    "I apologize, but I want to provide you with the most accurate information. Could you clarify what you're looking to learn about?",
    "To better assist you, could you specify which area you're most interested in: products, pricing, features, or comparison with competitors?"
  ]
};

function getRandomResponse(category) {
  const options = responses[category];
  if (typeof options === 'function') {
    return options();
  }
  return options[Math.floor(Math.random() * options.length)];
}

function analyzeContext(messages) {
  const lastUserMessage = messages
    .filter(m => m.sender === 'user')
    .slice(-2)
    .map(m => m.content.toLowerCase());

  if (lastUserMessage.length > 0) {
    productInfo.products.forEach(product => {
      if (lastUserMessage[0].includes(product.name.toLowerCase())) {
        context.lastProduct = product.name;
      }
    });

    if (lastUserMessage[0].includes('price') || lastUserMessage[0].includes('cost')) {
      context.lastTopic = 'pricing';
    } else if (lastUserMessage[0].includes('competitor') || lastUserMessage[0].includes('compare')) {
      context.lastTopic = 'competitors';
    } else if (lastUserMessage[0].includes('product') || lastUserMessage[0].includes('feature')) {
      context.lastTopic = 'products';
    }

    context.questionCount++;
  }
}

function matchKeywords(query, messages) {
  query = query.toLowerCase();

  analyzeContext(messages);

  if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
    return getRandomResponse('greeting');
  }

  if (query.includes('product') || query.includes('offer') || query.includes('solution') || query.includes('feature')) {
    return responses.products(context.lastProduct);
  }

  if (query.includes('price') || query.includes('cost') || query.includes('pricing')) {
    return responses.pricing(context.lastProduct);
  }

  if (query.includes('competitor') || query.includes('compare') || query.includes('difference')) {
    const competitor = productInfo.competitors.find(c =>
      query.includes(c.name.toLowerCase())
    )?.name;
    return responses.competitors(competitor);
  }

  if (query.includes('demo') || query.includes('demonstration') || query.includes('show me')) {
    return getRandomResponse('demo');
  }

  if (context.lastTopic) {
    return responses[context.lastTopic](context.lastProduct) + '\n\n' + getRandomResponse('followUp');
  }

  return getRandomResponse('fallback');
}

export async function processQuery(query, messages = []) {
  const baseDelay = 1000;
  const complexityFactor = query.length / 20;
  const randomVariation = Math.random() * 500;

  await new Promise(resolve => setTimeout(resolve, baseDelay + complexityFactor * 100 + randomVariation));

  return matchKeywords(query, messages);
}
