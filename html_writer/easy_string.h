
static u32 easyString_getSizeInBytes_utf8(char *string) {
    u32 result = 0;
    u8 *at = (u8 *)string;
    while(*at) {
        result++;
        at++;
    }
    return result;
}

static u32 easyString_getStringLength_utf8(char *string) {
    u32 result = 0;
    u8 *at = (u8 *)string;
    while(*at) {
        easyUnicode_utf8ToUtf32((unsigned char **)&at, true);
        result++;
    }
    return result;
}

bool stringsMatchN(char *a, int aLength, char *b, int bLength) {
    bool result = true;
    
    int indexCount = 0;
    while(indexCount < aLength && indexCount < bLength) {
        indexCount++;
        result &= (*a == *b);
        a++;
        b++;
    }
    result &= (indexCount == bLength && indexCount == aLength);
    
    return result;
} 


bool stringsMatchNullN(char *a, char *b, int bLen) {
    bool result = stringsMatchN(a, easyString_getStringLength_utf8(a), b, bLen);
    return result;
}

bool cmpStrNull(char *a, char *b) {
    bool result = stringsMatchN(a, easyString_getStringLength_utf8(a), b, easyString_getStringLength_utf8(b));
    return result;
}