/**
 * Utility for transliterating Devanagari (Hindi) text to Romanized Hindi (Hinglish)
 */

const commonWordsMap: Record<string, string> = {
    // Exact user matches
    'बारिश': 'Barish',
    'की': 'ki',
    'पहली': 'pehli',
    'शाम': 'Shaam',
    'बूंदों': 'boondon',
    'में': 'mein',
    'मिट्टी': 'mitti',
    'खुशबू': 'khushboo',
    'आती': 'aati',
    'है': 'hai',
    'सूखे': 'sookhe',
    'दिल': 'dil',
    'के': 'ke',
    'कोनों': 'konon',
    'एक': 'ek',
    'नई': 'nayi',
    'उम्मीद': 'umeed',
    'जगाती': 'jagati',
    'खिड़की': 'Khidki',
    'पर': 'par',
    'बैठा': 'baitha',
    'चाँद': 'chaand',
    'भी': 'bhi',
    'बादलों': 'baadalon',
    'संग': 'sang',
    'मुस्काता': 'muskaata',
    'भीगी-भीगी': 'bheegi-bheegi',
    'भीगी': 'bheegi',
    'सी': 'si',
    'रातों': 'raaton',
    'कोई': 'koi',
    'अपना': 'apna',
    'याद': 'yaad',
    'आता': 'aata',
    
    // Additional common poetry words
    'प्यार': 'pyar',
    'मोहब्बत': 'mohabbat',
    'जिंदगी': 'zindagi',
    'खुशी': 'khushi',
    'ग़म': 'gham',
    'आँखें': 'aankhein',
    'आँसू': 'aansu',
    'सांस': 'saans',
    'धड़कन': 'dhadkan',
    'सफ़र': 'safar',
    'रास्ता': 'raasta',
    'मंज़िल': 'manzil',
    'नज़ारा': 'nazara',
    'खूबसूरत': 'khoobsoorat',
    'तन्हा': 'tanha',
    'तन्हाई': 'tanhai',
    'मशहूर': 'mashhoor',
    'शायर': 'shayer',
    'कविता': 'kavita',
    'कहानी': 'kahani',
    'अल्फ़ाज़': 'alfaaz',
    'शब्द': 'shabd',
    'आवाज़': 'aawaz',
    'नूर': 'noor',
    'चांदनी': 'chandni',
    'मौसम': 'mausam',
    'हवा': 'hawa',
    'पानी': 'paani',
    'आग': 'aag',
    'आसमान': 'aasmaan',
    'धरती': 'dharti',
    'फूल': 'phool',
    'काँटा': 'kaanta',
    'काँटे': 'kaante',
    'बाग': 'baag',
    'बहार': 'bahaar',
    'वक्त': 'waqt',
    'समय': 'samay',
    'रात': 'raat',
    'दिन': 'din',
    'सुबह': 'subah',
    'रोशनी': 'rooshni',
    'अंधेरा': 'andhera',
    'ख्वाब': 'khwab',
    'सपना': 'sapna',
    'यादें': 'yaadein',
    'दर्द': 'dard',
    'दवा': 'dawa',
    'दुआ': 'dua',
    'इश्क': 'ishq',
    'वफ़ा': 'wafa',
    'बेवफ़ा': 'bewafa',
    'कसम': 'kasam',
    'नफ़रत': 'nafrat',
    'दुनिया': 'duniya',
    'जहान': 'jahaan',
    'खुदा': 'khuda',
    'रब': 'rab',
    'भगवान': 'bhagwaan',
    'इंसान': 'insaan',
    'घर': 'ghar',
    'यार': 'yaar',
    'दोस्त': 'dost',
    'दुश्मन': 'dushman',
    'साथ': 'saath',
    'पास': 'paas',
    'दूर': 'door',
    'सामने': 'saamne',
    'पीछे': 'peeche',
    'ऊपर': 'oopar',
    'नीचे': 'neeche',
    'यहाँ': 'yahaan',
    'वहाँ': 'wahaan',
    'कहाँ': 'kahaan',
    'जहाँ': 'jahaan',
    'वैसे': 'vaise',
    'जैसे': 'jaise',
    'ऐसे': 'aise',
    'कैसे': 'kaise',
    'अब': 'ab',
    'तब': 'tab',
    'जब': 'jab',
    'कब': 'kab',
    'सब': 'sab',
    'क्या': 'kya',
    'क्यों': 'kyun',
    'कौन': 'kaun',
    'कुछ': 'kuch',
    'बहुत': 'bohut',
    'कम': 'kam',
    'ज़्यादा': 'zyada',
    'हैं': 'hain',
    'था': 'tha',
    'थी': 'thi',
    'थे': 'the',
    'हो': 'ho',
    'कर': 'kar',
    'करना': 'karna',
    'होना': 'hona',
    'लिखना': 'likhna',
    'पढ़ना': 'padhna',
    'कहना': 'kehna',
    'सुनना': 'sunna',
    'देखना': 'dekhna',
    'बोलना': 'bolna',
    'चलना': 'chalna',
    'रुकना': 'rukna',
    'आना': 'aana',
    'जाना': 'jaana',
    'पाना': 'paana',
    'खोना': 'khona',
    'हँसना': 'hansna',
    'रोना': 'rona',
    'सोना': 'sona',
    'जागना': 'jaagna',
    'जीना': 'jeena',
    'मरना': 'marna',
    'चाहना': 'chahna',
    'पूछना': 'poochhna',
    'बताना': 'batana'
};

export function transliterateDevanagari(text: string): string {
    if (!text) return '';

    const vowels = {
        'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
        'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'
    };
    
    const matras = {
        'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
        'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', 'ः': 'h'
    };
    
    const consonants = {
        'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'n',
        'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'n',
        'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
        'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
        'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
        'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
        'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gy', 'श्र': 'shr'
    };

    // Helper to process line-by-line using a word map first
    const lines = text.split('\n');
    const processedLines = lines.map(line => {
        // If the line is empty or purely whitespace, preserve it
        if (!line.trim()) return line;

        // Split into words, preserving spaces and punctuation
        const tokens = line.split(/(\s+|[,.!?;:\-()"'\u0964])/g);
        
        const processedTokens = tokens.map(token => {
            if (!token) return '';
            
            // If it's punctuation or whitespace, return as is
            if (/^\s+$/.test(token) || /^[,.!?;:\-()"'\u0964]$/.test(token)) {
                if (token === '\u0964') return '.'; // Hindi purna viram to period
                return token;
            }

            // Clean word for dictionary lookup (removing any trailing vowel signs or modifiers)
            const cleanWord = token.trim();
            if (commonWordsMap[cleanWord]) {
                return commonWordsMap[cleanWord];
            }
            if (commonWordsMap[cleanWord.toLowerCase()]) {
                return commonWordsMap[cleanWord.toLowerCase()];
            }

            // Fallback to character-by-character transliteration
            let result = '';
            let i = 0;
            
            while (i < token.length) {
                const char = token[i];
                
                // Handle non-Devanagari characters directly
                if (char < '\u0900' || char > '\u097F') {
                    result += char;
                    i++;
                    continue;
                }
                
                // Check for conjunct consonants first (e.g. क्ष, त्र, ज्ञ, श्र)
                let matchedConsonant = '';
                let matchedLen = 1;
                
                if (i + 1 < token.length) {
                    const doubleChar = char + token[i+1];
                    if (doubleChar in consonants) {
                        matchedConsonant = consonants[doubleChar as keyof typeof consonants];
                        matchedLen = 2;
                    }
                }
                
                if (!matchedConsonant && char in consonants) {
                    matchedConsonant = consonants[char as keyof typeof consonants];
                }
                
                if (matchedConsonant) {
                    result += matchedConsonant;
                    i += matchedLen;
                    
                    let hasMatra = false;
                    let hasHalant = false;
                    
                    if (i < token.length) {
                        const nextChar = token[i];
                        if (nextChar in matras) {
                            let matraVal = matras[nextChar as keyof typeof matras];
                            
                            // Context-sensitive adjustments for more natural Hinglish
                            if (nextChar === 'ी') {
                                if (['k', 'bh', 'th', 's', 'h', 'd'].includes(matchedConsonant)) {
                                    matraVal = 'i';
                                } else {
                                    matraVal = 'ee';
                                }
                            }
                            
                            result += matraVal;
                            hasMatra = true;
                            i++;
                        } else if (nextChar === '्') {
                            hasHalant = true;
                            i++;
                        }
                    }
                    
                    // Add inherent 'a' sound for consonants in the middle of words
                    if (!hasMatra && !hasHalant) {
                        if (i < token.length) {
                            const nextNextChar = token[i];
                            if (nextNextChar >= '\u0900' && nextNextChar <= '\u097F' && nextNextChar !== '्') {
                                result += 'a';
                            }
                        }
                    }
                    continue;
                }
                
                // Independent Vowels
                if (char in vowels) {
                    result += vowels[char as keyof typeof vowels];
                    i++;
                    continue;
                }
                
                // Matras
                if (char in matras) {
                    result += matras[char as keyof typeof matras];
                    i++;
                    continue;
                }
                
                // Ignore modifiers or append fallback
                if (char !== '़' && char !== '्') {
                    result += char;
                }
                i++;
            }
            
            return result;
        });

        return processedTokens.join('');
    });

    return processedLines.join('\n')
        // Clean up capitalization beautifully
        .replace(/(^\s*|[.!?]\s+|\n\s*)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase())
        // Apply Hinglish specific lowercase formatting for prepositions
        .replace(/\bSe\b/g, 'se')
        .replace(/\bKa\b/g, 'ka')
        .replace(/\bKi\b/g, 'ki')
        .replace(/\bKe\b/g, 'ke')
        .replace(/\bKo\b/g, 'ko')
        .replace(/\bMe\b/g, 'me')
        .replace(/\bMein\b/g, 'mein')
        .replace(/\bNe\b/g, 'ne')
        .replace(/\bHi\b/g, 'hi')
        .replace(/\bBhi\b/g, 'bhi')
        .replace(/\bTha\b/g, 'tha')
        .replace(/\bThee\b/g, 'thi')
        .replace(/\bThi\b/g, 'thi')
        .replace(/\bHai\b/g, 'hai')
        .replace(/\bHain\b/g, 'hain');
}
