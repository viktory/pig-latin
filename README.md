# Assumptions

1. All letters correspond to English Alphabet;
1. 'Y' is always consonant at the beginning of the word;
1. '\s' and '-' are only possible delimiters
1. 'Punctuation-like' characters are all characters except English Alphabet + '\s' + '-' (non-latin, special chars like ',', '.', etc.);

Some settings could be done in `src/PigTransformer/config.ts`

# Additional information
### 'String Based' algorithm
'String Based' algorithm based on character by character processing. I was trying to avoid any additional (second) processing of the same character. However, I don't think such algorithm could be implemented in 100% because:
1. end of the word could affect the beginning, because of `way` postfix first consonant must be placed at the beginning of the word and capitalization must be reset;
2. punctuation depends on the end of the word.
It is my the most favorite algorithm, because it was designed in classical academic way where you have to care about memory and execution time in the first place. But it's not very well-read. 
 
**What could be done:**
Separate result make the algorithm easier: punctuation and capitalization is relied on origin and origin is newer modified. However, separate result reduce the memory usage. So in ideal I would get rid of separate `result` variable.

**Time complexity** - O(n)

**Memory complexity** = 2 * O(n)

### 'Array Based' algorithm
'Array Based' algorithm is opposite to 'String based' and relay on arrays and manipulations with them in 100%. The most "failed" of all. I don't like manipulations with delimiters at all.
 
**What could be done:**
It should not be used at all :smile:.

**Time complexity** - 2 * O(n) + O(m) - if complexity of str.replace is O(n)

**Memory complexity** = 2 * O(n)

### 'Mixed' algorithm
'Mixed' algorithm uses the same word modification as ArrayBased and completely ignores delimiters as StringBases does.

**What could be done:**
1. Result variable could be removed.
2. Punctuation is always be moved in 3 chars to the end of the word (postfix `way` for vowel-words and `firstConsonant+ay` for consonant-words) (if not `way`-ended word). `WordModifierCommand.putSpecialCharacters` could be optimized.

**Time complexity** - O(n)

**Memory complexity** = 2 * O(n)

------
### Development time
Approximate 8-10 hours for bootstrapping the project and all its settings, all 3 types of algorithms and tests. Approximately half of the time was spent on 'StringBased' logic and refactoring.
