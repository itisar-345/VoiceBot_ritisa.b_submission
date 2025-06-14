import random
import time
import re
import asyncio

document_data = {
    "documents": {
        "filenames": [
            "Instructions.pdf",
            "P2P-Landscape-in-India-Final-Jan22.pdf",
            "PPT to explain RBI Circular.pdf",
            "RBI Document.pdf"
        ],
        "lastUpdated": [
            "February 2025",
            "January 2022",
            "August 2024",
            "February 27, 2025"
        ],
        "overviews": [
            {
                "description": "India's largest P2P Lending platform with over 2 Crore users and 16,000 Crore worth of disbursed loans since 2015. An RBI registered NBFC-P2P.",
                "descriptionHi": "भारत का सबसे बड़ा P2P उधार मंच, जिसके 2 करोड़ से अधिक उपयोगकर्ता हैं और 2015 से अब तक 16,000 करोड़ रुपये के वितरित ऋण हैं। एक RBI पंजीकृत NBFC-P2P।"
            },
            {
                "description": "India's Peer-to-Peer (P2P) lending market, operational since 2014, regulated by RBI as NBFC-P2P since 2017, is projected to reach USD 10.5 billion by 2026 with a CAGR of 21.6%. It serves as an alternative for MSMEs, filling the gap left by traditional banks which disburse only 5% of loans to MSMEs.",
                "descriptionHi": "भारत का पीयर-टू-पीयर (P2P) उधार बाजार, जो 2014 से संचालित है, 2017 से RBI द्वारा NBFC-P2P के रूप में विनियमित है, 2026 तक 10.5 बिलियन USD तक पहुंचने का अनुमान है, जिसमें 21.6% की CAGR होगी। यह MSMEs के लिए एक विकल्प के रूप में कार्य करता है, जो पारंपरिक बैंकों द्वारा केवल 5% ऋण वितरण के अंतर को भरता है।"
            },
            {
                "description": "LenDenClub, India's largest P2P lending platform by Innofin Solutions, facilitates lending for micro-businesses and individuals. Regulated by RBI as NBFC-P2P since 2017, it has disbursed ₹14,594 crore with 1.5 crore registered users. The platform aligns with RBI's vision to protect lenders and borrowers through transparent operations and compliance.",
                "descriptionHi": "लेंडेनक्लब, इनोफिन सॉल्यूशंस द्वारा भारत का सबसे बड़ा P2P उधार मंच, सूक्ष्म-व्यवसायों और व्यक्तियों के लिए उधार की सुविधा प्रदान करता है। 2017 से RBI द्वारा NBFC-P2P के रूप में विनियमित, इसने ₹14,594 करोड़ वितरित किए हैं और 1.5 करोड़ पंजीकृत उपयोगकर्ता हैं। यह मंच पारदर्शी संचालन और अनुपालन के माध्यम से उधारदाताओं और उधारकर्ताओं की सुरक्षा के लिए RBI के दृष्टिकोण के साथ संरेखित है।"
            },
            {
                "description": "The Reserve Bank of India (RBI) issued Master Directions for Non-Banking Financial Company - Peer to Peer Lending Platforms (NBFC-P2P) in 2017, updated through February 2025. These directions regulate NBFC-P2Ps, ensuring compliance with registration, operational, and prudential norms to protect lenders and borrowers while maintaining financial stability.",
                "descriptionHi": "भारतीय रिज़र्व बैंक (RBI) ने 2017 में नॉन-बैंकिंग फाइनेंशियल कंपनी - पीयर टू पीयर लेंडिंग प्लेटफॉर्म (NBFC-P2P) के लिए मास्टर दिशानिर्देश जारी किए, जो फरवरी 2025 तक अपडेट किए गए हैं। ये दिशानिर्देश NBFC-P2Ps को विनियमित करते हैं, पंजीकरण, संचालन और प्रूडेंशियल मानदंडों के अनुपालन को सुनिश्चित करते हुए उधारदाताओं और उधारकर्ताओं की सुरक्षा और वित्तीय स्थिरता बनाए रखते हैं।"
            }
        ],
        "companyDetails": [
            {
                "name": "LenDenClub",
                "nameHi": "लेंडेनक्लब",
                "location": "Mumbai, Maharashtra, India",
                "locationHi": "मुंबई, महाराष्ट्र, भारत",
                "website": "LenDenClub",
                "founded": "2015"
            },
            None,
            {
                "name": "LenDenClub",
                "nameHi": "लेंडेनक्लब",
                "location": None,
                "locationHi": None,
                "website": None,
                "founded": "2015"
            },
            None
        ],
        "callObjectives": [
            {
                "target": "Retail lenders registered on the LenDenClub platform",
                "targetHi": "लेंडेनक्लब मंच पर पंजीकृत खुदरा उधारदाता",
                "purpose": "Engage users who have signed up and guide them through the lending process.",
                "purposeHi": "पंजीकृत उपयोगकर्ताओं को संलग्न करना और उन्हें उधार प्रक्रिया के माध्यम से मार्गदर्शन करना।"
            },
            None,
            None,
            None
        ],
        "keyMetrics": [
            {
                "users": "Over 2 Crore",
                "usersHi": "2 करोड़ से अधिक",
                "loansDisbursed": "16,000 Crore",
                "loansDisbursedHi": "16,000 करोड़",
                "defaultRate": "3-3.5%",
                "defaultRateHi": "3-3.5%",
                "npa": "3.78% as of December 2024",
                "npaHi": "दिसंबर 2024 तक 3.78%"
            },
            None,
            {
                "users": "1.5 Crore",
                "usersHi": "1.5 करोड़",
                "loansDisbursed": "₹14,594 Crore",
                "loansDisbursedHi": "₹14,594 करोड़",
                "defaultRate": None,
                "defaultRateHi": None,
                "npa": None,
                "npaHi": None
            },
            None
        ],
        "marketDetails": [
            None,
            {
                "sizeIndia": "USD 4 billion (projected by 2026)",
                "sizeIndiaHi": "4 बिलियन USD (2026 तक अनुमानित)",
                "sizeChina": "USD 100 billion (current)",
                "sizeChinaHi": "100 बिलियन USD (वर्तमान)",
                "growthCAGR": "21.6% (2021-2026)",
                "growthCAGRHi": "21.6% (2021-2026)"
            },
            None,
            None
        ],
        "lendingOptions": [
            [
                {
                    "type": "Manual Lending",
                    "typeHi": "मैनुअल उधार",
                    "description": "Manually select borrowers based on 600+ parameter assessment. Minimum lending amount: ₹250, Minimum tenure: 2 months.",
                    "descriptionHi": "600+ पैरामीटर मूल्यांकन के आधार पर उधारकर्ताओं का चयन करें। न्यूनतम उधार राशि: ₹250, न्यूनतम अवधि: 2 महीने।"
                },
                {
                    "type": "Lumpsum Lending",
                    "typeHi": "लम्पसम उधार",
                    "description": "Bulk lending to multiple borrowers. Minimum lending amount: ₹25,000, Minimum tenure: 5 months.",
                    "descriptionHi": "एक साथ कई उधारकर्ताओं को थोक उधार। न्यूनतम उधार राशि: ₹25,000, न्यूनतम अवधि: 5 महीने।"
                }
            ],
            None,
            None,
            None
        ],
        "repaymentDetails": [
            [
                {
                    "type": "Monthly Repayment",
                    "typeHi": "मासिक पुनर्भुगतान",
                    "description": "Borrowers repay on the 1st of every month, with principal and interest transferred to the lender's bank account.",
                    "descriptionHi": "उधारकर्ता हर महीने की 1 तारीख को पुनर्भुगतान करते हैं, मूलधन और ब्याज उधारदाता के बैंक खाते में स्थानांतरित किए जाते हैं।"
                },
                {
                    "type": "Daily Repayment",
                    "typeHi": "दैनिक पुनर्भुगतान",
                    "description": "For merchant loans, repayments are credited daily to the lender's bank account starting from loan disbursement.",
                    "descriptionHi": "व्यापारी ऋणों के लिए, ऋण वितरण से शुरू होने वाले पुनर्भुगतान दैनिक रूप से उधारदाता के बैंक खाते में जमा किए जाते हैं।"
                }
            ],
            None,
            None,
            None
        ],
        "regulations": [
            None,
            {
                "eligibility": "Must be a registered company in India with a net owned fund of at least INR 2 crores. Existing NBFCs cannot operate as NBFC-P2P.",
                "eligibilityHi": "भारत में पंजीकृत कंपनी होनी चाहिए, जिसमें कम से कम 2 करोड़ रुपये की शुद्ध स्वामित्व निधि हो। मौजूदा NBFCs NBFC-P2P के रूप में संचालित नहीं हो सकते।",
                "requirements": [
                    "Membership in all 4 Credit Information Companies (CIBIL, Equifax, Experian, CRIF High Mark).",
                    "Quarterly reporting to RBI on loans disbursed, closed, outstanding, and complaints.",
                    "No cash transactions; all fund transfers via bank accounts.",
                    "Loan maturity not exceeding 36 months.",
                    "Lender investment cap of INR 50 lakhs across platforms and INR 50,000 per borrower.",
                    "Borrower loan cap of INR 10 lakhs."
                ],
                "requirementsHi": [
                    "सभी 4 क्रेडिट सूचना कंपनियों (CIBIL, Equifax, Experian, CRIF High Mark) में सदस्यता।",
                    "RBI को त्रैमासिक रिपोर्टिंग, जिसमें वितरित, बंद, बकाया ऋण और शिकायतें शामिल हों।",
                    "कोई नकद लेनदेन नहीं; सभी फंड ट्रांसफर बैंक खातों के माध्यम से।",
                    "ऋण की परिपक्वता 36 महीने से अधिक नहीं।",
                    "उधारदाता का निवेश सीमा सभी मंचों पर 50 लाख रुपये और प्रति उधारकर्ता 50,000 रुपये।",
                    "उधारकर्ता की ऋण सीमा 10 लाख रुपये।"
                ]
            },
            None,
            None
        ],
        "operatingModels": [
            None,
            [
                {
                    "type": "Direct Disbursal",
                    "typeHi": "प्रत्यक्ष वितरण",
                    "description": "Platform matches lenders and borrowers, collects a one-time fee from lenders and commission from borrowers.",
                    "descriptionHi": "मंच उधारदाताओं और उधारकर्ताओं का मिलान करता है, उधारदाताओं से एकमुश्त शुल्क और उधारकर्ताओं से कमीशन लेता है।"
                },
                {
                    "type": "Partner Disbursal",
                    "typeHi": "साझेदार वितरण",
                    "description": "Involves partners for rural outreach, with higher interest rates (15-24%) and platform margins of 2.5-3.5%.",
                    "descriptionHi": "ग्रामीण पहुंच के लिए साझेदारों को शामिल करता है, जिसमें उच्च ब्याज दरें (15-24%) और 2.5-3.5% का मंच मार्जिन होता है।"
                }
            ],
            None,
            None
        ],
        "investorProtections": [
            None,
            [
                {
                    "level": "Good",
                    "description": "Provides legal assistance only.",
                    "descriptionHi": "केवल कानूनी सहायता प्रदान करता है।"
                },
                {
                    "level": "Better",
                    "description": "Provides legal assistance and aid from debt collection agency.",
                    "descriptionHi": "कानूनी सहायता और ऋण वसूली एजेंसी से सहायता प्रदान करता है।"
                },
                {
                    "level": "Best",
                    "description": "Asks for securities like post-dated cheques, insurance, or loan buybacks.",
                    "descriptionHi": "पोस्ट-डेटेड चेक, बीमा, या ऋण खरीद-वापसी जैसे प्रतिभूतियों की मांग करता है।"
                }
            ],
            None,
            None
        ],
        "rbiTimelines": [
            None,
            None,
            {
                "keyDates": [
                    {"date": "April 2016", "event": "RBI issued consultation paper on P2P lending.", "eventHi": "RBI ने P2P उधार पर परामर्श पत्र जारी किया।"},
                    {"date": "October 2017", "event": "RBI launched P2P lending industry with Master Guidelines.", "eventHi": "RBI ने मास्टर दिशानिर्देशों के साथ P2P उधार उद्योग शुरू किया।"},
                    {"date": "Dec 2022", "event": "RBI's first deep sector review planned.", "eventHi": "RBI ने क्षेत्र की गहन समीक्षा की योजना बनाई।"},
                    {"date": "June 2023", "event": "RBI audits began at platforms, starting in Mumbai.", "eventHi": "RBI ने मुंबई से शुरू होकर मंचों पर ऑडिट शुरू किया।"},
                    {"date": "16 August 2024", "event": "RBI modified Master Guidelines with clarifications.", "eventHi": "RBI ने स्पष्टीकरण के साथ मास्टर दिशानिर्देशों में संशोधन किया।"}
                ]
            },
            {
                "keyDates": [
                    {"date": "October 04, 2017", "event": "RBI issued Master Directions for NBFC-P2P.", "eventHi": "RBI ने NBFC-P2P के लिए मास्टर दिशानिर्देश जारी किए।"},
                    {"date": "February 23, 2018", "event": "First update to Master Directions.", "eventHi": "मास्टर दिशानिर्देशों में पहला अपडेट।"},
                    {"date": "December 23, 2019", "event": "Further updates to operational guidelines.", "eventHi": "संचालन दिशानिर्देशों में और अपडेट।"},
                    {"date": "October 22, 2021", "event": "Introduction of Scale-Based Regulation framework.", "eventHi": "स्केल-आधारित विनियमन ढांचे की शुरुआत।"},
                    {"date": "August 16, 2024", "event": "Revised escrow account T+1 fund transfer rule.", "eventHi": "एस्क्रो खाते के T+1 फंड ट्रांसफर नियम में संशोधन।"},
                    {"date": "February 27, 2025", "event": "Latest update to Master Directions.", "eventHi": "मास्टर दिशानिर्देशों में नवीनतम अपडेट।"}
                ]
            }
        ],
        "rbiConcerns": [
            None,
            None,
            {
                "issues": [
                    "Money held in escrow accounts of lenders.",
                    "Credit enhancement practices (e.g., 120, 115, 108).",
                    "Secondary sales involving short-term products and long-term loans.",
                    "Platforms operating like banks with liquid plans."
                ],
                "issuesHi": [
                    "उधारदाताओं के एस्क्रो खातों में धन जमा होना।",
                    "क्रेडिट संवर्धन प्रथाएं (उदाहरण के लिए, 120, 115, 108)।",
                    "अल्पकालिक उत्पादों और दीर्घकालिक ऋणों से संबंधित द्वितीयक बिक्री।",
                    "लिक्विड योजनाओं के साथ बैंक की तरह संचालित होने वाले मंच।"
                ]
            },
            {
                "issues": [
                    "Ensuring no credit enhancement or guarantees by platforms.",
                    "Preventing platforms from holding funds on their balance sheets.",
                    "Compliance with escrow account T+1 fund transfer rules.",
                    "Restricting cross-selling and international fund flows."
                ],
                "issuesHi": [
                    "प्लेटफॉर्म द्वारा कोई क्रेडिट संवर्धन या गारंटी न होना।",
                    "प्लेटफॉर्म को अपने बैलेंस शीट पर फंड रखने से रोकना।",
                    "एस्क्रो खाते के T+1 फंड ट्रांसफर नियमों का अनुपालन।",
                    "क्रॉस-सेलिंग और अंतरराष्ट्रीय फंड प्रवाह पर प्रतिबंध।"
                ]
            }
        ],
        "complianceActions": [
            None,
            None,
            {
                "actions": [
                    "Stopped 9 partnership businesses within 7 days, reducing AUM from ₹2000 crore to ₹800 crore.",
                    "Eliminated BNPL portfolio from 80% to zero in 6 months.",
                    "Enhanced KYC processes for lenders and borrowers.",
                    "Introduced transparency and disclosures at various stages."
                ],
                "actionsHi": [
                    "7 दिनों के भीतर 9 साझेदारी व्यवसाय बंद किए, जिससे AUM ₹2000 करोड़ से घटकर ₹800 करोड़ हो गया।",
                    "6 महीनों में BNPL पोर्टफोलियो को 80% से शून्य तक समाप्त किया।",
                    "उधारदाताओं और उधारकर्ताओं के लिए KYC प्रक्रियाओं में सुधार किया।",
                    "विभिन्न चरणों में पारदर्शिता और प्रकटीकरण शुरू किए।"
                ]
            },
            {
                "actions": [
                    "Mandatory registration with RBI and minimum net owned fund of ₹2 crore.",
                    "Implementation of board-approved policies for participant eligibility and loan matching.",
                    "Adoption of robust IT systems and data security measures.",
                    "Compliance with Fair Practices Code and grievance redressal mechanisms."
                ],
                "actionsHi": [
                    "RBI के साथ अनिवार्य पंजीकरण और न्यूनतम नेट ओन्ड फंड ₹2 करोड़।",
                    "प्रतिभागी पात्रता और ऋण मिलान के लिए बोर्ड-अनुमोदित नीतियों का कार्यान्वयन।",
                    "मजबूत IT सिस्टम और डेटा सुरक्षा उपायों को अपनाना।",
                    "निष्पक्ष व्यवहार कोड और शिकायत निवारण तंत्र का अनुपालन।"
                ]
            }
        ],
        "rbiGuidelines": [
            None,
            None,
            {
                "points": [
                    "No credit enhancement by platforms.",
                    "No outsourcing of key functions.",
                    "Cross-selling not allowed.",
                    "Lending cap of ₹50 lakh.",
                    "Board-approved matching policies.",
                    "Increased disclosures about borrowers to lenders.",
                    "Risk acknowledgment for lenders.",
                    "Display of licensed entity identity.",
                    "Transparent pricing and fee disclosure.",
                    "Escrow mechanism with EMIs to lenders' accounts within T+1 day."
                ],
                "pointsHi": [
                    "मंचों द्वारा कोई क्रेडिट संवर्धन नहीं।",
                    "मुख्य कार्यों का आउटसोर्सिंग नहीं।",
                    "क्रॉस-सेलिंग की अनुमति नहीं।",
                    "₹50 लाख की उधार सीमा।",
                    "बोर्ड-अनुमोदित मिलान नीतियाँ।",
                    "उधारकर्ताओं के बारे में उधारदाताओं को अधिक प्रकटीकरण।",
                    "उधारदाताओं के लिए जोखिम स्वीकृति।",
                    "लाइसेंस प्राप्त इकाई की पहचान का प्रदर्शन।",
                    "पारदर्शी मूल्य निर्धारण और शुल्क प्रकटीकरण।",
                    "T+1 दिन के भीतर उधारदाताओं के खातों में EMI के साथ एस्क्रो तंत्र।"
                ]
            },
            {
                "points": [
                    "NBFC-P2Ps to act only as intermediaries, not lenders.",
                    "No credit enhancement or secured lending permitted.",
                    "Lending cap of ₹50 lakh per lender across all P2P platforms.",
                    "Escrow accounts for fund transfers with T+1 settlement.",
                    "Mandatory disclosure of borrower details and credit scores to lenders.",
                    "Compliance with IT governance and data localization requirements."
                ],
                "pointsHi": [
                    "NBFC-P2Ps केवल मध्यस्थ के रूप में कार्य करें, उधारदाता नहीं।",
                    "कोई क्रेडिट संवर्धन या सुरक्षित उधार की अनुमति नहीं।",
                    "सभी P2P प्लेटफॉर्मों पर प्रति उधारदाता ₹50 लाख की उधार सीमा।",
                    "T+1 निपटान के साथ फंड ट्रांसफर के लिए एस्क्रो खाते।",
                    "उधारदाताओं को उधारकर्ता विवरण और क्रेडिट स्कोर का अनिवार्य प्रकटीकरण।",
                    "IT गवर्नेंस और डेटा स्थानीयकरण आवश्यकताओं का अनुपालन।"
                ]
            }
        ],
        "riskMitigations": [
            {
                "measures": [
                    "Recommending diversification across at least 100 borrowers.",
                    "Maintaining a historical default rate of 3-3.5%, with a platform NPA of 3.78%.",
                    "Employing an in-house collection team and tie-ups with top collection agencies."
                ],
                "measuresHi": [
                    "कम से कम 100 उधारकर्ताओं में विविधीकरण की सिफारिश करना।",
                    "3-3.5% की ऐतिहासिक डिफ़ॉल्ट दर बनाए रखना, जिसमें मंच का एनपीए 3.78% है।",
                    "इन-हाउस संग्रह टीम और शीर्ष संग्रह एजेंसियों के साथ गठजोड़।"
                ]
            },
            {
                "measures": [
                    "Poor business model execution leading to bankruptcy.",
                    "Misappropriation of funds without a trust account.",
                    "Data privacy breaches leading to data leakage.",
                    "AML/KYC violations enabling money laundering.",
                    "Inadequate recovery and resolution processes risking lender funds.",
                    "Weak IT framework causing errors or RBI guideline breaches.",
                    "Cybersecurity lapses exposing confidential data."
                ],
                "measuresHi": [
                    "खराब व्यवसाय मॉडल निष्पादन जिससे दिवालियापन हो सकता है।",
                    "ट्रस्ट खाते के अभाव में धन का दुरुपयोग।",
                    "डेटा गोपनीयता उल्लंघन से डेटा रिसाव।",
                    "AML/KYC उल्लंघन से मनी लॉन्ड्रिंग की संभावना।",
                    "अपर्याप्त वसूली और समाधान प्रक्रियाएं जो उधारदाता के धन को जोखिम में डालती हैं।",
                    "कमजोर IT ढांचा जिससे त्रुटियां या RBI दिशानिर्देशों का उल्लंघन हो सकता है।",
                    "साइबर सुरक्षा में कमी से गोपनीय डेटा उजागर हो सकता है।"
                ]
            },
            {
                "measures": [
                    "Micro-loans with short tenures.",
                    "Stringent evaluation of borrowers using 600+ data points, rejecting 95% of applicants.",
                    "Hyper-diversification across thousands of borrowers.",
                    "Diversification across retail loan products like merchant loans and personal loans."
                ],
                "measuresHi": [
                    "अल्पकालिक सूक्ष्म-ऋण।",
                    "600+ डेटा बिंदुओं का उपयोग करके उधारकर्ताओं का कठोर मूल्यांकन, 95% आवेदकों को अस्वीकार करना।",
                    "हजारों उधारकर्ताओं में हाइपर-विविधीकरण।",
                    "मर्चेंट लोन और व्यक्तिगत ऋण जैसे खुदरा ऋण उत्पादों में विविधीकरण।"
                ]
            },
            {
                "measures": [
                    "Caps on lender exposure (₹50 lakh) and borrower loans (₹10 lakh).",
                    "Mandatory credit assessment and risk profiling of borrowers.",
                    "Leverage ratio not exceeding 2 for NBFC-P2Ps.",
                    "Board-approved risk management committee to evaluate risks."
                ],
                "measuresHi": [
                    "उधारदाता जोखिम (₹50 लाख) और उधारकर्ता ऋण (₹10 लाख) पर सीमा।",
                    "उधारकर्ताओं का अनिवार्य क्रेडिट मूल्यांकन और जोखिम प्रोफाइलिंग।",
                    "NBFC-P2Ps के लिए लीवरेज अनुपात 2 से अधिक नहीं।",
                    "जोखिमों का मूल्यांकन करने के लिए बोर्ड-अनुमोदित जोखिम प्रबंधन समिति।"
                ]
            }
        ]
    },
    "documentIndices": {
        "instructions": 0,
        "p2pLandscape": 1,
        "rbiCircular": 2,
        "rbiDocument": 3
    }
}

context = {
    "questionCount": 0,
    "lastTopic": None,
    "lastDocumentIndex": None
}

def analyze_context(messages):
    last_user_message = [m['content'].lower() for m in messages if m['sender'] == 'user'][-1:]

    if last_user_message:
        query = last_user_message[0]
        # Determine which document is being queried
        if any(keyword in query for keyword in ['instructions', 'lending process', 'registration', 'निर्देश', 'उधार प्रक्रिया', 'पंजीकरण']):
            context['lastDocumentIndex'] = document_data['documentIndices']['instructions']
        elif any(keyword in query for keyword in ['p2p landscape', 'market', 'msme', 'पी2पी परिदृश्य', 'बाजार', 'एमएसएमई']):
            context['lastDocumentIndex'] = document_data['documentIndices']['p2pLandscape']
        elif any(keyword in query for keyword in ['rbi circular', 'lendclub compliance', 'आरबीआई सर्कुलर', 'लेंडेनक्लब अनुपालन']):
            context['lastDocumentIndex'] = document_data['documentIndices']['rbiCircular']
        elif any(keyword in query for keyword in ['rbi document', 'master directions', 'आरबीआई दस्तावेज', 'मास्टर दिशानिर्देश']):
            context['lastDocumentIndex'] = document_data['documentIndices']['rbiDocument']
        # Determine the topic
        if any(keyword in query for keyword in ['overview', 'about', 'p2p', 'lendenclub', 'अवलोकन', 'के बारे में', 'पी2पी', 'लेंडेनक्लब']):
            context['lastTopic'] = 'overview'
        elif any(keyword in query for keyword in ['lending', 'options', 'उधार', 'विकल्प']):
            context['lastTopic'] = 'lendingOptions'
        elif any(keyword in query for keyword in ['repayment', 'returns', 'पुनर्भुगतान', 'रिटर्न']):
            context['lastTopic'] = 'repaymentDetails'
        elif any(keyword in query for keyword in ['regulation', 'rbi', 'guidelines', 'विनियमन', 'आरबीआई', 'दिशानिर्देश']):
            context['lastTopic'] = 'rbiGuidelines'
        elif any(keyword in query for keyword in ['concern', 'issue', 'चिंता', 'मुद्दा']):
            context['lastTopic'] = 'rbiConcerns'
        elif any(keyword in query for keyword in ['action', 'compliance', 'कार्रवाई', 'अनुपालन']):
            context['lastTopic'] = 'complianceActions'
        elif any(keyword in query for keyword in ['risk', 'mitigation', 'default', 'npa', 'जोखिम', 'न्यूनीकरण', 'डिफ़ॉल्ट', 'एनपीए']):
            context['lastTopic'] = 'riskMitigations'
        elif any(keyword in query for keyword in ['investor', 'protection', 'निवेशक', 'सुरक्षा']):
            context['lastTopic'] = 'investorProtections'
        elif any(keyword in query for keyword in ['market', 'growth', 'बाजार', 'वृद्धि']):
            context['lastTopic'] = 'marketDetails'
        elif any(keyword in query for keyword in ['registration', 'process', 'पंजीकरण', 'प्रक्रिया']):
            context['lastTopic'] = 'registration'
        context['questionCount'] += 1

def detect_language(text):
    hindi_pattern = re.compile(r'[\u0900-\u097F]')
    return 'hi' if hindi_pattern.search(text) else 'en'

responses = {
    'greeting': {
        'en': [
            "Hello! I'm here to share details about LenDenClub and P2P lending in India from various documents. Which document or topic would you like to explore?",
            "Hi! Curious about LenDenClub's operations, RBI regulations, or the P2P lending market? Let me know what you're interested in!"
        ],
        'hi': [
            "नमस्ते! मैं विभिन्न दस्तावेजों से लेंडेनक्लब और भारत में P2P उधार के विवरण साझा करने के लिए हूँ। आप कौन सा दस्तावेज या विषय जानना चाहेंगे?",
            "हाय! लेंडेनक्लब के संचालन, RBI नियमों, या P2P उधार बाजार के बारे में उत्सुक हैं? मुझे बताएं कि आप किसमें रुचि रखते हैं!"
        ]
    },
    'overview': {
        'en': lambda doc_index: f"Overview from {document_data['documents']['filenames'][doc_index]} ({document_data['documents']['lastUpdated'][doc_index]}):\n\n{document_data['documents']['overviews'][doc_index]['description']}\n\nWhat specific details would you like to explore?",
        'hi': lambda doc_index: f"{document_data['documents']['filenames'][doc_index]} ({document_data['documents']['lastUpdated'][doc_index]}) का अवलोकन:\n\n{document_data['documents']['overviews'][doc_index]['descriptionHi']}\n\nआप किन विशिष्ट विवरणों का पता लगाना चाहेंगे?"
    },
    'lendingOptions': {
        'en': lambda doc_index: f"Lending options from {document_data['documents']['filenames'][doc_index]}:\n\n" + '\n\n'.join(
            [f"• {opt['type']}: {opt['description']}" for opt in document_data['documents']['lendingOptions'][doc_index]]
        ) + "\n\nWould you like details on repayment or registration?" if document_data['documents']['lendingOptions'][doc_index] else f"No lending options available in {document_data['documents']['filenames'][doc_index]}.\n\nWould you like to explore other topics?",
        'hi': lambda doc_index: f"{document_data['documents']['filenames'][doc_index]} के उधार विकल्प:\n\n" + '\n\n'.join(
            [f"• {opt['typeHi']}: {opt['descriptionHi']}" for opt in document_data['documents']['lendingOptions'][doc_index]]
        ) + "\n\nक्या आप पुनर्भुगतान या पंजीकरण के विवरण चाहेंगे?" if document_data['documents']['lendingOptions'][doc_index] else f"{document_data['documents']['filenames'][doc_index]} में कोई उधार विकल्प उपलब्ध नहीं हैं।\n\nक्या आप अन्य विषयों का पता लगाना चाहेंगे?"
    },
    'repaymentDetails': {
        'en': lambda doc_index: f"Repayment details from {document_data['documents']['filenames'][doc_index]}:\n\n" + '\n\n'.join(
            [f"• {rep['type']}: {rep['description']}" for rep in document_data['documents']['repaymentDetails'][doc_index]]
        ) + "\n\nInterested in risk mitigation or lending options?" if document_data['documents']['repaymentDetails'][doc_index] else f"No repayment details available in {document_data['documents']['filenames'][doc_index]}.\n\nWould you like to explore other topics?",
        'hi': lambda doc_index: f"{document_data['documents']['filenames'][doc_index]} के पुनर्भुगतान विवरण:\n\n" + '\n\n'.join(
            [f"• {rep['typeHi']}: {rep['descriptionHi']}" for rep in document_data['documents']['repaymentDetails'][doc_index]]
        ) + "\n\nक्या आप जोखिम न्यूनीकरण या उधार विकल्पों में रुचि रखते हैं?" if document_data['documents']['repaymentDetails'][doc_index] else f"{document_data['documents']['filenames'][doc_index]} में कोई पुनर्भुगतान विवरण उपलब्ध नहीं हैं।\n\nक्या आप अन्य विषयों का पता लगाना चाहेंगे?"
    },
    'rbiGuidelines': {
        'en': lambda doc_index: f"RBI Guidelines from {document_data['documents']['filenames'][doc_index]}:\n\n" + '\n'.join(
            [f"• {point}" for point in document_data['documents']['rbiGuidelines'][doc_index]['points']]
        ) + "\n\nWant to explore RBI concerns or compliance actions?" if document_data['documents']['rbiGuidelines'][doc_index] else f"No RBI guidelines available in {document_data['documents']['filenames'][doc_index]}.\n\nWould you like to explore other topics?",
        'hi': lambda doc_index: f"{document_data['documents']['filenames'][doc_index]} के RBI दिशानिर्देश:\n\n" + '\n'.join(
            [f"• {point}" for point in document_data['documents']['rbiGuidelines'][doc_index]['pointsHi']]
        ) + "\n\nक्या आप RBI की चिंताओं या अनुपालन कार्रवाइयों का पता लगाना चाहेंगे?" if document_data['documents']['rbiGuidelines'][doc_index] else f"{document_data['documents']['filenames'][doc_index]} में कोई RBI दिशानिर्देश उपलब्ध नहीं हैं।\n\nक्या आप अन्य विषयों का पता लगाना चाहेंगे?"
    },
    'rbiConcerns': {
        'en': lambda doc_index: f"RBI Concerns from {document_data['documents']['filenames'][doc_index]}:\n\n" + '\n'.join(
            [f"• {issue}" for issue in document_data['documents']['rbiConcerns'][doc_index]['issues']]
        ) + "\n\nInterested in compliance actions or risk mitigation?" if document_data['documents']['rbiConcerns'][doc_index] else f"No RBI concerns available in {document_data['documents']['filenames'][doc_index]}.\n\nWould you like to explore other topics?",
        'hi': lambda doc_index: f"{document_data['documents']['filenames'][doc_index]} की RBI चिंताएँ:\n\n" + '\n'.join(
            [f"• {issue}" for issue in document_data['documents']['rbiConcerns'][doc_index]['issuesHi']]
        ) + "\n\nक्या आप अनुपालन कार्रवाइयों या जोखिम न्यूनीकरण में रुचि रखते हैं?" if document_data['documents']['rbiConcerns'][doc_index] else f"{document_data['documents']['filenames'][doc_index]} में कोई RBI चिंताएँ उपलब्ध नहीं हैं।\n\nक्या आप अन्य विषयों का पता लगाना चाहेंगे?"
    },
    'complianceActions': {
        'en': lambda doc_index: f"Compliance Actions from {document_data['documents']['filenames'][doc_index]}:\n\n" + '\n'.join(
            [f"• {action}" for action in document_data['documents']['complianceActions'][doc_index]['actions']]
        ) + "\n\nCurious about RBI guidelines or risk mitigation?" if document_data['documents']['complianceActions'][doc_index] else f"No compliance actions available in {document_data['documents']['filenames'][doc_index]}.\n\nWould you like to explore other topics?",
        'hi': lambda doc_index: f"{document_data['documents']['filenames'][doc_index]} की अनुपालन कार्रवाइयाँ:\n\n" + '\n'.join(
            [f"• {action}" for action in document_data['documents']['complianceActions'][doc_index]['actionsHi']]
        ) + "\n\nक्या आप RBI दिशानिर्देशों या जोखिम न्यूनीकरण के बारे में उत्सुक हैं?" if document_data['documents']['complianceActions'][doc_index] else f"{document_data['documents']['filenames'][doc_index]} में कोई अनुपालन कार्रवाइयाँ उपलब्ध नहीं हैं।\n\nक्या आप अन्य विषयों का पता लगाना चाहेंगे?"
    },
    'riskMitigations': {
        'en': lambda doc_index: f"Risk Mitigation Measures from {document_data['documents']['filenames'][doc_index]}:\n\n" + '\n'.join(
            [f"• {measure}" for measure in document_data['documents']['riskMitigations'][doc_index]['measures']]
        ) + "\n\nWant to explore RBI concerns or compliance actions?" if document_data['documents']['riskMitigations'][doc_index] else f"No risk mitigation measures available in {document_data['documents']['filenames'][doc_index]}.\n\nWould you like to explore other topics?",
        'hi': lambda doc_index: f"{document_data['documents']['filenames'][doc_index]} के जोखिम न्यूनीकरण उपाय:\n\n" + '\n'.join(
            [f"• {measure}" for measure in document_data['documents']['riskMitigations'][doc_index]['measuresHi']]
        ) + "\n\nक्या आप RBI की चिंताओं या अनुपालन कार्रवाइयों का पता लगाना चाहेंगे?" if document_data['documents']['riskMitigations'][doc_index] else f"{document_data['documents']['filenames'][doc_index]} में कोई जोखिम न्यूनीकरण उपाय उपलब्ध नहीं हैं।\n\nक्या आप अन्य विषयों का पता लगाना चाहेंगे?"
    },
    'investorProtections': {
        'en': lambda doc_index: f"Investor Protections from {document_data['documents']['filenames'][doc_index]}:\n\n" + '\n'.join(
            [f"• {prot['level']}: {prot['description']}" for prot in document_data['documents']['investorProtections'][doc_index]]
        ) + "\n\nInterested in market details or regulations?" if document_data['documents']['investorProtections'][doc_index] else f"No investor protections available in {document_data['documents']['filenames'][doc_index]}.\n\nWould you like to explore other topics?",
        'hi': lambda doc_index: f"{document_data['documents']['filenames'][doc_index]} की निवेशक सुरक्षा:\n\n" + '\n'.join(
            [f"• {prot['level']}: {prot['descriptionHi']}" for prot in document_data['documents']['investorProtections'][doc_index]]
        ) + "\n\nक्या आप बाजार विवरण या विनियमन में रुचि रखते हैं?" if document_data['documents']['investorProtections'][doc_index] else f"{document_data['documents']['filenames'][doc_index]} में कोई निवेशक सुरक्षा उपलब्ध नहीं है।\n\nक्या आप अन्य विषयों का पता लगाना चाहेंगे?"
    },
    'marketDetails': {
        'en': lambda doc_index: f"Market Details from {document_data['documents']['filenames'][doc_index]}:\n\n• India Market Size: {document_data['documents']['marketDetails'][doc_index]['sizeIndia']}\n• China Market Size: {document_data['documents']['marketDetails'][doc_index]['sizeChina']}\n• Growth CAGR: {document_data['documents']['marketDetails'][doc_index]['growthCAGR']}\n\nWant to explore regulations or risks?" if document_data['documents']['marketDetails'][doc_index] else f"No market details available in {document_data['documents']['filenames'][doc_index]}.\n\nWould you like to explore other topics?",
        'hi': lambda doc_index: f"{document_data['documents']['filenames'][doc_index]} के बाजार विवरण:\n\n• भारत बाजार आकार: {document_data['documents']['marketDetails'][doc_index]['sizeIndiaHi']}\n• चीन बाजार आकार: {document_data['documents']['marketDetails'][doc_index]['sizeChinaHi']}\n• वृद्धि CAGR: {document_data['documents']['marketDetails'][doc_index]['growthCAGRHi']}\n\nक्या आप विनियमन या जोखिमों का पता लगाना चाहेंगे?" if document_data['documents']['marketDetails'][doc_index] else f"{document_data['documents']['filenames'][doc_index]} में कोई बाजार विवरण उपलब्ध नहीं हैं।\n\nक्या आप अन्य विषयों का पता लगाना चाहेंगे?"
    },
    'registration': {
        'en': lambda doc_index: f"Registration Process from {document_data['documents']['filenames'][doc_index]}:\n\n1. Sign-up on the platform.\n2. Enter PAN & Aadhar details.\n3. Complete Live KYC (auto-verified if CKYC available, else via DigiLocker).\n4. Provide legal authorization.\n5. Link and verify bank account.\n6. Get listed to access borrower options.\n\nNeed help with any specific step or want to know about lending options?" if doc_index == document_data['documentIndices']['instructions'] else f"No registration process details available in {document_data['documents']['filenames'][doc_index]}.\n\nWould you like to explore other topics?",
        'hi': lambda doc_index: f"{document_data['documents']['filenames'][doc_index]} की पंजीकरण प्रक्रिया:\n\n1. मंच पर साइन-अप करें।\n2. पैन और आधार विवरण दर्ज करें।\n3. लाइव KYC पूरा करें (यदि CKYC उपलब्ध हो तो स्वतः सत्यापित, अन्यथा डिजिलॉकर के माध्यम से)।\n4. कानूनी प्राधिकरण प्रदान करें।\n5. बैंक खाता लिंक और सत्यापित करें।\n6. उधारकर्ता विकल्पों तक पहुँचने के लिए सूचीबद्ध हों।\n\nक्या आपको किसी विशिष्ट चरण में मदद चाहिए या उधार विकल्पों के बारे में जानना चाहते हैं?" if doc_index == document_data['documentIndices']['instructions'] else f"{document_data['documents']['filenames'][doc_index]} में कोई पंजीकरण प्रक्रिया विवरण उपलब्ध नहीं हैं।\n\nक्या आप अन्य विषयों का पता लगाना चाहेंगे?"
    },
    'fallback': {
        'en': [
            "Could you clarify which document (Instructions, P2P Landscape, RBI Circular, RBI Document) or topic (e.g., lending, regulations, risks) you'd like to know about?",
            "I'm here to assist! Please specify which document or aspect of P2P lending you're interested in."
        ],
        'hi': [
            "क्या आप स्पष्ट कर सकते हैं कि आप किस दस्तावेज (निर्देश, P2P परिदृश्य, RBI सर्कुलर, RBI दस्तावेज) या विषय (उदाहरण के लिए, उधार, विनियमन, जोखिम) के बारे में जानना चाहते हैं?",
            "मैं मदद के लिए यहाँ हूँ! कृपया निर्दिष्ट करें कि आप किस दस्तावेज या P2P उधार के किस पहलू में रुचि रखते हैं।"
        ]
    }
}

def get_random_response(category, language='en', doc_index=None):
    options = responses[category][language]
    if callable(options) and doc_index is not None:
        return options(doc_index)
    return random.choice(options)

def match_keywords(query, messages, language):
    query_lower = query.lower()
    analyze_context(messages)

    doc_index = context['lastDocumentIndex']
    if any(keyword in query_lower for keyword in ['instructions', 'lending process', 'registration', 'निर्देश', 'उधार प्रक्रिया', 'पंजीकरण']):
        doc_index = document_data['documentIndices']['instructions']
    elif any(keyword in query_lower for keyword in ['p2p landscape', 'market', 'msme', 'पी2पी परिदृश्य', 'बाजार', 'एमएसएमई']):
        doc_index = document_data['documentIndices']['p2pLandscape']
    elif any(keyword in query_lower for keyword in ['rbi circular', 'lendclub compliance', 'आरबीआई सर्कुलर', 'लेंडेनक्लब अनुपालन']):
        doc_index = document_data['documentIndices']['rbiCircular']
    elif any(keyword in query_lower for keyword in ['rbi document', 'master directions', 'आरबीआई दस्तावेज', 'मास्टर दिशानिर्देश']):
        doc_index = document_data['documentIndices']['rbiDocument']

    if any(keyword in query_lower for keyword in ['hello', 'hi', 'नमस्ते', 'हाय']):
        return get_random_response('greeting', language)
    if doc_index is None:
        return get_random_response('fallback', language)
    if any(keyword in query_lower for keyword in ['overview', 'about', 'p2p', 'lendenclub', 'अवलोकन', 'के बारे में', 'पी2पी', 'लेंडेनक्लब']):
        return responses['overview'][language](doc_index)
    if any(keyword in query_lower for keyword in ['lending', 'options', 'उधार', 'विकल्प']):
        return responses['lendingOptions'][language](doc_index)
    if any(keyword in query_lower for keyword in ['repayment', 'returns', 'पुनर्भुगतान', 'रिटर्न']):
        return responses['repaymentDetails'][language](doc_index)
    if any(keyword in query_lower for keyword in ['regulation', 'rbi', 'guidelines', 'विनियमन', 'आरबीआई', 'दिशानिर्देश']):
        return responses['rbiGuidelines'][language](doc_index)
    if any(keyword in query_lower for keyword in ['concern', 'issue', 'चिंता', 'मुद्दा']):
        return responses['rbiConcerns'][language](doc_index)
    if any(keyword in query_lower for keyword in ['action', 'compliance', 'कार्रवाई', 'अनुपालन']):
        return responses['complianceActions'][language](doc_index)
    if any(keyword in query_lower for keyword in ['risk', 'mitigation', 'default', 'npa', 'जोखिम', 'न्यूनीकरण', 'डिफ़ॉल्ट', 'एनपीए']):
        return responses['riskMitigations'][language](doc_index)
    if any(keyword in query_lower for keyword in ['investor', 'protection', 'निवेशक', 'सुरक्षा']):
        return responses['investorProtections'][language](doc_index)
    if any(keyword in query_lower for keyword in ['market', 'growth', 'बाजार', 'वृद्धि']):
        return responses['marketDetails'][language](doc_index)
    if any(keyword in query_lower for keyword in ['registration', 'process', 'पंजीकरण', 'प्रक्रिया']):
        return responses['registration'][language](doc_index)
    if context['lastTopic']:
        return responses[context['lastTopic']][language](doc_index)
    return get_random_response('fallback', language)

async def process_query(query, messages=None, preferred_language=None):
    if messages is None:
        messages = []
    base_delay = 1.0
    complexity_factor = len(query) / 20
    random_variation = random.random() * 0.5
    await asyncio.sleep(base_delay + complexity_factor * 0.1 + random_variation)
    language = preferred_language or detect_language(query)
    return match_keywords(query, messages, language)

if __name__ == "__main__":
    async def main():
        query = "Tell me about RBI guidelines in RBI Document"
        response = await process_query(query, [])
        print(response)
    asyncio.run(main())