#include <fstream>
#include <string>
#include <iostream>
#include "encrypt.cpp"

using namespace std;

int main (void){
	char task;
	int shift;
	string file_path;
	ifstream infile;
	string text;	

	string encrypt(string, int);
	
	cout << "Would you like to (e)ncrypt or (d)ecrypt? "; 
	task = cin.get();
	if(task != 'e' &&  task != 'd'){
		cout << "Invalid task. Cannot complete encryption or decryption"<< endl;
		return -1;
	}
	
	//Loops until the Neanderthal puts in a valid shift value.	
	cout << "Enter the shift value: ";
	cin >> shift;
	for (; cin.fail(); ){
		cin.clear();
		cin.ignore(32, '\n');
		cout << "Error. Enter a valid shift value: ";
		cin >> shift;
		}
	
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

	text = " ";
	//Document here later about this loop being the read loop.
	getline(infile,text);
	while (infile.eof()){
		getline(infile,text);
	}


	// After retrieving task and error checking, the program determines if it needs to encrypt or decrypt.
	if (task =='e'){
		cout<<"The encrypted text is:"<< endl;
		encrypt(text, shift);
	}else if(task == 'd'){
		cout<<"The decrypted text is:"<<endl;
	}		
	return 0;
}

