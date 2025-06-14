const context = {
  questionCount: 0,
  lastTopic: null,
  lastDocumentIndex: null,
  lastMonthIndex: null,
  lastPersonIndex: null,
  lastSuggestions: [] // Track last suggestions for numeric input
};

async function fetchData() {
  // Mock data for testing (replace with real API when available)
  return {
    documentData: {
      documentIndices: { instructions: 0, p2pLandscape: 1, rbiCircular: 2, rbiDocument: 3 },
      documents: {
        filenames: ["Instructions.pdf", "P2P_Landscape.pdf", "RBI_Circular.pdf", "RBI_Document.pdf"],
        overviews: [
          { description: "LenDenClub connects borrowers and lenders...", descriptionHi: "लेंडेनक्लब उधारकर्ताओं और निवेशकों को जोड़ता है..." },
          { description: "P2P market insights...", descriptionHi: "P2P बाजार अंतर्दृष्टि..." },
          {},
          {}
        ],
        lendingOptions: [
          { type: "Personal Loan", description: "₹5,000-₹50,000 for 12 months", typeHi: "व्यक्तिगत लोन", descriptionHi: "₹5,000-₹50,000 12 महीनों के लिए" },
          {}
        ],
        rbiGuidelines: [
          {},
          {},
          {},
          { points: ["Guideline 1", "Guideline 2"], pointsHi: ["दिशानिर्देश 1", "दिशानिर्देश 2"] }
        ]
      }
    },
    platformData: {
      factsheetIndices: { january2025: 0 },
      factsheets: {
        months: ["January 2025"],
        monthsHi: ["जनवरी 2025"],
        loanDetails: [{ type: "Personal", count: 5000, avgTenure: "12 months", avgTenureHi: "12 महीने" }]
      }
    },
    profileData: {
      profileIndices: { bhavin: 0, dipesh: 1 },
      profiles: {
        names: ["Bhavin Patel", "Dipesh Karki"],
        namesHi: ["भाविन पटेल", "दीपेश कार्की"],
        summaries: ["Bhavin leads LenDenClub...", "Dipesh manages operations..."],
        summariesHi: ["भाविन लेंडेनक्लब का नेतृत्व करते हैं...", "दीपेश संचालन प्रबंधन करते हैं..."]
      }
    }
  };
  /*
  // Uncomment for real API
  try {
    const response = await fetch('http://localhost:3000/api/data', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { documentData: null, platformData: null, profileData: null };
  }
  */
}

function analyzeContext(messages, data) {
  const lastUserMessage = messages
    .filter(m => m.sender === 'user')
    .slice(-1)
    .map(m => m.content.toLowerCase());

  if (lastUserMessage.length > 0) {
    const lastMessageLower = lastUserMessage[0];

    // Document-related context
    if (data?.documentData?.documentIndices) {
      if (lastMessageLower.includes('instructions') || lastMessageLower.includes('lending process') || lastMessageLower.includes('registration') ||
          lastMessageLower.includes('panjikaran') || lastMessageLower.includes('register') || lastMessageLower.includes('निर्देश') || lastMessageLower.includes('उधार प्रक्रिया') || lastMessageLower.includes('पंजीकरण')) {
        context.lastDocumentIndex = data.documentData.documentIndices.instructions;
        context.lastTopic = 'lendingOptions';
      } else if (lastMessageLower.includes('p2p landscape') || lastMessageLower.includes('market') || lastMessageLower.includes('msme') ||
                 lastMessageLower.includes('bazaar') || lastMessageLower.includes('पी2पी परिदृश्य') || lastMessageLower.includes('बाजार') || lastMessageLower.includes('एमएसएमई')) {
        context.lastDocumentIndex = data.documentData.documentIndices.p2pLandscape;
        context.lastTopic = 'marketDetails';
      } else if (lastMessageLower.includes('rbi circular') || lastMessageLower.includes('lendclub compliance') ||
                 lastMessageLower.includes('आरबीआई सर्कुलर') || lastMessageLower.includes('लेंडेनक्लब अनुपालन')) {
        context.lastDocumentIndex = data.documentData.documentIndices.rbiCircular;
        context.lastTopic = 'complianceActions';
      } else if (lastMessageLower.includes('rbi document') || lastMessageLower.includes('master directions') || lastMessageLower.includes('regulations') ||
                 lastMessageLower.includes('आरबीआई दस्तावेज') || lastMessageLower.includes('मास्टर दिशानिर्देश') || lastMessageLower.includes('विनियमन')) {
        context.lastDocumentIndex = data.documentData.documentIndices.rbiDocument;
        context.lastTopic = 'rbiGuidelines';
      }
    }

    // Platform-related context
    if (data?.platformData?.factsheetIndices) {
      if (lastMessageLower.includes('december') || lastMessageLower.includes('disambar') || lastMessageLower.includes('दिसंबर')) {
        context.lastMonthIndex = data.platformData.factsheetIndices.december2024;
        context.lastTopic = 'summary';
      } else if (lastMessageLower.includes('january') || lastMessageLower.includes('janvar') || lastMessageLower.includes('जनवरी')) {
        context.lastMonthIndex = data.platformData.factsheetIndices.january2025;
        context.lastTopic = 'loanDetails';
      } else if (lastMessageLower.includes('february') || lastMessageLower.includes('farvari') || lastMessageLower.includes('फरवरी')) {
        context.lastMonthIndex = data.platformData.factsheetIndices.february2025;
        context.lastTopic = 'summary';
      }
    }

    // Profile-related context
    if (data?.profileData?.profileIndices) {
      if (lastMessageLower.includes('bhavin') || lastMessageLower.includes('patel') || lastMessageLower.includes('bhaavin') ||
          lastMessageLower.includes('भाविन') || lastMessageLower.includes('पटेल')) {
        context.lastPersonIndex = data.profileData.profileIndices.bhavin;
        context.lastTopic = 'summary';
      } else if (lastMessageLower.includes('dipesh') || lastMessageLower.includes('karki') || lastMessageLower.includes('deepesh') ||
                 lastMessageLower.includes('दीपेश') || lastMessageLower.includes('कार्की')) {
        context.lastPersonIndex = data.profileData.profileIndices.dipesh;
        context.lastTopic = 'summary';
      } else if (lastMessageLower.includes('profiles') || lastMessageLower.includes('team') || lastMessageLower.includes('प्रोफाइल') || lastMessageLower.includes('टीम')) {
        context.lastPersonIndex = null; // Allow general profile query
        context.lastTopic = 'summary';
      }
    }

    // Enhanced topic detection
    if (lastMessageLower.includes('overview') || lastMessageLower.includes('about') || lastMessageLower.includes('p2p') || lastMessageLower.includes('lendenclub') ||
        lastMessageLower.includes('baare mein') || lastMessageLower.includes('bare me') || lastMessageLower.includes('ke baare mein') || lastMessageLower.includes('scene kya hai') ||
        lastMessageLower.includes('batao') || lastMessageLower.includes('bata') || lastMessageLower.includes('platform') || lastMessageLower.includes('munch') ||
        lastMessageLower.includes('अवलोकन') || lastMessageLower.includes('के बारे में') || lastMessageLower.includes('पी2पी') || lastMessageLower.includes('लेंडेनक्लब') || lastMessageLower.includes('मंच')) {
      context.lastTopic = 'overview';
      context.lastDocumentIndex = data?.documentData?.documentIndices?.p2pLandscape || null;
    } else if (lastMessageLower.includes('lending') || lastMessageLower.includes('options') || lastMessageLower.includes('udhaar') || lastMessageLower.includes('loan') ||
               lastMessageLower.includes('rin') || lastMessageLower.includes('उधार') || lastMessageLower.includes('विकल्प') || lastMessageLower.includes('ऋण')) {
      context.lastTopic = 'lendingOptions';
      context.lastDocumentIndex = data?.documentData?.documentIndices?.instructions || null;
    } else if (lastMessageLower.includes('registration') || lastMessageLower.includes('register') || lastMessageLower.includes('panjikaran') || lastMessageLower.includes('पंजीकरण')) {
      context.lastTopic = 'lendingOptions';
      context.lastDocumentIndex = data?.documentData?.documentIndices?.instructions || null;
    } else if (lastMessageLower.includes('price') || lastMessageLower.includes('cost') || lastMessageLower.includes('pricing') ||
               lastMessageLower.includes('daam') || lastMessageLower.includes('keemat') || lastMessageLower.includes('कीमत') || lastMessageLower.includes('मूल्य')) {
      context.lastTopic = 'pricing';
    } else if (lastMessageLower.includes('competitor') || lastMessageLower.includes('compare') || lastMessageLower.includes('difference') ||
               lastMessageLower.includes('pratiyogi') || lastMessageLower.includes('tulna') || lastMessageLower.includes('प्रतियोगी') || lastMessageLower.includes('तुलना') || lastMessageLower.includes('अंतर')) {
      context.lastTopic = 'competitors';
    } else if (lastMessageLower.includes('repayment') || lastMessageLower.includes('returns') || lastMessageLower.includes('punarbhugtan') ||
               lastMessageLower.includes('पुनर्भुगतान') || lastMessageLower.includes('रिटर्न')) {
      context.lastTopic = 'repaymentDetails';
    } else if (lastMessageLower.includes('regulation') || lastMessageLower.includes('rbi') || lastMessageLower.includes('guidelines') ||
               lastMessageLower.includes('niyam') || lastMessageLower.includes('विनियमन') || lastMessageLower.includes('आरबीआई') || lastMessageLower.includes('दिशानिर्देश')) {
      context.lastTopic = 'rbiGuidelines';
      context.lastDocumentIndex = data?.documentData?.documentIndices?.rbiDocument || null;
    } else if (lastMessageLower.includes('concern') || lastMessageLower.includes('issue') || lastMessageLower.includes('chinta') ||
               lastMessageLower.includes('चिंता') || lastMessageLower.includes('मुद्दा')) {
      context.lastTopic = 'rbiConcerns';
    } else if (lastMessageLower.includes('action') || lastMessageLower.includes('compliance') || lastMessageLower.includes('karyavahi') ||
               lastMessageLower.includes('anupalan') || lastMessageLower.includes('कार्रवाई') || lastMessageLower.includes('अनुपालन')) {
      context.lastTopic = 'complianceActions';
    } else if (lastMessageLower.includes('risk') || lastMessageLower.includes('mitigation') || lastMessageLower.includes('default') || lastMessageLower.includes('npa') ||
               lastMessageLower.includes('jokhim') || lastMessageLower.includes('न्यूनीकरण') || lastMessageLower.includes('डिफ़ॉल्ट') || lastMessageLower.includes('एनपीए')) {
      context.lastTopic = 'riskMitigations';
    } else if (lastMessageLower.includes('investor') || lastMessageLower.includes('protection') || lastMessageLower.includes('niveshak') ||
               lastMessageLower.includes('suraksha') || lastMessageLower.includes('निवेशक') || lastMessageLower.includes('सुरक्षा')) {
      context.lastTopic = 'investorProtections';
    } else if (lastMessageLower.includes('market') || lastMessageLower.includes('growth') || lastMessageLower.includes('bazaar') ||
               lastMessageLower.includes('vriddhi') || lastMessageLower.includes('बाजार') || lastMessageLower.includes('वृद्धि')) {
      context.lastTopic = 'marketDetails';
    } else if (lastMessageLower.includes('metrics') || lastMessageLower.includes('stats') || lastMessageLower.includes('aankde') ||
               lastMessageLower.includes('मेट्रिक्स') || lastMessageLower.includes('आंकड़े')) {
      context.lastTopic = 'keyMetrics';
    } else if (lastMessageLower.includes('escrow') || lastMessageLower.includes('transparency') || lastMessageLower.includes('eskro') ||
               lastMessageLower.includes('paardarshita') || lastMessageLower.includes('एस्क्रो') || lastMessageLower.includes('पारदर्शिता')) {
      context.lastTopic = 'escrowMechanism';
    } else if (lastMessageLower.includes('loans') || lastMessageLower.includes('borrower') || lastMessageLower.includes('rin') ||
               lastMessageLower.includes('udhaarkarta') || lastMessageLower.includes('ऋण') || lastMessageLower.includes('उधारकर्ता')) {
      context.lastTopic = 'loanDetails';
    } else if (lastMessageLower.includes('experience') || lastMessageLower.includes('career') || lastMessageLower.includes('work') ||
               lastMessageLower.includes('anubhav') || lastMessageLower.includes('अनुभव') || lastMessageLower.includes('करियर')) {
      context.lastTopic = 'experience';
    } else if (lastMessageLower.includes('skills') || lastMessageLower.includes('expertise') || lastMessageLower.includes('kaushal') ||
               lastMessageLower.includes('कौशल') || lastMessageLower.includes('विशेषज्ञता')) {
      context.lastTopic = 'skills';
    } else if (lastMessageLower.includes('education') || lastMessageLower.includes('degree') || lastMessageLower.includes('shiksha') ||
               lastMessageLower.includes('शिक्षा') || lastMessageLower.includes('डिग्री')) {
      context.lastTopic = 'education';
    }

    context.questionCount++;
  }
}

function detectLanguage(text) {
  const hindiPattern = /[\u0900-\u097F]/;
  const hinglishTriggers = ['baare mein', 'bare me', 'batao', 'bata', 'bhai', 'scene kya hai', 'kaise', 'janvar', 'rin', 'register', 'platform', 'munch', 'ke bare me', 'ke baare mein'];
  return hindiPattern.test(text) || hinglishTriggers.some(trigger => text.toLowerCase().includes(trigger)) ? 'hi' : 'en';
}

const responses = {
  greeting: {
    en: {
      text: [
        "Hello! Ready to explore LenDenClub’s lending platform, stats, or team? What’s up?",
        "Hey! Wanna dive into LenDenClub’s operations or market insights? Let me know!",
        "Hi there! Curious about LenDenClub’s P2P lending, performance, or profiles? Ask away!"
      ],
      suggestions: {
        en: ["Platform overview", "How to register", "Loan types"],
        hi: ["मंच का अवलोकन", "पंजीकरण कैसे करें", "ऋण के प्रकार"]
      }
    },
    hi: {
      text: [
        "नमस्ते! लेंडेनक्लब के उधार मंच, आंकड़े, या टीम के बारे में जानने को तैयार? क्या बात है?",
        "हाय! लेंडेनक्लब के संचालन या बाजार अंतर्दृष्टि में गोता लगाना चाहते हैं? बताएं!",
        "नमस्कार! लेंडेनक्लब के P2P उधार, प्रदर्शन, या प्रोफाइल के बारे में उत्सुक? पूछें!"
      ],
      suggestions: {
        en: ["Platform overview", "How to register", "Loan types"],
        hi: ["मंच का अवलोकन", "पंजीकरण कैसे करें", "ऋण के प्रकार"]
      }
    }
  },
  overview: {
    en: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.overviews?.[docIndex]) {
          return `Overview from ${data.documentData.documents.filenames[docIndex]}:\n${data.documentData.documents.overviews[docIndex].description}`;
        }
        return "LenDenClub is India’s top P2P lending platform, connecting borrowers and lenders since 2015. It’s RBI-registered, with over 2 crore users and ₹16,000 crore in loans disbursed. Invest from ₹250 or take ₹5,000-₹50,000 loans, all online. Lenders earn up to 12% returns, with AI keeping risks low (~2.45% default rate).";
      },
      suggestions: {
        en: ["How to register", "Loan types", "Safety measures"],
        hi: ["पंजीकरण कैसे करें", "ऋण के प्रकार", "सुरक्षा उपाय"]
      }
    },
    hi: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.overviews?.[docIndex]) {
          return `${data.documentData.documents.filenames[docIndex]} का अवलोकन:\n${data.documentData.documents.overviews[docIndex].descriptionHi}`;
        }
        return "लेंडेनक्लब भारत का अग्रणी P2P उधार मंच है, जो 2015 से उधारकर्ताओं और निवेशकों को जोड़ता है। यह RBI-पंजीकृत है, जिसमें 2 करोड़ से अधिक उपयोगकर्ता हैं और ₹16,000 करोड़ से ज्यादा का लोन वितरित हो चुका है। ₹250 से निवेश करें या ₹5,000-₹50,000 के लोन लें, सब ऑनलाइन। निवेशकों को 12% तक रिटर्न मिलता है, और AI जोखिम कम करता है (~2.45% डिफॉल्ट रेट)।";
      },
      suggestions: {
        en: ["How to register", "Loan types", "Safety measures"],
        hi: ["पंजीकरण कैसे करें", "ऋण के प्रकार", "सुरक्षा उपाय"]
      }
    }
  },
  lendingOptions: {
    en: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.lendingOptions?.[docIndex]) {
          return `Lending options from ${data.documentData.documents.filenames[docIndex]}:\n${data.documentData.documents.lendingOptions[docIndex].map(opt => `• ${opt.type}: ${opt.description}`).join('\n\n')}`;
        }
        return "LenDenClub offers personal loans (₹5,000-₹50,000, 12 months) and MSME loans (up to ₹50 lakh, 24 months). Register via app or www.lendenclub.com with PAN/Aadhaar KYC. Lenders start with ₹250, earning up to 12% returns.";
      },
      suggestions: {
        en: ["Registration process", "Repayment details", "Risk mitigation"],
        hi: ["पंजीकरण प्रक्रिया", "पुनर्भुगतान विवरण", "जोखिम न्यूनीकरण"]
      }
    },
    hi: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.lendingOptions?.[docIndex]) {
          return `${data.documentData.documents.filenames[docIndex]} के उधार विकल्प:\n${data.documentData.documents.lendingOptions[docIndex].map(opt => `• ${opt.typeHi}: ${opt.descriptionHi}`).join('\n\n')}`;
        }
        return "लेंडेनक्लब व्यक्तिगत लोन (₹5,000-₹50,000, 12 महीने) और MSME लोन (₹50 लाख तक, 24 महीने) देता है। ऐप या www.lendenclub.com पर PAN/आधार KYC से रजिस्टर करें। निवेशक ₹250 से शुरू कर 12% तक रिटर्न कमा सकते हैं।";
      },
      suggestions: {
        en: ["Registration process", "Repayment details", "Risk mitigation"],
        hi: ["पंजीकरण प्रक्रिया", "पुनर्भुगतान विवरण", "जोखिम न्यूनीकरण"]
      }
    }
  },
  repaymentDetails: {
    en: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.repaymentDetails?.[docIndex]) {
          return `Repayment details from ${data.documentData.documents.filenames[docIndex]}:\n${data.documentData.documents.repaymentDetails[docIndex].map(rep => `• ${rep.type}: ${rep.description}`).join('\n\n')}`;
        }
        return "No repayment details available.";
      },
      suggestions: {
        en: ["Risk mitigation", "Loan types", "RBI guidelines"],
        hi: ["जोखिम न्यूनीकरण", "ऋण के प्रकार", "RBI दिशानिर्देश"]
      }
    },
    hi: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.repaymentDetails?.[docIndex]) {
          return `${data.documentData.documents.filenames[docIndex]} के पुनर्भुगतान विवरण:\n${data.documentData.documents.repaymentDetails[docIndex].map(rep => `• ${rep.typeHi}: ${rep.descriptionHi}`).join('\n\n')}`;
        }
        return "कोई पुनर्भुगतान विवरण उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Risk mitigation", "Loan types", "RBI guidelines"],
        hi: ["जोखिम न्यूनीकरण", "ऋण के प्रकार", "RBI दिशानिर्देश"]
      }
    }
  },
  rbiGuidelines: {
    en: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.rbiGuidelines?.[docIndex]) {
          return `RBI Guidelines from ${data.documentData.documents.filenames[docIndex]}:\n${data.documentData.documents.rbiGuidelines[docIndex].points.map(point => `• ${point}`).join('\n')}`;
        }
        return "No RBI guidelines available.";
      },
      suggestions: {
        en: ["RBI concerns", "Compliance actions", "Risk mitigation"],
        hi: ["RBI चिंताएँ", "अनुपालन कार्रवाइयाँ", "जोखिम न्यूनीकरण"]
      }
    },
    hi: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.rbiGuidelines?.[docIndex]) {
          return `${data.documentData.documents.filenames[docIndex]} के RBI दिशानिर्देश:\n${data.documentData.documents.rbiGuidelines[docIndex].pointsHi.map(point => `• ${point}`).join('\n')}`;
        }
        return "कोई RBI दिशानिर्देश उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["RBI concerns", "Compliance actions", "Risk mitigation"],
        hi: ["RBI चिंताएँ", "अनुपालन कार्रवाइयाँ", "जोखिम न्यूनीकरण"]
      }
    }
  },
  rbiConcerns: {
    en: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.rbiConcerns?.[docIndex]) {
          return `RBI Concerns from ${data.documentData.documents.filenames[docIndex]}:\n${data.documentData.documents.rbiConcerns[docIndex].issues.map(issue => `• ${issue}`).join('\n')}`;
        }
        return "No RBI concerns available.";
      },
      suggestions: {
        en: ["Compliance actions", "Risk mitigation", "Investor protections"],
        hi: ["अनुपालन कार्रवाइयाँ", "जोखिम न्यूनीकरण", "निवेशक सुरक्षा"]
      }
    },
    hi: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.rbiConcerns?.[docIndex]) {
          return `${data.documentData.documents.filenames[docIndex]} की RBI चिंताएँ:\n${data.documentData.documents.rbiConcerns[docIndex].issuesHi.map(issue => `• ${issue}`).join('\n')}`;
        }
        return "कोई RBI चिंताएँ उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Compliance actions", "Risk mitigation", "Investor protections"],
        hi: ["अनुपालन कार्रवाइयाँ", "जोखिम न्यूनीकरण", "निवेशक सुरक्षा"]
      }
    }
  },
  complianceActions: {
    en: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.complianceActions?.[docIndex]) {
          return `Compliance Actions from ${data.documentData.documents.filenames[docIndex]}:\n${data.documentData.documents.complianceActions[docIndex].actions.map(action => `• ${action}`).join('\n\n')}`;
        }
        return "No compliance actions available.";
      },
      suggestions: {
        en: ["RBI guidelines", "Risk mitigation", "Investor protections"],
        hi: ["RBI दिशानिर्देश", "जोखिम न्यूनीकरण", "निवेशक सुरक्षा"]
      }
    },
    hi: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.complianceActions?.[docIndex]) {
          return `${data.documentData.documents.filenames[docIndex]} की अनुपालन कार्रवाइयाँ:\n${data.documentData.documents.complianceActions[docIndex].actionsHi.map(actionHi => `• ${actionHi}`).join('\n\n')}`;
        }
        return "कोई अनुपालन कार्रवाइयाँ उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["RBI guidelines", "Risk mitigation", "Investor protections"],
        hi: ["RBI दिशानिर्देश", "जोखिम न्यूनीकरण", "निवेशक सुरक्षा"]
      }
    }
  },
  riskMitigations: {
    en: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.riskMitigations?.[docIndex]) {
          return `Risk Mitigation Measures from ${data.documentData.documents.filenames[docIndex]}:\n${data.documentData.documents.riskMitigations[docIndex].measures.map(measure => `• ${measure}`).join('\n\n')}`;
        }
        return "No risk mitigation measures available.";
      },
      suggestions: {
        en: ["Investor protections", "RBI concerns", "Loan details"],
        hi: ["निवेशक सुरक्षा", "RBI चिंताएँ", "ऋण विवरण"]
      }
    },
    hi: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.riskMitigations?.[docIndex]) {
          return `${data.documentData.documents.filenames[docIndex]} के जोखिम न्यूनीकरण उपाय:\n${data.documentData.documents.riskMitigations[docIndex].measuresHi.map(measureHi => `• ${measureHi}`).join('\n\n')}`;
        }
        return "कोई जोखिम न्यूनीकरण उपाय उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Investor protections", "RBI concerns", "Loan details"],
        hi: ["निवेशक सुरक्षा", "RBI चिंताएँ", "ऋण विवरण"]
      }
    }
  },
  investorProtections: {
    en: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.investorProtections?.[docIndex]) {
          return `Investor Protections from ${data.documentData.documents.filenames[docIndex]}:\n${data.documentData.documents.investorProtections[docIndex].map(protection => `• ${protection.level}: ${protection.description}`).join('\n')}`;
        }
        return "No investor protections available.";
      },
      suggestions: {
        en: ["Risk mitigation", "Compliance actions", "Market details"],
        hi: ["जोखिम न्यूनीकरण", "अनुपालन कार्रवाइयाँ", "बाजार विवरण"]
      }
    },
    hi: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.investorProtections?.[docIndex]) {
          return `${data.documentData.documents.filenames[docIndex]} की निवेशक सुरक्षा:\n${data.documentData.documents.investorProtections[docIndex].map(protection => `• ${protection.levelHi}: ${protection.descriptionHi}`).join('\n')}`;
        }
        return "कोई निवेशक सुरक्षा उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Risk mitigation", "Compliance actions", "Market details"],
        hi: ["जोखिम न्यूनीकरण", "अनुपालन कार्रवाइयाँ", "बाजार विवरण"]
      }
    }
  },
  marketDetails: {
    en: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.marketDetails?.[docIndex]) {
          return `Market Details from ${data.documentData.documents.filenames[docIndex]}:\n• India Market Size: ${data.documentData.documents.marketDetails[docIndex].sizeIndia}\n• China Market Size: ${data.documentData.documents.marketDetails[docIndex].sizeChina}\n• Growth CAGR: ${data.documentData.documents.marketDetails[docIndex].growthCAGR}`;
        }
        return "No market details available.";
      },
      suggestions: {
        en: ["Loan details", "Key metrics", "RBI guidelines"],
        hi: ["ऋण विवरण", "प्रमुख मेट्रिक्स", "RBI दिशानिर्देश"]
      }
    },
    hi: {
      text: (data, docIndex) => {
        if (docIndex !== null && data?.documentData?.documents?.marketDetails?.[docIndex]) {
          return `${data.documentData.documents.filenames[docIndex]} के बाजार विवरण:\n• भारत का बाजार आकार: ${data.documentData.documents.marketDetails[docIndex].sizeIndiaHi}\n• चीन का बाजार आकार: ${data.documentData.documents.marketDetails[docIndex].sizeChinaHi}\n• वृद्धि CAGR: ${data.documentData.documents.marketDetails[docIndex].growthCAGRHi}`;
        }
        return "कोई बाजार विवरण उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Loan details", "Key metrics", "RBI guidelines"],
        hi: ["ऋण विवरण", "प्रमुख मेट्रिक्स", "RBI दिशानिर्देश"]
      }
    }
  },
  summary: {
    en: {
      text: (data, monthIndex, personIndex) => {
        if (monthIndex !== null && data?.platformData?.factsheets?.summaries?.[monthIndex]) {
          return `Here's an overview of LenDenClub's ${data.platformData.factsheets.months[monthIndex]} performance:\n${data.platformData.factsheets.summaries[monthIndex]}`;
        } else if (personIndex !== null && data?.profileData?.profiles?.summaries?.[personIndex]) {
          return `Here's an overview of ${data.profileData.profiles.names[personIndex]}:\n${data.profileData.profiles.summaries[personIndex]}`;
        } else if (data?.profileData?.profiles?.summaries) {
          return `LenDenClub team profiles:\n${data.profileData.profiles.names.map((name, i) => `• ${name}: ${data.profileData.profiles.summaries[i]}`).join('\n')}`;
        }
        return "No summary available for the selected month or person.";
      },
      suggestions: {
        en: ["Key metrics", "Loan details", "Experience"],
        hi: ["प्रमुख मेट्रिक्स", "ऋण विवरण", "अनुभव"]
      }
    },
    hi: {
      text: (data, monthIndex, personIndex) => {
        if (monthIndex !== null && data?.platformData?.factsheets?.summariesHi?.[monthIndex]) {
          return `${data.platformData.factsheets.monthsHi[monthIndex]} में लेंडेनक्लब के प्रदर्शन का अवलोकन:\n${data.platformData.factsheets.summariesHi[monthIndex]}`;
        } else if (personIndex !== null && data?.profileData?.profiles?.summariesHi?.[personIndex]) {
          return `${data.profileData.profiles.namesHi[personIndex]} का अवलोकन:\n${data.profileData.profiles.summariesHi[personIndex]}`;
        } else if (data?.profileData?.profiles?.summariesHi) {
          return `लेंडेनक्लब की टीम प्रोफाइल:\n${data.profileData.profiles.namesHi.map((name, i) => `• ${name}: ${data.profileData.profiles.summariesHi[i]}`).join('\n')}`;
        }
        return "चयनित महीने या व्यक्ति के लिए कोई सारांश उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Key metrics", "Loan details", "Experience"],
        hi: ["प्रमुख मेट्रिक्स", "ऋण विवरण", "अनुभव"]
      }
    }
  },
  keyMetrics: {
    en: {
      text: (data, monthIndex) => {
        if (monthIndex !== null && data?.platformData?.factsheets?.keyMetrics?.[monthIndex]) {
          return `Key metrics for ${data.platformData.factsheets.months[monthIndex]}:\n${data.platformData.factsheets.keyMetrics[monthIndex].map(metric => `• ${metric.name}: ${metric.value}`).join('\n')}`;
        }
        return "No metrics available for the selected month.";
      },
      suggestions: {
        en: ["Loan details", "Lending performance", "Escrow mechanism"],
        hi: ["ऋण विवरण", "ऋण प्रदर्शन", "एस्क्रो मैकेनिज्म"]
      }
    },
    hi: {
      text: (data, monthIndex) => {
        if (monthIndex !== null && data?.platformData?.factsheets?.keyMetrics?.[monthIndex]) {
          return `${data.platformData.factsheets.monthsHi[monthIndex]} के लिए प्रमुख मेट्रिक्स:\n${data.platformData.factsheets.keyMetrics[monthIndex].map(metric => `• ${metric.name}: ${metric.valueHi}`).join('\n')}`;
        }
        return "चयनित महीने के लिए कोई मेट्रिक्स उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Loan details", "Lending performance", "Escrow mechanism"],
        hi: ["ऋण विवरण", "ऋण प्रदर्शन", "एस्क्रो मैकेनिज्म"]
      }
    }
  },
  lendingPerformance: {
    en: {
      text: (data, monthIndex) => {
        if (monthIndex !== null && data?.platformData?.factsheets?.lendingPerformances?.[monthIndex]) {
          return `Lending performance for ${data.platformData.factsheets.months[monthIndex]}:\n${data.platformData.factsheets.lendingPerformances[monthIndex].map(perf => `• ${perf.name}: ${perf.value}`).join('\n')}`;
        }
        return "No lending performance data available for the selected month.";
      },
      suggestions: {
        en: ["Loan details", "Key metrics", "Escrow mechanism"],
        hi: ["ऋण विवरण", "प्रमुख मेट्रिक्स", "एस्क्रो मैकेनिज्म"]
      }
    },
    hi: {
      text: (data, monthIndex) => {
        if (monthIndex !== null && data?.platformData?.factsheets?.lendingPerformances?.[monthIndex]) {
          return `${data.platformData.factsheets.monthsHi[monthIndex]} के लिए ऋण प्रदर्शन:\n${data.platformData.factsheets.lendingPerformances[monthIndex].map(perf => `• ${perf.name}: ${perf.valueHi}`).join('\n')}`;
        }
        return "चयनित महीने के लिए कोई ऋण प्रदर्शन डेटा उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Loan details", "Key metrics", "Escrow mechanism"],
        hi: ["ऋण विवरण", "प्रमुख मेट्रिक्स", "एस्क्रो मैकेनिज्म"]
      }
    }
  },
  loanDetails: {
    en: {
      text: (data, monthIndex) => {
        if (monthIndex !== null && data?.platformData?.factsheets?.loanDetails?.[monthIndex]) {
          return `Loan details for ${data.platformData.factsheets.months[monthIndex]}:\n${data.platformData.factsheets.loanDetails[monthIndex].map(loan => `• ${loan.type}: ${loan.count} loans, Avg. Tenure: ${loan.avgTenure}`).join('\n')}`;
        }
        return `No loan details available for ${data?.platformData?.factsheets?.months?.[monthIndex] || 'the selected month'}.`;
      },
      suggestions: {
        en: ["Key metrics", "Lending performance", "Borrower profiles"],
        hi: ["प्रमुख मेट्रिक्स", "ऋण प्रदर्शन", "उधारकर्ता प्रोफाइल"]
      }
    },
    hi: {
      text: (data, monthIndex) => {
        if (monthIndex !== null && data?.platformData?.factsheets?.loanDetails?.[monthIndex]) {
          return `${data.platformData.factsheets.monthsHi[monthIndex]} के लिए ऋण विवरण:\n${data.platformData.factsheets.loanDetails[monthIndex].map(loan => `• ${loan.type}: ${loan.count} ऋण, औसत अवधि: ${loan.avgTenureHi}`).join('\n')}`;
        }
        return `${data?.platformData?.factsheets?.monthsHi?.[monthIndex] || 'चयनित महीने'} के लिए कोई ऋण विवरण उपलब्ध नहीं।`;
      },
      suggestions: {
        en: ["Key metrics", "Lending performance", "Borrower profiles"],
        hi: ["प्रमुख मेट्रिक्स", "ऋण प्रदर्शन", "उधारकर्ता प्रोफाइल"]
      }
    }
  },
  escrowMechanism: {
    en: {
      text: (data, monthIndex) => {
        if (monthIndex !== null && data?.platformData?.factsheets?.escrowMechanisms?.[monthIndex]) {
          return `Escrow Mechanism for ${data.platformData.factsheets.months[monthIndex]}:\n${data.platformData.factsheets.escrowMechanisms[monthIndex]}`;
        }
        return "No escrow mechanism details available for the selected month.";
      },
      suggestions: {
        en: ["Loan details", "Key metrics", "Transparency measures"],
        hi: ["ऋण विवरण", "प्रमुख मेट्रिक्स", "पारदर्शिता उपाय"]
      }
    },
    hi: {
      text: (data, monthIndex) => {
        if (monthIndex !== null && data?.platformData?.factsheets?.escrowMechanismsHi?.[monthIndex]) {
          return `${data.platformData.factsheets.monthsHi[monthIndex]} के लिए एस्क्रो मैकेनिज्म:\n${data.platformData.factsheets.escrowMechanismsHi[monthIndex]}`;
        }
        return "चयनित महीने के लिए कोई एस्क्रो मैकेनिज्म विवरण उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Loan details", "Key metrics", "Transparency measures"],
        hi: ["ऋण विवरण", "प्रमुख मेट्रिक्स", "पारदर्शिता उपाय"]
      }
    }
  },
  experience: {
    en: {
      text: (data, personIndex) => {
        if (personIndex !== null && data?.profileData?.profiles?.experiences?.[personIndex]) {
          return `${data.profileData.profiles.names[personIndex]}'s professional experience includes:\n${data.profileData.profiles.experiences[personIndex].map(exp => `• ${exp.role} at ${exp.company} (${exp.duration}):\n  ${exp.description}`).join('\n\n')}`;
        }
        return "No experience details available for the selected person.";
      },
      suggestions: {
        en: ["Skills", "Education", "Summary"],
        hi: ["कौशल", "शिक्षा", "सारांश"]
      }
    },
    hi: {
      text: (data, personIndex) => {
        if (personIndex !== null && data?.profileData?.profiles?.experiences?.[personIndex]) {
          return `${data.profileData.profiles.namesHi[personIndex]} का पेशेवर अनुभव शामिल है:\n${data.profileData.profiles.experiences[personIndex].map(exp => `• ${exp.company} में ${exp.role} (${exp.durationHi}):\n  ${exp.description}`).join('\n\n')}`;
        }
        return "चयनित व्यक्ति के लिए कोई अनुभव विवरण उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Skills", "Education", "Summary"],
        hi: ["कौशल", "शिक्षा", "सारांश"]
      }
    }
  },
  skills: {
    en: {
      text: (data, personIndex) => {
        if (personIndex !== null && data?.profileData?.profiles?.topSkills?.[personIndex]) {
          return `${data.profileData.profiles.names[personIndex]}'s top skills are:\n${data.profileData.profiles.topSkills[personIndex].map(skill => `• ${skill}`).join('\n')}`;
        }
        return "No skills details available for the selected person.";
      },
      suggestions: {
        en: ["Experience", "Education", "Summary"],
        hi: ["अनुभव", "शिक्षा", "सारांश"]
      }
    },
    hi: {
      text: (data, personIndex) => {
        if (personIndex !== null && data?.profileData?.profiles?.topSkillsHi?.[personIndex]) {
          return `${data.profileData.profiles.namesHi[personIndex]} के शीर्ष कौशल हैं:\n${data.profileData.profiles.topSkillsHi[personIndex].map(skill => `• ${skill}`).join('\n')}`;
        }
        return "चयनित व्यक्ति के लिए कोई कौशल विवरण उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Experience", "Education", "Summary"],
        hi: ["अनुभव", "शिक्षा", "सारांश"]
      }
    }
  },
  education: {
    en: {
      text: (data, personIndex) => {
        if (personIndex !== null && data?.profileData?.profiles?.educations?.[personIndex]) {
          return `${data.profileData.profiles.names[personIndex]}'s educational background:\n${data.profileData.profiles.educations[personIndex].map(edu => `• ${edu.degree} from ${edu.institution}${edu.duration ? ` (${edu.duration})` : ''}`).join('\n')}`;
        }
        return "No educational details available for the selected person.";
      },
      suggestions: {
        en: ["Experience", "Skills", "Summary"],
        hi: ["अनुभव", "कौशल", "सारांश"]
      }
    },
    hi: {
      text: (data, personIndex) => {
        if (personIndex !== null && data?.profileData?.profiles?.educations?.[personIndex]) {
          return `${data.profileData.profiles.namesHi[personIndex]} की शैक्षिक पृष्ठभूमि:\n${data.profileData.profiles.educations[personIndex].map(edu => `• ${edu.institution} से ${edu.degreeHi}${edu.durationHi ? ` (${edu.durationHi})` : ''}`).join('\n')}`;
        }
        return "चयनित व्यक्ति के लिए कोई शिक्षा विवरण उपलब्ध नहीं।";
      },
      suggestions: {
        en: ["Experience", "Skills", "Summary"],
        hi: ["अनुभव", "कौशल", "सारांश"]
      }
    }
  },
  pricing: {
    en: {
      text: () => "Pricing info isn’t available.",
      suggestions: {
        en: ["Lending options", "Market details", "Key metrics"],
        hi: ["उधार विकल्प", "बाजार विवरण", "प्रमुख मेट्रिक्स"]
      }
    },
    hi: {
      text: () => "मूल्य निर्धारण जानकारी उपलब्ध नहीं है।",
      suggestions: {
        en: ["Lending options", "Market details", "Key metrics"],
        hi: ["उधार विकल्प", "बाजार विवरण", "प्रमुख मेट्रिक्स"]
      }
    }
  },
  competitors: {
    en: {
      text: () => "Competitor info isn’t available.",
      suggestions: {
        en: ["Market details", "Lending options", "Key metrics"],
        hi: ["बाजार विवरण", "उधार विकल्प", "प्रमुख मेट्रिक्स"]
      }
    },
    hi: {
      text: () => "प्रतियोगी जानकारी उपलब्ध नहीं है।",
      suggestions: {
        en: ["Market details", "Lending options", "Key metrics"],
        hi: ["बाजार विवरण", "उधार विकल्प", "प्रमुख मेट्रिक्स"]
      }
    }
  },
  demo: {
    en: {
      text: [
        "I’d love to set up a personalized demo! It’s 30 minutes, tailored to you. Want a general overview or a deep dive into features?",
        "Awesome! Our demos show how LenDenClub works for you. When’s a good time? Can include your team too!"
      ],
      suggestions: {
        en: ["Platform overview", "Loan types", "Registration process"],
        hi: ["मंच का अवलोकन", "ऋण के प्रकार", "पंजीकरण प्रक्रिया"]
      }
    },
    hi: {
      text: [
        "मुझे एक व्यक्तिगत डेमो सेट करने में खुशी होगी! यह 30 मिनट का है, आपके लिए तैयार। सामान्य अवलोकन चाहिए या फीचर्स में गहराई?",
        "कमाल! हमारे डेमो दिखाते हैं कि लेंडेनक्लब आपके लिए कैसे काम करता है। अच्छा समय कब है? आपकी टीम को भी शामिल कर सकते हैं!"
      ],
      suggestions: {
        en: ["Platform overview", "Loan types", "Registration process"],
        hi: ["मंच का अवलोकन", "ऋण के प्रकार", "पंजीकरण प्रक्रिया"]
      }
    }
  },
  followUp: {
    en: {
      text: (lastTopic) => lastTopic ? `More on ${lastTopic}?` : "What else you curious about? Lending, stats, or profiles?",
      suggestions: {
        en: ["Lending options", "Key metrics", "Profiles"],
        hi: ["उधार विकल्प", "प्रमुख मेट्रिक्स", "प्रोफाइल"]
      }
    },
    hi: {
      text: (lastTopic) => lastTopic ? `${lastTopic} के बारे में और?` : "और क्या जानना है? उधार, आंकड़े, या प्रोफाइल?",
      suggestions: {
        en: ["Lending options", "Key metrics", "Profiles"],
        hi: ["उधार विकल्प", "प्रमुख मेट्रिक्स", "प्रोफाइल"]
      }
    }
  },
  fallback: {
    en: {
      text: (lastTopic) => lastTopic ? `Hmm, didn’t catch that. Dig deeper into ${lastTopic}?` : "Not sure what you mean. Pick a topic like lending, regulations, or profiles!",
      suggestions: {
        en: ["Lending options", "Regulations", "Profiles"],
        hi: ["उधार विकल्प", "विनियमन", "प्रोफाइल"]
      }
    },
    hi: {
      text: (lastTopic) => lastTopic ? `हम्म, समझ नहीं आया। ${lastTopic} में और जाएं?` : "पता नहीं क्या मतलब है। उधार, विनियमन, या प्रोफाइल जैसे विषय चुनें!",
      suggestions: {
        en: ["Lending options", "Regulations", "Profiles"],
        hi: ["उधार विकल्प", "विनियमन", "प्रोफाइल"]
      }
    }
  },
  error: {
    en: {
      text: () => "Oops, something broke! Try again or ask about lending/profiles.",
      suggestions: {
        en: ["Lending options", "Profiles", "Platform overview"],
        hi: ["उधार विकल्प", "प्रोफाइल", "मंच का अवलोकन"]
      }
    },
    hi: {
      text: () => "अरे, कुछ टूट गया! फिर कोशिश करें या उधार/प्रोफाइल पूछें।",
      suggestions: {
        en: ["Lending options", "Profiles", "Platform overview"],
        hi: ["उधार विकल्प", "प्रोफाइल", "मंच का अवलोकन"]
      }
    }
  }
};

function getRandomResponse(category, language, data, docIndex = null, monthIndex = null, personIndex = null, lastTopic = '') {
  try {
    const responseObj = responses[category][language];
    let text;
    if (typeof responseObj.text === 'function') {
      if (['pricing', 'competitors', 'error'].includes(category)) {
        text = responseObj.text();
      } else if (category === 'summary') {
        text = responseObj.text(data, monthIndex, personIndex);
      } else if (['keyMetrics', 'lendingPerformance', 'loanDetails', 'escrowMechanism'].includes(category)) {
        text = responseObj.text(data, monthIndex);
      } else if (['experience', 'skills', 'education'].includes(category)) {
        text = responseObj.text(data, personIndex);
      } else if (['followUp', 'fallback'].includes(category)) {
        text = responseObj.text(lastTopic);
      } else {
        text = responseObj.text(data, docIndex);
      }
    } else {
      text = responseObj.text[Math.floor(Math.random() * responseObj.text.length)];
    }

    // Append suggestions
    const suggestions = responseObj.suggestions[language];
    context.lastSuggestions = suggestions.map((s, i) => ({
      text: s,
      topic: {
        en: ['lendingOptions', 'rbiGuidelines', 'summary'],
        hi: ['lendingOptions', 'rbiGuidelines', 'summary']
      }[language][i] || 'overview' // Default to overview if index out of range
    }));
    const suggestionText = suggestions.length ? `\n\nPick one:\n${suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : '';

    return text + suggestionText;
  } catch (error) {
    console.error(`Error in getRandomResponse (${category}, ${language}):`, error);
    return getRandomResponse('error', language, data);
  }
}

function matchKeywords(query, messages, language, data) {
  try {
    const queryLower = query.toLowerCase().trim();
    analyzeContext(messages, data);

    // Handle numeric input for suggestions
    if (/^[1-3]$/.test(query) && context.lastSuggestions.length) {
      const index = parseInt(query) - 1;
      if (context.lastSuggestions[index]) {
        const selectedTopic = context.lastSuggestions[index].topic;
        return getRandomResponse(selectedTopic, language, data, context.lastDocumentIndex, context.lastMonthIndex, context.lastPersonIndex);
      }
    }

    // Handle greetings
    if (queryLower.startsWith('salaam') || queryLower.includes('hello') || queryLower.includes('hi') || queryLower.includes('hey') ||
        queryLower.includes('namaste') || queryLower.includes('namsalaam') || queryLower.includes('नमस्ते') || queryLower.includes('नमस्कार') || queryLower.includes('हैलो')) {
      let response = getRandomResponse('greeting', language, data);
      if (queryLower.includes('lendenclub') || queryLower.includes('baare mein') || queryLower.includes('bare me') || queryLower.includes('scene kya hai') ||
          queryLower.includes('batao') || queryLower.includes('bata') || queryLower.includes('platform') || queryLower.includes('munch') ||
          queryLower.includes('लेंडेनक्लब') || queryLower.includes('के बारे में') || queryLower.includes('मंच')) {
        response = getRandomResponse('overview', language, data, context.lastDocumentIndex);
      }
      return response;
    }

    // Broad keyword matching for direct inputs
    if (queryLower.includes('regulations') || queryLower.includes('regulation') || queryLower.includes('rbi') || queryLower.includes('guidelines') ||
        queryLower.includes('विनियमन') || queryLower.includes('आरबीआई') || queryLower.includes('दिशानिर्देश')) {
      return getRandomResponse('rbiGuidelines', language, data, data?.documentData?.documentIndices?.rbiDocument || null);
    }
    if (queryLower.includes('profiles') || queryLower.includes('team') || queryLower.includes('प्रोफाइल') || queryLower.includes('टीम')) {
      return getRandomResponse('summary', language, data, null, null, null);
    }
    if (queryLower.includes('lending') || queryLower.includes('options') || queryLower.includes('udhaar') || queryLower.includes('loan') ||
        queryLower.includes('rin') || queryLower.includes('उधार') || queryLower.includes('विकल्प') || queryLower.includes('ऋण')) {
      return getRandomResponse('lendingOptions', language, data, data?.documentData?.documentIndices?.instructions || null);
    }

    // Document-related queries
    if (data?.documentData?.documentIndices) {
      let docIndex = context.lastDocumentIndex;
      if (queryLower.includes('instructions') || queryLower.includes('lending process') || queryLower.includes('registration') ||
          queryLower.includes('panjikaran') || queryLower.includes('register') || queryLower.includes('निर्देश') || queryLower.includes('उधार प्रक्रिया') || queryLower.includes('पंजीकरण')) {
        docIndex = data.documentData.documentIndices.instructions;
        return getRandomResponse('lendingOptions', language, data, docIndex);
      } else if (queryLower.includes('p2p landscape') || queryLower.includes('market') || queryLower.includes('msme') ||
                 queryLower.includes('bazaar') || queryLower.includes('पी2पी परिदृश्य') || queryLower.includes('बाजार') || queryLower.includes('एमएसएमई')) {
        docIndex = data.documentData.documentIndices.p2pLandscape;
        return getRandomResponse('marketDetails', language, data, docIndex);
      } else if (queryLower.includes('rbi circular') || queryLower.includes('lendclub compliance') ||
                 queryLower.includes('आरबीआई सर्कुलर') || queryLower.includes('लेंडेनक्लब अनुपालन')) {
        docIndex = data.documentData.documentIndices.rbiCircular;
        return getRandomResponse('complianceActions', language, data, docIndex);
      } else if (queryLower.includes('rbi document') || queryLower.includes('master directions') ||
                 queryLower.includes('आरबीआई दस्तावेज') || queryLower.includes('मास्टर दिशानिर्देश')) {
        docIndex = data.documentData.documentIndices.rbiDocument;
        return getRandomResponse('rbiGuidelines', language, data, docIndex);
      } else if (queryLower.includes('overview') || queryLower.includes('about') || queryLower.includes('p2p') || queryLower.includes('lendenclub') ||
                 queryLower.includes('baare mein') || queryLower.includes('bare me') || queryLower.includes('scene kya hai') || queryLower.includes('batao') ||
                 queryLower.includes('bata') || queryLower.includes('platform') || queryLower.includes('munch') || queryLower.includes('bhai') ||
                 queryLower.includes('अवलोकन') || queryLower.includes('के बारे में') || queryLower.includes('पी2पी') || queryLower.includes('लेंडेनक्लब') || queryLower.includes('मंच')) {
        docIndex = data.documentData.documentIndices.p2pLandscape;
        return getRandomResponse('overview', language, data, docIndex);
      } else if (queryLower.includes('repayment') || queryLower.includes('returns') || queryLower.includes('punarbhugtan') ||
                 queryLower.includes('पुनर्भुगतान') || queryLower.includes('रिटर्न')) {
        return getRandomResponse('repaymentDetails', language, data, docIndex);
      } else if (queryLower.includes('concern') || queryLower.includes('issue') || queryLower.includes('chinta') ||
                 queryLower.includes('चिंता') || queryLower.includes('मुद्दा')) {
        return getRandomResponse('rbiConcerns', language, data, docIndex);
      } else if (queryLower.includes('action') || queryLower.includes('compliance') || queryLower.includes('karyavahi') ||
                 queryLower.includes('anupalan') || queryLower.includes('कार्रवाई') || queryLower.includes('अनुपालन')) {
        return getRandomResponse('complianceActions', language, data, docIndex);
      } else if (queryLower.includes('risk') || queryLower.includes('mitigation') || queryLower.includes('default') || queryLower.includes('npa') ||
                 queryLower.includes('jokhim') || queryLower.includes('न्यूनीकरण') || queryLower.includes('डिफ़ॉल्ट') || queryLower.includes('एनपीए')) {
        return getRandomResponse('riskMitigations', language, data, docIndex);
      } else if (queryLower.includes('investor') || queryLower.includes('protection') || queryLower.includes('niveshak') ||
                 queryLower.includes('suraksha') || queryLower.includes('निवेशक') || queryLower.includes('सुरक्षा')) {
        return getRandomResponse('investorProtections', language, data, docIndex);
      } else if (queryLower.includes('market') || queryLower.includes('growth') || queryLower.includes('bazaar') ||
                 queryLower.includes('vriddhi') || queryLower.includes('बाजार') || queryLower.includes('वृद्धि')) {
        return getRandomResponse('marketDetails', language, data, docIndex);
      }
    }

    // Platform-related queries
    if (data?.platformData?.factsheetIndices) {
      let monthIndex = context.lastMonthIndex;
      if (queryLower.includes('december') || queryLower.includes('disambar') || queryLower.includes('दिसंबर')) {
        monthIndex = data.platformData.factsheetIndices.december2024;
      } else if (queryLower.includes('january') || queryLower.includes('janvar') || queryLower.includes('जनवरी')) {
        monthIndex = data.platformData.factsheetIndices.january2025;
      } else if (queryLower.includes('february') || queryLower.includes('farvari') || queryLower.includes('फरवरी')) {
        monthIndex = data.platformData.factsheetIndices.february2025;
      }

      if (monthIndex !== null) {
        if (queryLower.includes('summary') || queryLower.includes('overview') || queryLower.includes('saaransh') ||
            queryLower.includes('salaaransh') || queryLower.includes('अवलोकन') || queryLower.includes('सारांश')) {
          return getRandomResponse('summary', language, data, null, monthIndex);
        } else if (queryLower.includes('metrics') || queryLower.includes('stats') || queryLower.includes('aankde') ||
                   queryLower.includes('मेट्रिक्स') || queryLower.includes('आंकड़े')) {
          return getRandomResponse('keyMetrics', language, data, null, monthIndex);
        } else if (queryLower.includes('performance') || queryLower.includes('lending') || queryLower.includes('pradarsh') ||
                   queryLower.includes('udhaar') || queryLower.includes('प्रदर्शन') || queryLower.includes('उधार')) {
          return getRandomResponse('lendingPerformance', language, data, null, monthIndex);
        } else if (queryLower.includes('escrow') || queryLower.includes('transparency') || queryLower.includes('eskro') ||
                   queryLower.includes('paardarshita') || queryLower.includes('एस्क्रो') || queryLower.includes('पारदर्शिता')) {
          return getRandomResponse('escrowMechanism', language, data, null, monthIndex);
        } else if (queryLower.includes('loans') || queryLower.includes('borrower') || queryLower.includes('rin') ||
                   queryLower.includes('udhaarkarta') || queryLower.includes('ऋण') || queryLower.includes('उधारकर्ता')) {
          return getRandomResponse('loanDetails', language, data, null, monthIndex);
        }
      }
    }

    // Profile-related queries
    if (data?.profileData?.profileIndices) {
      let personIndex = context.lastPersonIndex;
      if (queryLower.includes('bhavin') || queryLower.includes('patel') || queryLower.includes('bhaavin') ||
          queryLower.includes('भाविन') || queryLower.includes('पटेल')) {
        personIndex = data.profileData.profileIndices.bhavin;
      } else if (queryLower.includes('dipesh') || queryLower.includes('karki') || queryLower.includes('deepesh') ||
                 queryLower.includes('दीपेश') || queryLower.includes('कार्की')) {
        personIndex = data.profileData.profileIndices.dipesh;
      }

      if (personIndex !== null) {
        if (queryLower.includes('summary') || queryLower.includes('about') || queryLower.includes('overview') ||
            queryLower.includes('baare') || queryLower.includes('salaam') || queryLower.includes('सारांश') ||
            queryLower.includes('के बारे में') || queryLower.includes('अवलोकन')) {
          return getRandomResponse('summary', language, data, null, null, personIndex);
        } else if (queryLower.includes('experience') || queryLower.includes('career') || queryLower.includes('work') ||
                   queryLower.includes('anubhav') || queryLower.includes('अनुभव') || queryLower.includes('करियर')) {
          return getRandomResponse('experience', language, data, null, null, personIndex);
        } else if (queryLower.includes('skills') || queryLower.includes('expertise') || queryLower.includes('kaushal') ||
                   queryLower.includes('कौशल') || queryLower.includes('विशेषज्ञता')) {
          return getRandomResponse('skills', language, data, null, null, personIndex);
        } else if (queryLower.includes('education') || queryLower.includes('degree') || queryLower.includes('shiksha') ||
                   queryLower.includes('शिक्षा') || queryLower.includes('डिग्री')) {
          return getRandomResponse('education', language, data, null, null, personIndex);
        }
      }
    }

    // Pricing and competitor queries
    if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('pricing') ||
        queryLower.includes('daam') || queryLower.includes('keemat') || queryLower.includes('कीमत') || queryLower.includes('मूल्य')) {
      return getRandomResponse('pricing', language, data);
    }
    if (queryLower.includes('competitor') || queryLower.includes('compare') || queryLower.includes('difference') ||
        queryLower.includes('pratiyogi') || queryLower.includes('tulna') || queryLower.includes('प्रतियोगी') || queryLower.includes('तुलना') || queryLower.includes('अंतर')) {
      return getRandomResponse('competitors', language, data);
    }

    // Demo requests
    if (queryLower.includes('demo') || queryLower.includes('demonstration') || queryLower.includes('show me') ||
        queryLower.includes('dikhao') || queryLower.includes('डेमो') || queryLower.includes('प्रदर्शन') || queryLower.includes('दिखाएं')) {
      return getRandomResponse('demo', language, data);
    }

    // Fallback
    return getRandomResponse('fallback', language, data, null, null, null, context.lastTopic);
  } catch (error) {
    console.error('Error in matchKeywords:', error);
    return getRandomResponse('error', language, data);
  }
}

export async function processQuery(query, messages = [], preferredLanguage = null) {
  try {
    const baseDelay = 1000;
    const complexityFactor = query.length / 20;
    const randomVariation = Math.random() * 500;

    await new Promise(resolve => setTimeout(resolve, baseDelay + complexityFactor * 100 + randomVariation));

    const data = await fetchData();
    const language = preferredLanguage || detectLanguage(query);
    return matchKeywords(query, messages, language, data);
  } catch (error) {
    console.error('Error in processQuery:', error);
    const language = preferredLanguage || detectLanguage(query);
    return getRandomResponse('error', language, {});
  }
}