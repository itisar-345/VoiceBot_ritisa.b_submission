import random
import time
import re
import asyncio

platform_data = {
    "factsheets": {
        "months": ["December 2024", "January 2025", "February 2025"],
        "monthsHi": ["दिसंबर 2024", "जनवरी 2025", "फरवरी 2025"],
        "authors": ["Dipesh Karki, CTO", "Bhavin Patel, CEO", "Dipesh Karki, CTO"],
        "authorsHi": ["दीपेश कार्की, सीटीओ", "भाविन पटेल, सीईओ", "दीपेश कार्की, सीटीओ"],
        "summaries": [
            "LenDenClub achieved major milestones with growth in retail and CP segments, doubled lender participation, and a 25% increase in Instamoney loan disbursements, reaching close to ₹700 crore. The Instamoney app surpassed 3 crore downloads, ranking among the top 5 loan platforms.",
            "In January 2025, LenDenGenie AI chatbot handled 35% of customer queries with a 62% resolution rate, freeing 70+ agent hours monthly. Loan recollection reached a record 96.13%, and disbursements hit 85% of the July 2024 peak. A 40% month-over-month user increase highlights growing P2P lending interest.",
            "Short Term Lending (STL) crossed ₹100 Cr in under 4 months, with 50% of Retail STL schemes created in 22 seconds and a 99.95% success rate for CP STL. Smart optimization reduced Retail STL attempts to an average of 1.77, showcasing technological robustness and team dedication."
        ],
        "summariesHi": [
            "लेंडेनक्लब ने रिटेल और सीपी सेगमेंट में वृद्धि, लेंडर भागीदारी में दोगुना वृद्धि, और इंस्टामनी ऋण वितरण में 25% वृद्धि के साथ प्रमुख मील के पत्थर हासिल किए, जो ₹700 करोड़ के करीब पहुंच गया। इंस्टामनी ऐप ने 3 करोड़ डाउनलोड्स को पार कर लिया, जो शीर्ष 5 ऋण प्लेटफॉर्मों में शामिल है।",
            "जनवरी 2025 में, लेंडेनजेनाई AI चैटबॉट ने 35% ग्राहक प्रश्नों को 62% समाधान दर के साथ संभाला, जिससे प्रति माह 70+ एजेंट घंटे मुक्त हुए। ऋण पुनर्प्राप्ति 96.13% के रिकॉर्ड स्तर पर पहुंची, और वितरण जुलाई 2024 के शिखर का 85% रहा। 40% मासिक उपयोगकर्ता वृद्धि P2P ऋण में बढ़ती रुचि को दर्शाती है।",
            "शॉर्ट टर्म लेंडिंग (STL) ने 4 महीनों में ₹100 करोड़ को पार किया, जिसमें 50% रिटेल STL योजनाएँ 22 सेकंड में बनाई गईं और CP STL के लिए 99.95% सफलता दर रही। स्मार्ट ऑप्टिमाइज़ेशन ने रिटेल STL प्रयासों को औसतन 1.77 तक कम किया, जो तकनीकी मजबूती और टीम समर्पण को दर्शाता है।"
        ],
        "keyMetrics": [
            [
                {"name": "Amount Lent Till Date", "value": "₹16,011 Cr", "valueHi": "₹16,011 करोड़"},
                {"name": "Registered Users", "value": "2 Cr+", "valueHi": "2 करोड़+"},
                {"name": "LenDenClub Rating", "value": "4.4", "valueHi": "4.4"},
                {"name": "InstaMoney Rating", "value": "4.4", "valueHi": "4.4"}
            ],
            [
                {"name": "Amount Lent Till Date", "value": "₹16,136 Cr", "valueHi": "₹16,136 करोड़"},
                {"name": "Registered Users", "value": "2 Cr+", "valueHi": "2 करोड़+"},
                {"name": "LenDenClub Rating", "value": "4.3", "valueHi": "4.3"},
                {"name": "InstaMoney Rating", "value": "4.4", "valueHi": "4.4"}
            ],
            [
                {"name": "Amount Lent Till Date", "value": "₹16,233 Cr", "valueHi": "₹16,233 करोड़"},
                {"name": "Registered Users", "value": "2 Cr+", "valueHi": "2 करोड़+"},
                {"name": "LenDenClub Rating", "value": "4.3", "valueHi": "4.3"},
                {"name": "InstaMoney Rating", "value": "4.4", "valueHi": "4.4"}
            ]
        ],
        "historicalPerformances": [
            {"interestEarned": "11.99%", "interestEarnedHi": "11.99%"},
            {"interestEarned": "11.96%", "interestEarnedHi": "11.96%"},
            {
                "minInterest": "11.92%", "minInterestHi": "11.92%",
                "avgInterest": "11.35%", "avgInterestHi": "11.35%",
                "maxInterest": "11.18%", "maxInterestHi": "11.18%"
            }
        ],
        "portfolioSummaries": [
            {"aum": "₹1023 Cr", "aumHi": "₹1023 करोड़", "npa": "3.78%", "npaHi": "3.78%"},
            {"aum": "₹1013 Cr", "aumHi": "₹1013 करोड़", "npa": "3.78%", "npaHi": "3.78%"},
            {"aum": None, "aumHi": None, "npa": None, "npaHi": None}
        ],
        "lendingPerformances": [
            [
                {"name": "Fund Diversified", "value": "95.22% up to ₹100", "valueHi": "95.22% ₹100 तक"},
                {"name": "Loss of Principal", "value": "0% since launch", "valueHi": "लॉन्च से 0%"},
                {"name": "Interest p.a. Earned", "value": "11.33%", "valueHi": "11.33% प्रति वर्ष"},
                {"name": "Maximum Amount Lent", "value": "₹10 Lakhs", "valueHi": "₹10 लाख"}
            ],
            [
                {"name": "Fund Diversified", "value": "99.48% up to ₹500", "valueHi": "99.48% ₹500 तक"},
                {"name": "Loss of Principal", "value": "0% since launch", "valueHi": "लॉन्च से 0%"},
                {"name": "Interest p.a. Earned", "value": "10.67%", "valueHi": "10.67% प्रति वर्ष"},
                {"name": "Maximum One Time Lending Ticket Size", "value": "₹25 Lakhs", "valueHi": "₹25 लाख"}
            ],
            [
                {"name": "Fund Diversified", "value": "98.71% up to ₹500", "valueHi": "98.71% ₹500 तक"},
                {"name": "Loss of Principal", "value": "0% since launch", "valueHi": "लॉन्च से 0%"},
                {"name": "Interest p.a. Earned", "value": "10.68%", "valueHi": "10.68% प्रति वर्ष"},
                {"name": "Maximum One Time Lending Ticket Size", "value": "₹20 Lakhs", "valueHi": "₹20 लाख"}
            ]
        ],
        "keyLendingStats": [
            [],
            [
                {"name": "Data Points Analyzed per Borrower", "value": "600+", "valueHi": "600+"},
                {"name": "Borrower's Regular Repayment", "value": "96.13%", "valueHi": "96.13%"}
            ],
            [
                {"name": "Data Points Analyzed per Borrower", "value": "600+", "valueHi": "600+"},
                {"name": "Borrower's Regular Repayment", "value": "96.70%", "valueHi": "96.70%"}
            ]
        ],
        "loanDetails": [
            [],
            [
                {"type": "Merchant Loans", "count": "10,107", "avgTenure": "4 Months", "avgTenureHi": "4 महीने"},
                {"type": "Personal Loans", "count": "109,687", "avgTenure": "11 Months", "avgTenureHi": "11 महीने"}
            ],
            [
                {"type": "Merchant Loans", "count": "9,561", "avgTenure": "4 Months", "avgTenureHi": "4 महीने"},
                {"type": "Personal Loans", "count": "172,785", "avgTenure": "11 Months", "avgTenureHi": "11 महीने"}
            ]
        ],
        "escrowMechanisms": [
            "Operates using an Escrow Mechanism with ICICI Trusteeship Services Ltd. Separate accounts for lenders and borrowers ensure funds return in T+1 days, providing transparency and zero platform control over money.",
            "Operates using an Escrow Mechanism with ICICI Trusteeship Services Ltd. Separate accounts for lenders and borrowers ensure funds return in T+1 days, providing transparency and zero platform control over money.",
            "Operates using an Escrow Mechanism with ICICI Trusteeship Services Ltd. Separate accounts for lenders and borrowers ensure funds return in T+1 days, providing transparency and zero platform control over money."
        ],
        "escrowMechanismsHi": [
            "ICICI ट्रस्टीशिप सर्विसेज लिमिटेड के साथ एस्क्रो मैकेनिज्म का उपयोग करता है। लेंडर्स और उधारकर्ताओं के लिए अलग-अलग खाते T+1 दिनों में धन वापसी सुनिश्चित करते हैं, पारदर्शिता प्रदान करते हैं और प्लेटफॉर्म का धन पर शून्य नियंत्रण होता है।",
            "ICICI ट्रस्टीशिप सर्विसेज लिमिटेड के साथ एस्क्रो मैकेनिज्म का उपयोग करता है। लेंडर्स और उधारकर्ताओं के लिए अलग-अलग खाते T+1 दिनों में धन वापसी सुनिश्चित करते हैं, पारदर्शिता प्रदान करते हैं और प्लेटफॉर्म का धन पर शून्य नियंत्रण होता है।",
            "ICICI ट्रस्टीशिप सर्विसेज लिमिटेड के साथ एस्क्रो मैकेनिज्म का उपयोग करता है। लेंडर्स और उधारकर्ताओं के लिए अलग-अलग खाते T+1 दिनों में धन वापसी सुनिश्चित करते हैं, पारदर्शिता प्रदान करते हैं और प्लेटफॉर्म का धन पर शून्य नियंत्रण होता है।"
        ],
        "contacts": ["support@lendenclub.com", "support@lendenclub.com", "support@lendenclub.com"]
    },
    "metrics": [
        {
            "instamoneyDownloads": "3 Cr+",
            "instamoneyDownloadsHi": "3 करोड़+",
            "instamoneyDisbursementGrowth": "25%",
            "instamoneyDisbursementGrowthHi": "25%"
        },
        {
            "loanRecollectionRate": "96.13%",
            "loanRecollectionRateHi": "96.13%",
            "userGrowth": "40% month-over-month",
            "userGrowthHi": "40% मासिक वृद्धि"
        },
        {
            "stlAmount": "₹100 Cr+",
            "stlAmountHi": "₹100 करोड़+",
            "retailStlSuccessTime": "22 seconds for 50% schemes",
            "retailStlSuccessTimeHi": "50% योजनाओं के लिए 22 सेकंड"
        }
    ],
    "factsheetIndices": {
        "december2024": 0,
        "january2025": 1,
        "february2025": 2
    }
}

context = {
    "questionCount": 0,
    "lastTopic": None,
    "lastMonthIndex": None
}

def analyze_context(messages):
    last_user_message = [m['content'].lower() for m in messages if m['sender'] == 'user'][-1:]

    if last_user_message:
        query = last_user_message[0]
        # Determine which month's factsheet is being queried
        if any(keyword in query for keyword in ['december', 'दिसंबर']):
            context['lastMonthIndex'] = platform_data['factsheetIndices']['december2024']
        elif any(keyword in query for keyword in ['january', 'जनवरी']):
            context['lastMonthIndex'] = platform_data['factsheetIndices']['january2025']
        elif any(keyword in query for keyword in ['february', 'फरवरी']):
            context['lastMonthIndex'] = platform_data['factsheetIndices']['february2025']
        # Determine the topic
        if any(keyword in query for keyword in ['summary', 'overview', 'सारांश', 'अवलोकन']):
            context['lastTopic'] = 'summary'
        elif any(keyword in query for keyword in ['performance', 'lending', 'प्रदर्शन', 'ऋण']):
            context['lastTopic'] = 'lendingPerformance'
        elif any(keyword in query for keyword in ['metrics', 'stats', 'मेट्रिक्स', 'आंकड़े']):
            context['lastTopic'] = 'keyMetrics'
        elif any(keyword in query for keyword in ['escrow', 'transparency', 'एस्क्रो', 'पारदर्शिता']):
            context['lastTopic'] = 'escrowMechanism'
        elif any(keyword in query for keyword in ['loans', 'borrower', 'ऋण', 'उधारकर्ता']):
            context['lastTopic'] = 'loanDetails'
        context['questionCount'] += 1

def detect_language(text):
    hindi_pattern = re.compile(r'[\u0900-\u097F]')
    return 'hi' if hindi_pattern.search(text) else 'en'

responses = {
    'greeting': {
        'en': [
            "Hello! I'm here to share details about LenDenClub's performance across December 2024, January 2025, and February 2025. Which month or topic would you like to explore?",
            "Hi! Curious about LenDenClub's factsheets for December 2024, January 2025, or February 2025? Let me know what you're interested in!"
        ],
        'hi': [
            "नमस्ते! मैं दिसंबर 2024, जनवरी 2025, और फरवरी 2025 में लेंडेनक्लब के प्रदर्शन के विवरण साझा करने के लिए यहाँ हूँ। आप कौन सा महीना या विषय जानना चाहेंगे?",
            "हाय! दिसंबर 2024, जनवरी 2025, या फरवरी 2025 के लेंडेनक्लब फैक्टशीट के बारे में उत्सुक हैं? मुझे बताएं कि आप किसमें रुचि रखते हैं!"
        ]
    },
    'summary': {
        'en': lambda month_index: f"Here's an overview of LenDenClub's {platform_data['factsheets']['months'][month_index]} performance:\n\n{platform_data['factsheets']['summaries'][month_index]}\n\nWhat specific details would you like to explore?",
        'hi': lambda month_index: f"यहाँ {platform_data['factsheets']['monthsHi'][month_index]} में लेंडेनक्लब के प्रदर्शन का अवलोकन है:\n\n{platform_data['factsheets']['summariesHi'][month_index]}\n\nआप किन विशिष्ट विवरणों का पता लगाना चाहेंगे?"
    },
    'keyMetrics': {
        'en': lambda month_index: f"Key metrics for {platform_data['factsheets']['months'][month_index]}:\n\n" + '\n'.join(
            [f"• {metric['name']}: {metric['value']}" for metric in platform_data['factsheets']['keyMetrics'][month_index]]
        ) + "\n\nWould you like more details on any of these metrics?",
        'hi': lambda month_index: f"{platform_data['factsheets']['monthsHi'][month_index]} के लिए प्रमुख मेट्रिक्स:\n\n" + '\n'.join(
            [f"• {metric['name']}: {metric['valueHi']}" for metric in platform_data['factsheets']['keyMetrics'][month_index]]
        ) + "\n\nक्या आप इनमें से किसी मेट्रिक पर अधिक विवरण चाहेंगे?"
    },
    'lendingPerformance': {
        'en': lambda month_index: f"Lending performance for {platform_data['factsheets']['months'][month_index]}:\n\n" + '\n'.join(
            [f"• {perf['name']}: {perf['value']}" for perf in platform_data['factsheets']['lendingPerformances'][month_index]]
        ) + "\n\nInterested in loan details or key lending stats?",
        'hi': lambda month_index: f"{platform_data['factsheets']['monthsHi'][month_index]} के लिए ऋण प्रदर्शन:\n\n" + '\n'.join(
            [f"• {perf['name']}: {perf['valueHi']}" for perf in platform_data['factsheets']['lendingPerformances'][month_index]]
        ) + "\n\nऋण विवरण या प्रमुख ऋण आंकड़ों में रुचि है?"
    },
    'loanDetails': {
        'en': lambda month_index: f"Loan details for {platform_data['factsheets']['months'][month_index]}:\n\n" + '\n'.join(
            [f"• {loan['type']}: {loan['count']} loans, Avg. Tenure: {loan['avgTenure']}" for loan in platform_data['factsheets']['loanDetails'][month_index]]
        ) + "\n\nWant to know more about borrower profiles?" if platform_data['factsheets']['loanDetails'][month_index] else f"No loan details available for {platform_data['factsheets']['months'][month_index]}.\n\nWould you like to explore other metrics?",
        'hi': lambda month_index: f"{platform_data['factsheets']['monthsHi'][month_index]} के लिए ऋण विवरण:\n\n" + '\n'.join(
            [f"• {loan['type']}: {loan['count']} ऋण, औसत अवधि: {loan['avgTenureHi']}" for loan in platform_data['factsheets']['loanDetails'][month_index]]
        ) + "\n\nउधारकर्ता प्रोफाइल के बारे में और जानना चाहते हैं?" if platform_data['factsheets']['loanDetails'][month_index] else f"{platform_data['factsheets']['monthsHi'][month_index]} के लिए कोई ऋण विवरण उपलब्ध नहीं है।\n\nक्या आप अन्य मेट्रिक्स का पता लगाना चाहेंगे?"
    },
    'escrowMechanism': {
        'en': lambda month_index: f"Escrow Mechanism for {platform_data['factsheets']['months'][month_index]}:\n\n{platform_data['factsheets']['escrowMechanisms'][month_index]}\n\nWould you like to know more about platform operations?",
        'hi': lambda month_index: f"{platform_data['factsheets']['monthsHi'][month_index]} के लिए एस्क्रो मैकेनिज्म:\n\n{platform_data['factsheets']['escrowMechanismsHi'][month_index]}\n\nक्या आप प्लेटफॉर्म संचालन के बारे में और जानना चाहेंगे?"
    },
    'fallback': {
        'en': [
            "Could you clarify which month's factsheet (December 2024, January 2025, February 2025) or what specific topic (e.g., metrics, lending performance, loan details) you'd like to know about?",
            "I'm here to help! Please specify which month or aspect of LenDenClub's factsheets you're interested in."
        ],
        'hi': [
            "क्या आप स्पष्ट कर सकते हैं कि आप किस महीने के फैक्टशीट (दिसंबर 2024, जनवरी 2025, फरवरी 2025) या कौन से विशिष्ट विषय (उदाहरण के लिए, मेट्रिक्स, ऋण प्रदर्शन, ऋण विवरण) के बारे में जानना चाहते हैं?",
            "मैं मदद के लिए यहाँ हूँ! कृपया निर्दिष्ट करें कि आप किस महीने या लेंडेनक्लब के फैक्टशीट के किस पहलू में रुचि रखते हैं।"
        ]
    }
}

def get_random_response(category, language='en', month_index=None):
    options = responses[category][language]
    if callable(options) and month_index is not None:
        return options(month_index)
    return random.choice(options)

def match_keywords(query, messages, language):
    query_lower = query.lower()
    analyze_context(messages)

    month_index = context['lastMonthIndex']
    if any(keyword in query_lower for keyword in ['december', 'दिसंबर']):
        month_index = platform_data['factsheetIndices']['december2024']
    elif any(keyword in query_lower for keyword in ['january', 'जनवरी']):
        month_index = platform_data['factsheetIndices']['january2025']
    elif any(keyword in query_lower for keyword in ['february', 'फरवरी']):
        month_index = platform_data['factsheetIndices']['february2025']

    if any(keyword in query_lower for keyword in ['hello', 'hi', 'नमस्ते', 'हाय']):
        return get_random_response('greeting', language)
    if month_index is None:
        return get_random_response('fallback', language)
    if any(keyword in query_lower for keyword in ['summary', 'overview', 'सारांश', 'अवलोकन']):
        return responses['summary'][language](month_index)
    if any(keyword in query_lower for keyword in ['metrics', 'stats', 'मेट्रिक्स', 'आंकड़े']):
        return responses['keyMetrics'][language](month_index)
    if any(keyword in query_lower for keyword in ['performance', 'lending', 'प्रदर्शन', 'ऋण']):
        return responses['lendingPerformance'][language](month_index)
    if any(keyword in query_lower for keyword in ['escrow', 'transparency', 'एस्क्रो', 'पारदर्शिता']):
        return responses['escrowMechanism'][language](month_index)
    if any(keyword in query_lower for keyword in ['loans', 'borrower', 'ऋण', 'उधारकर्ता']):
        return responses['loanDetails'][language](month_index)
    if context['lastTopic']:
        return responses[context['lastTopic']][language](month_index)
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
        query = "Tell me about January 2025 performance"
        response = await process_query(query, [])
        print(response)
    asyncio.run(main())