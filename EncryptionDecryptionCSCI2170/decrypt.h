#ifndef _DECRYPT_H
#define _DECRYPT_H
#include <string>

using namespace std;
/*
	decrypt
	This function takes in a text string decrypts it using the algorithim described in the OLA2 documentation. This function works off of the assumption that the user has input a valid string of text, as well as a shift number. Error checking in the main program of cipher.cpp ensures this.
As for how exactly it decrypts, it begins by making a copy of the string undecrypted text under the variable decrypted_text. It uses a while loop to work its way through the text's indices, only taking in ASCII values that are in the range of letters[i.e. ignoring spaces and punctuation]. Everything else remains untouched. It also determines if the letter is upper or lowercase to preserve proper cases. Similar to encrypt, it subtracts the letter from the character to get a text index, but with the extra stipulation of if the value is less than zero, 26 is added to it. It finally converts it back to a char of text. Once it is done, it returns the text in a decrypted form.

param1: string text[in] 	This parameter is the same text input by the user. A copy of it is declared in the form of the decrypted_text.

param2: int shift[in]	This parameter is passed by value as it is not going to be modified.

returns: return decrypted_text: The string that is returned is the decrypted copy of the encrypted text that was inputted from the file.
*/

string decrypt(string text, int shift);

#endif
