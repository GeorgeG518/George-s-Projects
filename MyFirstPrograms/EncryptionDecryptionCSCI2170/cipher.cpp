#include <fstream>
#include <iostream>
#include "encrypt.h"
#include "decrypt.h"
	
/*
 *	main
 *	The main function of the program, it takes no arguments but does return a number. It is responsible for taking in user input, and ensuring that the user does not break the program
 *	by typing in values that would do so. It works off of the assumption that the input file is one line of text, followed by an empty line below it.
 *	
 *	It returns 1 of 2 values: -1 for not putting a valid command code, and 0 for a well functioning execution.
 */


int main (void){
	char task;
	int shift;
	string file_path;
	ifstream infile;
	string text;	

	cout << "Would you like to (e)ncrypt or (d)ecrypt? "; 
	task = cin.get();
	if(task != 'e' &&  task != 'd'){
		cout << "Invalid task. Cannot complete encryption or decryption"<< endl;
		return -1;
	}
	/*
	 *	Shift Block
	 *	Keeps looping until the user puts in a valid integer (not a space, character or something like that). 
	 */

	//Loops until the user puts in a valid shift value.	
	cout << "Enter the shift value: ";
	cin >> shift;
	for (; cin.fail(); ){
		cin.clear();
		cin.ignore(32, '\n');
		cout << "Error. Enter a valid shift value: ";
		cin >> shift;
		}
	//this next part is in case they put in a negative shift value. I.E. 4 to the left is the same as 22 to the right.
	while(shift<0){
		shift+=26;
	}

	/*
	 *	File path block
	 * Keeps looping until the user puts in a valid input path. Prevents a complete restart/shutdown upon the event of a mistype.
	 */
	cout << "Enter the path of the file: ";
	cin >> file_path;
	infile.open(file_path);
	for( ; !infile.good();){
		cin.clear();
		cin.ignore(32, '\n');
		cout << "Error. Invalid path. Enter the path of the file: ";	
		cin >> file_path;
		infile.open(file_path);
	}

	text = "";
	getline(infile,text);

	// After retrieving task and error checking, the program determines if it needs to encrypt or decrypt.
	
	/* Within the if blocks, there are while loops. These are here in case a file is multiple lines long. They prime themselves and read in new text
	 *	until the end of the file is reached.
	 */
	if (task =='e'){
		cout<<"The encrypted text is:"<< endl;
		while(!infile.eof()){
			text=encrypt(text, shift);
			cout << text<<endl;
			getline(infile,text);
		}
	}else if(task == 'd'){
		cout<<"The decrypted text is:"<<endl;
		while(!infile.eof()){
			text = decrypt(text,shift);
			cout << text<<endl;
			getline(infile,text);
		}
	}

	//closes the infile because that's what good people do.
	infile.close();		
	return 0;
}

