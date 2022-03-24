#include "decrypt.h"

std::string decrypt(std::string  text, int shift){
	// Declarations
	char cipher_char;
	int length;
	int i;
	std::string decrypted_text;
	i = 0;
	length = text.length();
	decrypted_text = text;

	/* while loop
	The loop runs along the length of the length of text (although the length is acquired from the length of text,
	they are identical so it doesn't matter). The loop splits into one of three paths, depending on what the ascii value of text[i] is. 
	Lowercases go to first if statement, uppercases go to the second block, everything else is untouched and i is incremented.
	*/
	while(i<length){
		// Below deals with lower case letters.
		if(text[i]>=97&&text[i]<=122){
			cipher_char = int(text[i])-int('a');
			cipher_char = (cipher_char - shift)%26;
			if ((int)cipher_char<0)
				cipher_char= (int)cipher_char+26;
			decrypted_text[i] = char(cipher_char +'a');

		// Below deals with the upper case letters
		}else if(text[i]>=65&&text[i]<=90){
			cipher_char = int(text[i])-int('A');
			cipher_char = (cipher_char - shift)%26;
			if ((int)cipher_char<0)
				cipher_char= (int)cipher_char+26;
			decrypted_text[i] = char(cipher_char +'A');
		}	
		i++;
	}
	return decrypted_text;
}

