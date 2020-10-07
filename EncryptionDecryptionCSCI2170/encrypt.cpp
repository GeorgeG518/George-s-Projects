#include "encrypt.h"

std::string encrypt(std::string  text, int shift){
	//Declarations
	std::string encrypted_text;
	char cipher_char;
	int length;
	int i;
	i = 0;
	length = text.length();
	encrypted_text = text;

/*	while loop
	The loop continues along the length acquired from text(identical to encrypted_text). It splits into two different blocks,
	depending on if the text is upper or lowercase. If it is neither (punctuation) it simply increments and continues through the loop.
*/
	while(i<length){
		//Lowercase block
		if((text[i]>=97&&text[i]<=122)){
			cipher_char = int(text[i])-int('a'); 
			cipher_char = (cipher_char + shift)%26;
			encrypted_text[i] = char(cipher_char +'a');
		// Uppercase block
		}else if(text[i]>=65&&text[i]<=90){
			cipher_char = int(text[i])-int('A'); 
			cipher_char = (cipher_char + shift)%26;
			encrypted_text[i] = char(cipher_char +'A');
		}	
		i++;
	}
	return encrypted_text;
}

