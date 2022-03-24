#ifndef _ENCRYPT_H
#define _ENCRYPT_H
#include <string>

using namespace std;
/*
	encrypt
	This function takes in a text string and encrypts it using the algorithim described in the OLA2 documentation. This function works off of the assumption that the user has input a valid string of text, as well as a shift	number.Error checking that was in the main program of cipher.cpp helps to double check that this is the case. Encryption works by first making a copy of the string of text in the form of the encrypted_text variable. 
To begin encryption, the program evaluates the Ascii value of the unencrypted text and, depending on what range it is in, branches either to the uppercase section, or the lowercase section.After this, it uses the algorithim of converting letters to their 'indexes' and then adding the shift value to them (the same algorithim from the OLA instructions). The encryption occurs in a while loop  that 'splits' depending on if the letter is upper case or lower case. This determines which version of 'a' will be subtracted from the character (indexing).
The while loop works throught the length of the string and changes individual indices of the encrypted text string. Once it is finished, it returns the encrypted text.

Parameter 1: string text[in]: this is the string of text input by the user in the form of the text file. A copy of this is made for encryption purposes.

Parameter 2: int shift[in]: This is the shift value input by the user, and is added to the cipher_char.

Return: returns string encrypted_text: This is fairly self explanatory. It is a string of text that just so happens to be encrypted.

*/

string encrypt(string text, int shift);

#endif
