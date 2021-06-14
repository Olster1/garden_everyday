#include <shlwapi.h>

#define concat_withLength(a, aLength, b, bLength) concat_(a, aLength, b, bLength)
#define concat(a, b) concat_(a, easyString_getSizeInBytes_utf8(a), b, easyString_getSizeInBytes_utf8(b))
char *concat_(char *a, s32 lengthA, char *b, s32 lengthB) {
    int aLen = lengthA;
    int bLen = lengthB;
    
    int newStrLen = aLen + bLen + 1; // +1 for null terminator
    char *newString = 0;
    newString = (char *)calloc(newStrLen, 1); 
    assert(newString);
    
    newString[newStrLen - 1] = '\0';
    
    char *at = newString;
    for (int i = 0; i < aLen; ++i)
    {
        *at++ = a[i];
    }
    
    for (int i = 0; i < bLen; ++i)
    {
        *at++ = b[i];
    }
    assert(at == &newString[newStrLen - 1])
    assert(newString[newStrLen - 1 ] == '\0');
    
    return newString;
}

static u8 *getShortName(u8 *begin) {
    u8 *at = begin;

    u8 *lastStart = at; 
    while(*at) {
        if(*at == '\\' || *at == '/') {
            at++;
            lastStart = at; 
        } else {
            at++;    
        }
    }

    u32 sizeTillDot = 0;

    at = lastStart;

    while(*at) {
        if(at[0] == '.') {
            break;
        } else {
            sizeTillDot++;
            at++;
        }
        // printf("%s\n", "Infinte 1");
    }

    u8 *result = (u8 *)malloc(sizeTillDot + 1);

    memcpy(result, lastStart, sizeTillDot);
    //NOTE(ollie): Null terminate the string
    result[sizeTillDot] = '\0';

    return result;
}


char *getFileExtension(char *fileName) {
    char *result = fileName;
    
    bool hasDot = false;
    while(*fileName) {
        if(*fileName == '.') { 
            result = fileName + 1;
            hasDot = true;
        }
        fileName++;
    }
    
    if(!hasDot) {
        result = 0;
    }
    
    return result;
}


typedef struct {
    char *names[256]; //max 32 files
    int count;
} FileNameOfType;

bool isInCharList(char *ext, char **exts, int count) {
    bool result = false;
    for(int i = 0; i < count; i++) {
        if(cmpStrNull(ext, exts[i])) {
            result = true;
            break;
        }
    }
    return result;
}


typedef enum {
    DIR_FIND_FILE_TYPE,
    DIR_DELETE_FILE_TYPE,
    DIR_FIND_DIR_TYPE,
    DIR_COPY_FILE_TYPE,
} DirTypeOperation;

#ifdef _WIN32
#include <windows.h>
static HANDLE FindFirstFileInDir(char *dirName, WIN32_FIND_DATAA *fileFindData) {
    char fileName[MAX_PATH] = "";
    /* remove '..' sections in path name */
    if (PathCanonicalizeA(fileName, dirName) == FALSE)
        return INVALID_HANDLE_VALUE;
    /* add directory separator + * to get files in the directory */
    if (strlen(fileName) + 2 > MAX_PATH)
        return INVALID_HANDLE_VALUE;
    if (fileName[strlen(fileName)-1] != '/')
        strcat(fileName, "/");
    strcat(fileName, "*");
    return FindFirstFileA(fileName, fileFindData);
}
#endif

static FileNameOfType getDirectoryFilesOfType_(char *dirName, char *copyDir, char **exts, int count, DirTypeOperation opType) { 
    FileNameOfType fileNames = {0};
    #ifdef __APPLE__
        DIR *directory = opendir(dirName);
        if(directory) {
            struct dirent *dp = 0;
    #elif _WIN32
        WIN32_FIND_DATAA fileFindData;
        HANDLE dirHandle = FindFirstFileInDir(dirName, &fileFindData);
        if(dirHandle != INVALID_HANDLE_VALUE) {
            BOOL findResult = true;
            bool firstTurn = true;
    #else 
        assert(!"not implemented");
    #endif
               do {
                
#if __APPLE__
                dp = readdir(directory);
                if (dp) {
                    char *name = dp->d_name;
#elif _WIN32
                if(!firstTurn) {
                    findResult = FindNextFileA(dirHandle, &fileFindData);
                } else {
                    firstTurn = false;
                }
                if(findResult != 0) {
                    char *name = fileFindData.cFileName;
#else 
assert(!"not implemented");
#endif
                        char *fileName = concat(dirName, name);
                        char *ext = getFileExtension(fileName);
                        switch(opType) {
                            case DIR_FIND_FILE_TYPE: {
                                if(isInCharList(ext, exts, count)) {
                                    assert(fileNames.count < arrayCount(fileNames.names));
                                    fileNames.names[fileNames.count++] = fileName;
                                }
                            } break;
                           default: {

                           }
                        }
                   }
#if __APPLE__
               } while (dp);
#elif _WIN32
               } while (findResult);
#else
               assert(!"not implemented");
#endif
#if __APPLE__
            closedir(directory);
#elif _WIN32
            FindClose(dirHandle);
#else 
            assert(!"not implemented");
#endif
        }

    return fileNames;
}


#define getDirectoryFilesOfType(dirName, exts, count) getDirectoryFilesOfType_(dirName, 0, exts, count, DIR_FIND_FILE_TYPE)
#define deleteAllFilesOfType(dirName, exts, count) getDirectoryFilesOfType_(dirName, 0, exts, count, DIR_DELETE_FILE_TYPE)
#define copyAllFilesOfType(dirName, copyDir, exts, count) getDirectoryFilesOfType_(dirName, copyDir, exts, count, DIR_COPY_FILE_TYPE)
#define getDirectoryFolders(dirName) getDirectoryFilesOfType_(dirName, 0, 0, 0, DIR_FIND_DIR_TYPE)