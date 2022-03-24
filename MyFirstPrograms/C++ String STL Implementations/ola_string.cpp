#include <iostream>

void * ola_memcpy(void * destination, const void * source, size_t num){
	char * a = (char*) destination;
	char * b = (char*) source;
	for(int i=0;i<num;i++){
		a[i]=b[i];
	}
	return destination;
	
}

void * ola_memset(void * ptr, int value, size_t num){
	char * dest = (char *) ptr;
	for (int i=0; i<num; i++){
		dest[i]=value;
	}
	return ptr;
	
}

char * ola_strcpy(char * destination, const char * source){
	size_t i=0;
	destination[i]=source[i];
	while(source[i] != '\0'){
		destination[i]=source[i];
		i++ ;
	}
	return destination;
}

char * ola_strncpy(char * destination, const char * source, size_t num){
	size_t byte=0;
	
	while( (byte< num) && (destination[byte] != '\0') ){
		destination[byte]=source[byte];
		byte++;
	}
	while(byte<num){
		destination[byte]='\0';
	}
	
	return destination;	
}

char * ola_strcat(char * destination, const char * source){
	size_t place =0; //like the end character
	size_t i = 0;
	
	while(destination[place] != '\0'){
		place++;
	}
	
	destination[place+i]=source[i];
	while(source[i] != '\0'){
		destination[place+i]=source[i];
		i++;
	}
	destination[place+i]='\0';
	return destination;
}

char * ola_strncat(char * destination, const char * source, size_t num){
	size_t place =0; //like the end character
	size_t i = 0;
	
	while(destination[place] != '\0'){
		place++;
	}
	
	for (i; (source[i]!='\0')&&(i<num); i++){
		destination[place+i]=source[i];
	}
	destination[place+i]='\0';
	return destination;
}

int ola_memcmp(const void * ptr1, const void * ptr2, size_t num)
{
	char * a = (char*) ptr1;
	char * b = (char*) ptr2;
	int diff =0;

	for(int i=0; i<num; i++){
		if(a[i] != b[i]){
			diff = a[i]-b[i];
			return diff;
		}
	}
	return diff;
}

int ola_strcmp(const char * str1, const char * str2){
	char * a = (char*) str1;
	char * b = (char*) str2;
	int diff =0;
	int i=0;

	while(str1[i] != '\0'){
		if(a[i] != b[i]){
			diff = a[i]-b[i];
			return diff;
		}
		i++;
	}
	return diff;
	
}

int ola_strncmp(const char * str1, const char * str2, size_t num){
	char * a = (char*) str1;
	char * b = (char*) str2;
	int diff =0;

	for(int i=0; i<num; i++){
		if(a[i] != b[i]){
			diff = a[i]-b[i];
			return diff;
		}
	}
	return diff;
}

void *       ola_memchr(const void * ptr, int value, size_t num)
{
	char * a = (char*) ptr;
	char * b = 0;
	
	for(int i=0; i< num; i++)
	{
		if(a[i] == value){
			b = & a[i];
			break;
		}
	}
	return b;
	
	
}

char * ola_strchr(const char * str, int character){
	char * a = (char * ) str;
	char * inx_ptr =0;
	int i=0;
	
	while(a[i] != '\0')
	{
		if(a[i]==character){
			inx_ptr= & a[i];
			break;
		}else{
		i++;
		}
	}
	return inx_ptr;
	
}

char * ola_strrchr(const char * str, int character){
	char * a = (char * ) str;
	char * inx_ptr =0;
	
	int place = 0;
	while(a[place] != '\0'){
		place++;
	}
	
	while(place != 0)
	{
		if(a[place]==character){
			inx_ptr= & a[place];
			break;
		}else{
		place--;
		}
	}
	return inx_ptr;

}

size_t ola_strlen(const char * str){
	const char *size =0;
	
	for(size=str; ; ++size)
		if(*size =='\0')
			return (size_t) (size-str);
}