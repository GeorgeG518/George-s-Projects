/*
 * Driver for OLA 204
 */ 

#include <iostream>
#include <cstring>
#include <cstdlib>
#include <ctime>
#include <typeinfo>

#include "driver.h"

const int nr_tests = 15;
const int DATA_SIZE = 1024; // keep this a power of 2
static char r_data[DATA_SIZE];

void init_data(void)
{
#ifdef DEBUG
    srand(1);
#else
    srand(time(0));
#endif
    
    for (int i = 0; i < DATA_SIZE ; i++) {
        r_data[i] = (rand() % 127) + 1;
    }
    r_data[DATA_SIZE - 1] = 0;
}

// simple test of memcpy (array a -> array b)
int test_memcpy_simple(void)
{
    char b[DATA_SIZE];
    
    ola_memcpy(b, r_data, DATA_SIZE);
    if (memcmp(b, r_data, DATA_SIZE) == 0) {
        return 1; // pass
    } else {
        return 0; // fail
    }
}

// strided memcpy, changing starting points
int test_memcpy_strided(void)
{
    char gold[DATA_SIZE];
    char b[DATA_SIZE];
    int stride = 1;
    
    for (int i = 0; i < 10; i++) {
        stride = 1 << i;
        memset(gold, 0, DATA_SIZE);
        memset(b, 0, DATA_SIZE);
        for (int j = 0; j < (DATA_SIZE / stride); j = j + stride) {
            memcpy(&gold[j], &r_data[j], stride);
            ola_memcpy(&b[j], &r_data[j], stride);
        }
        if (memcmp(b, gold, DATA_SIZE) != 0) {
            return 0;
        } 
    }
    return 1;
}

int test_memset_simple(void)
{
    char b[DATA_SIZE];
    char test[DATA_SIZE] = {0};
    
    memset(b, 2, DATA_SIZE); // init the data
    ola_memset(b, 0, DATA_SIZE); // test the function
    if (memcmp(b, test, DATA_SIZE) == 0) {
        return 1;
    } 
        
    return 0;
}
    
int test_memset_strided(void)
{
    char gold[DATA_SIZE];
    char b[DATA_SIZE];
    int stride = 1;
    
    for (int i = 0; i < 10; i++) {
        stride = 1 << i;
        memset(gold, 0, DATA_SIZE);
        memset(b, 0, DATA_SIZE);
        for (int j = 0; j < (DATA_SIZE / stride); j = j + stride) {
            memset(&gold[j], j, stride);
            ola_memset(&b[j], j, stride);
        }
        if (memcmp(b, gold, DATA_SIZE) != 0) {
            return 0;
        }     
    }

    return 1;
}

int test_memcmp(void)
{
    char b[DATA_SIZE];
    int stride = 1;

    memcpy(b, r_data, DATA_SIZE);

    // equal
    for (int i = 0; i < 10; i++) {
        stride = 1 << i;
        for (int j = 0; j < (DATA_SIZE / stride); j += stride) {
            if (memcmp(&b[j], &r_data[j], stride) 
             != ola_memcmp(&b[j], &r_data[j], stride)) {
                return 0;
            }
        }
    }
    // not equal
    memset(b, 0, DATA_SIZE);
    for (int i = 0; i < 10; i++) {
        stride = 1 << i;
        for (int j = 0; j < (DATA_SIZE / stride); j += stride) {
            if (memcmp(&b[j], &r_data[j], stride) 
             != ola_memcmp(&b[j], &r_data[j], stride)) {
                return 0;
            }
        }
    }
    return 1;
}
   
int test_strcpy_simple(void)
{
    char gold[DATA_SIZE];
    char a[DATA_SIZE];
    char * b, *c;

    b = strcpy(gold, r_data);
    c = ola_strcpy(a, r_data);
    
    if ((strcmp(gold, a) == 0) && (c == a)) {
        return 1;
    }
    return 0;
}

int test_strncpy_simple(void)
{
    char gold[DATA_SIZE];
    char a[DATA_SIZE];
    char * b, *c;
    
    b = strncpy(gold, r_data, DATA_SIZE / 2);
    c = ola_strncpy(a, r_data, DATA_SIZE / 2);
    
    if (memcmp(gold, a, DATA_SIZE / 2) == 0 && c == a) {
        return 1;
    }
    return 0;
}

int test_strchr(void)
{
    char * a, * b;
    
    for (int i = 'A'; i < 'z'; i++) {
        a = strchr(r_data, i);
        b = ola_strchr(r_data, i);
    
        if (a != b) {
            return 0;
        }
    }
    return 1;
}

int test_strrchr(void)
{
    char * a, * b;
    
    for (int i = 'A'; i < 'z'; i++) {
        a = strrchr(r_data, i);
        b = ola_strrchr(r_data, i);
    
        if (a != b) {
            return 0;
        }
    }
    return 1;
}

int test_strcmp(void)
{
    char a[256];
    
    memcpy(a, &r_data[768], 256);
    if (strcmp(a, &r_data[768]) == ola_strcmp(a, &r_data[768])) {
        return 1;
    }
    return 0;
}

int test_strncmp(void)
{
    char a[256];
    
    memcpy(a, &r_data[0], 256);
    if (strncmp(a, &r_data[0], 256) == ola_strncmp(a, &r_data[0], 256)) {
        return 1;
    }
    return 0;
}

int test_strcat(void)
{
    char a[256];
    char b[256];
    char c[256];
    char d[256];
    
    memset(c, 0, 256);
    memset(d, 0, 256);

    strcpy(a, "hi");
    strcpy(b, &r_data[1020]);
    strcat(c, a);
    strcat(c, b);
    ola_strcat(d, a);
    ola_strcat(d, b);

    if (strcmp(c, d) == 0) {
        return 1;
    }

    return 0;
}

int test_strlen(void)
{
    for (int i = 0; i < DATA_SIZE; i++) {
        auto len = ola_strlen(&r_data[i]);
        if (strcmp(typeid(len).name(), "m") != 0) {
            return -1;
        }
        if (len != DATA_SIZE - i - 1) { 
            return 0;
        }
    }
    return 1;
}
 
int test_memchr(void)
{
    void * a, * b;
    
    for (int i = 0; i < 255; i++) {
        a = memchr(r_data, i, DATA_SIZE);
        b = ola_memchr(r_data, i, DATA_SIZE);
    
        if (a != b) {
            return 0;
        }
    }
    return 1;
}

int test_strncat(void)
{
    char a[256];
    char b[256];
    char c[256];
    char d[256];

    memset(c, 0, 256);
    memset(d, 0, 256);
    
    strcpy(a, "hi");
    strcpy(b, &r_data[768]);
    strncat(c, a, 1);
    strncat(c, b, 32);
    ola_strncat(d, a, 1);
    ola_strncat(d, b, 32);

    if (strcmp(c, d) == 0) {
        return 1;
    }

    return 0;
}

int main(int argc, char ** argv)
{
    int (*fn[])(void) = {
                           test_memcpy_simple,
                           test_memcpy_strided,
                           test_memset_simple,
                           test_memset_strided,
                           test_memcmp,
                           test_strcpy_simple,
                           test_strncpy_simple,
                           test_strchr,
                           test_strrchr,
                           test_strcmp,
                           test_strncmp,
                           test_strcat,
                           test_strlen,
                           test_memchr,
                           test_strncat
                        };
    char fn_names[][32] = {
                           "test_memcpy_simple",
                           "test_memcpy_strided",
                           "test_memset_simple",
                           "test_memset_strided",
                           "test_memcmp",
                           "test_strcpy_simple",
                           "test_strncpy_simple",
                           "test_strchr",
                           "test_strrchr",
                           "test_strcmp",
                           "test_strncmp",
                           "test_strcat",
                           "test_strlen",
                           "test_memchr",
                           "test_strncat"
                          };

    init_data();

    std::cout << "OLA 204 Driver: Running tests..." << std::endl;
    for (int i = 0; i < nr_tests; i++) {
        int ret = 0;
        std::cout << "\tTest " << i << " (" << fn_names[i] << "): ";
        ret = fn[i]();
        if (ret == 1) {
            std::cout << "passed!" << std::endl;
        } else {
            std::cout << "failed!" << std::endl;
        }
    }

    return 0;
}
