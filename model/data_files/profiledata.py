import random
import time
import re
import asyncio

profile_data = {
    "profiles": {
        "names": ["Bhavin Patel", "Dipesh Karki"],
        "namesHi": ["भाविन पटेल", "दीपेश कार्की"],
        "titles": ["CEO, LenDenClub Platforms", "Co-founder and CPTO, LenDenClub"],
        "titlesHi": ["सीईओ, लेंडेनक्लब प्लेटफॉर्म्स", "सह-संस्थापक और CPTO, लेंडेनक्लब"],
        "locations": ["Mumbai, Maharashtra, India", "Mumbai, Maharashtra, India"],
        "locationsHi": ["मुंबई, महाराष्ट्र, भारत", "मुंबई, महाराष्ट्र, भारत"],
        "summaries": [
            "Co-founded LenDenClub in 2015 with a vision to enhance investor experience. A go-getter entrepreneur with a focus on hard work, discipline, and integrity. Introduced P2P lending in India, built the business base before seeking seed funding. Passionate about football, fitness, mobiles, and cars. Advocates for a flat hierarchy and empathetic team interactions. Aims to disrupt the FinTech space and contribute to the nation.",
            "Co-founded LenDenClub in 2015, focusing on innovating P2P lending through technology. An experienced software developer and product manager with a passion for leadership. Previously developed a piping isometric drawing application (pipeISO) and solutions for license management and data visualization. Enjoys running marathons and has been recognized in BW 40 under 40."
        ],
        "summariesHi": [
            "2015 में लेंडेनक्लब की सह-स्थापना निवेशक अनुभव को बेहतर बनाने के दृष्टिकोण के साथ की। कठिन परिश्रम, अनुशासन और अखंडता पर ध्यान देने वाले उत्साही उद्यमी। भारत में P2P उधार शुरू किया, सीड फंडिंग की तलाश से पहले व्यवसाय का आधार बनाया। फुटबॉल, फिटनेस, मोबाइल और कारों के प्रति उत्साही। समतल पदानुक्रम और सहानुभूतिपूर्ण टीम संवाद के पक्षधर। फिनटेक क्षेत्र में disruption और राष्ट्र में योगदान का लक्ष्य।",
            "2015 में लेंडेनक्लब की सह-स्थापना की, जो प्रौद्योगिकी के माध्यम से P2P उधार में नवाचार पर केंद्रित है। एक अनुभवी सॉफ्टवेयर डेवलपर और उत्पाद प्रबंधक, जो नेतृत्व के प्रति उत्साही हैं। पहले पाइपिंग आइसोमेट्रिक ड्राइंग एप्लिकेशन (pipeISO) और लाइसेंस प्रबंधन और डेटा विज़ुअलाइज़ेशन के लिए समाधान विकसित किए। मैराथन दौड़ने का शौक और BW 40 अंडर 40 में सम्मानित।"
        ],
        "contacts": [
            {"linkedin": "www.linkedin.com/in/bhavingtel2022"},
            {"email": "deepeshkarkee@gmail.com", "linkedin": "www.linkedin.com/in/deepeshkarkee"}
        ],
        "topSkills": [
            ["Corporate Finance", "Structured Finance", "Finance"],
            ["Leadership", "Product Management", "Software Development"]
        ],
        "topSkillsHi": [
            ["कॉर्पोरेट वित्त", "संरचित वित्त", "वित्त"],
            ["नेतृत्व", "उत्पाद प्रबंधन", "सॉफ्टवेयर विकास"]
        ],
        "languages": [
            ["English", "Gujarati", "Hindi", "Spanish (Elementary)"],
            ["Nepali (Native or Bilingual)", "English (Full Professional)", "Hindi (Full Professional)"]
        ],
        "languagesHi": [
            ["अंग्रेजी", "गुजराती", "हिंदी", "स्पेनिश (प्रारंभिक)"],
            ["नेपाली (मूल या द्विभाषी)", "अंग्रेजी (पूर्ण पेशेवर)", "हिंदी (पूर्ण पेशेवर)"]
        ],
        "experiences": [
            [
                {
                    "company": "LenDenClub",
                    "role": "Founder | CEO",
                    "duration": "September 2014 - Present",
                    "durationHi": "सितंबर 2014 - वर्तमान",
                    "location": "Mumbai Area, India",
                    "locationHi": "मुंबई क्षेत्र, भारत",
                    "description": "Leading the company to innovate in P2P lending."
                },
                {
                    "company": "Being Human Clothing",
                    "role": "AVP - Finance (Fund Raise)",
                    "duration": "October 2013 - October 2014",
                    "durationHi": "अक्टूबर 2013 - अक्टूबर 2014",
                    "description": "Managed financial strategies and fund-raising efforts."
                },
                {
                    "company": "Electronica Finance Limited",
                    "role": "Sr. Manager - Structured Finance",
                    "duration": "October 2011 - October 2013",
                    "durationHi": "अक्टूबर 2011 - अक्टूबर 2013",
                    "description": "Oversaw structured finance operations."
                },
                {
                    "company": "SPAN Analytics Pvt Ltd.",
                    "role": "Co-Founder",
                    "duration": "June 2009 - July 2011",
                    "durationHi": "जून 2009 - जुलाई 2011",
                    "location": "Mumbai Area, India",
                    "locationHi": "मुंबई क्षेत्र, भारत",
                    "description": "Co-founded an analytics-focused company."
                }
            ],
            [
                {
                    "company": "LenDenClub",
                    "role": "Co-founder | CPTO",
                    "duration": "July 2015 - Present",
                    "durationHi": "जुलाई 2015 - वर्तमान",
                    "location": "Mumbai Area, India",
                    "locationHi": "मुंबई क्षेत्र, भारत",
                    "description": "Leading technology and product innovation for P2P lending platform."
                },
                {
                    "company": "IDA Business Solutions Pvt Ltd",
                    "role": "Lead Software Developer",
                    "duration": "January 2013 - January 2016",
                    "durationHi": "जनवरी 2013 - जनवरी 2016",
                    "location": "Mumbai Area, India",
                    "locationHi": "मुंबई क्षेत्र, भारत",
                    "description": "Co-founded pipeISO, developed license management and data visualization solutions."
                },
                {
                    "company": "Newgen Software Technologies Limited",
                    "role": "Software Analyst",
                    "duration": "July 2011 - August 2012",
                    "durationHi": "जुलाई 2011 - अगस्त 2012",
                    "description": "Developed workflow and document management solutions for government clients."
                }
            ]
        ],
        "educations": [
            [
                {
                    "institution": "Kirloskar Institute of Advanced Management Studies (KIAMS)",
                    "degree": "PGDM, Marketing & Finance",
                    "degreeHi": "पीजीडीएम, मार्केटिंग और वित्त"
                },
                {
                    "institution": "South Gujarat University",
                    "degree": "Bachelor of Engineering - BE, Electronics & Communication",
                    "degreeHi": "बैचलर ऑफ इंजीनियरिंग - बीई, इलेक्ट्रॉनिक्स और संचार"
                }
            ],
            [
                {
                    "institution": "National Institute of Technology, Kurukshetra, Haryana",
                    "degree": "Bachelor of Technology (BTech), Electronics and Communication Engineering",
                    "degreeHi": "बैचलर ऑफ टेक्नोलॉजी (बीटेक), इलेक्ट्रॉनिक्स और संचार इंजीनियरिंग",
                    "duration": "2007 - 2011",
                    "durationHi": "2007 - 2011"
                }
            ]
        ],
        "certifications": [
            [],
            ["Full Marathon - Mumbai Marathon"]
        ],
        "certificationsHi": [
            [],
            ["पूर्ण मैराथन - मुंबई मैराथन"]
        ],
        "awards": [
            [],
            ["BW 40 under 40"]
        ],
        "awardsHi": [
            [],
            ["BW 40 अंडर 40"]
        ],
        "metrics": [
            {
                "yearsExperience": "Over 15 years",
                "yearsExperienceHi": "15 वर्ष से अधिक",
                "companiesFounded": 2,
                "companiesFoundedHi": "2 कंपनियाँ स्थापित"
            },
            {
                "yearsExperience": "Over 14 years",
                "yearsExperienceHi": "14 वर्ष से अधिक",
                "companiesFounded": 1,
                "companiesFoundedHi": "1 कंपनी स्थापित"
            }
        ]
    },
    "profileIndices": {
        "bhavin": 0,
        "dipesh": 1
    }
}

context = {
    "questionCount": 0,
    "lastTopic": None,
    "lastPersonIndex": None
}

def analyze_context(messages):
    last_user_message = [m['content'].lower() for m in messages if m['sender'] == 'user'][-1:]

    if last_user_message:
        query = last_user_message[0]
        # Determine which person is being queried
        if any(keyword in query for keyword in ['bhavin', 'patel', 'भाविन', 'पटेल']):
            context['lastPersonIndex'] = profile_data['profileIndices']['bhavin']
        elif any(keyword in query for keyword in ['dipesh', 'karki', 'दीपेश', 'कार्की']):
            context['lastPersonIndex'] = profile_data['profileIndices']['dipesh']
        # Determine the topic
        if any(keyword in query for keyword in ['experience', 'career', 'work', 'अनुभव', 'करियर']):
            context['lastTopic'] = 'experience'
        elif any(keyword in query for keyword in ['skills', 'expertise', 'कौशल', 'विशेषज्ञता']):
            context['lastTopic'] = 'skills'
        elif any(keyword in query for keyword in ['education', 'degree', 'शिक्षा', 'डिग्री']):
            context['lastTopic'] = 'education'
        elif any(keyword in query for keyword in ['summary', 'about', 'overview', 'सारांश', 'के बारे में']):
            context['lastTopic'] = 'summary'
        context['questionCount'] += 1

def detect_language(text):
    hindi_pattern = re.compile(r'[\u0900-\u097F]')
    return 'hi' if hindi_pattern.search(text) else 'en'

responses = {
    'greeting': {
        'en': [
            "Hello! I'm here to share details about Bhavin Patel and Dipesh Karki's professional journeys. Who would you like to know about, or what specific topic interests you?",
            "Hi! Curious about Bhavin Patel or Dipesh Karki's careers at LenDenClub? Let me know who or what you're interested in!"
        ],
        'hi': [
            "नमस्ते! मैं यहाँ भाविन पटेल और दीपेश कार्की की पेशेवर यात्राओं के बारे में विवरण साझा करने के लिए हूँ। आप किसके बारे में जानना चाहेंगे, या कौन सा विशिष्ट विषय आपको रुचि देता है?",
            "हाय! भाविन पटेल या दीपेश कार्की के लेंडेनक्लब में करियर के बारे में उत्सुक हैं? मुझे बताएं कि आप किसमें या क्या रुचि रखते हैं!"
        ]
    },
    'summary': {
        'en': lambda person_index: f"Here's an overview of {profile_data['profiles']['names'][person_index]}:\n\n{profile_data['profiles']['summaries'][person_index]}\n\nWhat specific details would you like to dive into?",
        'hi': lambda person_index: f"यहाँ {profile_data['profiles']['namesHi'][person_index]} का अवलोकन है:\n\n{profile_data['profiles']['summariesHi'][person_index]}\n\nआप किन विशिष्ट विवरणों में गहराई से जाना चाहेंगे?"
    },
    'experience': {
        'en': lambda person_index: f"{profile_data['profiles']['names'][person_index]}'s professional experience includes:\n\n" + '\n\n'.join(
            [f"• {exp['role']} at {exp['company']} ({exp['duration']}):\n  {exp['description']}" for exp in profile_data['profiles']['experiences'][person_index]]
        ) + "\n\nWould you like more details about a specific role?",
        'hi': lambda person_index: f"{profile_data['profiles']['namesHi'][person_index]} का पेशेवर अनुभव शामिल है:\n\n" + '\n\n'.join(
            [f"• {exp['company']} में {exp['role']} ({exp['durationHi']}):\n  {exp['description']}" for exp in profile_data['profiles']['experiences'][person_index]]
        ) + "\n\nक्या आप किसी विशिष्ट भूमिका के बारे में अधिक विवरण चाहेंगे?"
    },
    'skills': {
        'en': lambda person_index: f"{profile_data['profiles']['names'][person_index]}'s top skills are:\n\n" + '\n'.join(
            [f"• {skill}" for skill in profile_data['profiles']['topSkills'][person_index]]
        ) + "\n\nInterested in how these skills were applied in their career?",
        'hi': lambda person_index: f"{profile_data['profiles']['namesHi'][person_index]} के शीर्ष कौशल हैं:\n\n" + '\n'.join(
            [f"• {skill}" for skill in profile_data['profiles']['topSkillsHi'][person_index]]
        ) + "\n\nरुचि है कि इन कौशलों का उनके करियर में कैसे उपयोग किया गया?"
    },
    'education': {
    'en': lambda person_index: f"{profile_data['profiles']['names'][person_index]}'s educational background:\n\n" + '\n'.join(
        [f"• {edu['degree']} from {edu['institution']}" + (f" ({edu['duration']})" if edu.get('duration') else '') for edu in profile_data['profiles']['educations'][person_index]]
    ) + "\n\nWant to know more about their academic journey?",
    
    'hi': lambda person_index: f"{profile_data['profiles']['namesHi'][person_index]} की शैक्षिक पृष्ठभूमि:\n\n" + '\n'.join(
        [f"• {edu['institution']} से {edu['degreeHi']}" + (f" ({edu['durationHi']})" if edu.get('durationHi') else '') for edu in profile_data['profiles']['educations'][person_index]]
    ) + "\n\nउनकी शैक्षणिक यात्रा के बारे में और जानना चाहते हैं?"
    },

    'fallback': {
        'en': [
            "Could you clarify who you'd like to know about (Bhavin Patel or Dipesh Karki) or what specific topic (e.g., experience, skills, education)?",
            "I'm here to help! Please specify which person or aspect of their profile you're interested in."
        ],
        'hi': [
            "क्या आप स्पष्ट कर सकते हैं कि आप किसके बारे में जानना चाहते हैं (भाविन पटेल या दीपेश कार्की) या कौन सा विशिष्ट विषय (उदाहरण के लिए, अनुभव, कौशल, शिक्षा)?",
            "मैं मदद के लिए यहाँ हूँ! कृपया निर्दिष्ट करें कि आप किस व्यक्ति या उनके प्रोफाइल के किस पहलू में रुचि रखते हैं।"
        ]
    }
}

def get_random_response(category, language='en', person_index=None):
    options = responses[category][language]
    if callable(options) and person_index is not None:
        return options(person_index)
    return random.choice(options)

def match_keywords(query, messages, language):
    query_lower = query.lower()
    analyze_context(messages)

    person_index = context['lastPersonIndex']
    if any(keyword in query_lower for keyword in ['bhavin', 'patel', 'भाविन', 'पटेल']):
        person_index = profile_data['profileIndices']['bhavin']
    elif any(keyword in query_lower for keyword in ['dipesh', 'karki', 'दीपेश', 'कार्की']):
        person_index = profile_data['profileIndices']['dipesh']

    if any(keyword in query_lower for keyword in ['hello', 'hi', 'नमस्ते', 'हाय']):
        return get_random_response('greeting', language)
    if person_index is None:
        return get_random_response('fallback', language)
    if any(keyword in query_lower for keyword in ['summary', 'about', 'overview', 'सारांश', 'के बारे में']):
        return responses['summary'][language](person_index)
    if any(keyword in query_lower for keyword in ['experience', 'career', 'work', 'अनुभव', 'करियर']):
        return responses['experience'][language](person_index)
    if any(keyword in query_lower for keyword in ['skills', 'expertise', 'कौशल', 'विशेषज्ञता']):
        return responses['skills'][language](person_index)
    if any(keyword in query for keyword in ['education', 'degree', 'शिक्षा', 'डिग्री']):
        return responses['education'][language](person_index)
    if context['lastTopic']:
        return responses[context['lastTopic']][language](person_index)
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
        query = "Tell me about Bhavin's experience"
        response = await process_query(query, [])
        print(response)
    asyncio.run(main())