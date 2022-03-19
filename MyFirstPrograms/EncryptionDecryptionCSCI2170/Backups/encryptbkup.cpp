std::string encrypt(std::string text, int shift){
	std::string encrypted_text;
	char cipher_char;
	int i;	

	cipher_char = text[i]-'a';
	cipher_char = (cipher_char + shift)%26;
	encrypted_text[i] = (cipher_char +'a');
	
	return encrypted_text;
}

