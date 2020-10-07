#ifndef _OLA_STRING_H
#define _OLA_STRING_H

/* prototypes for all functions to be implemented */
void *       ola_memcpy(void * destination, const void * source, size_t num);
void *       ola_memset(void * ptr, int value, size_t num);
char *       ola_strcpy(char * destination, const char * source);
char *       ola_strncpy(char * destination, const char * source, size_t num);
char *       ola_strcat(char * destination, const char * source);
char *       ola_strncat(char * destination, const char * source, size_t num);
int          ola_memcmp(const void * ptr1, const void * ptr2, size_t num);
int          ola_strcmp(const char * str1, const char * str2);
int          ola_strncmp(const char * str1, const char * str2, size_t num);
void *       ola_memchr(const void * ptr, int value, size_t num);
char *       ola_strrchr(const char * str, int character);
char *       ola_strchr(const char * str, int character);
size_t       ola_strlen(const char * str); 

#endif
