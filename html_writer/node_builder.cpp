#define DEBUG_TIME_BLOCK()
#include "easy_types.h"
#include "easy_array.h"
#include "easy_unicode.h"
#include "easy_string.h"
#include "easy_files.h"
#include "easy_arena.h"
#include "easy_lex.h"


typedef struct {
	char *name;
	char *value;
} HtmlStyle;

struct HtmlNode {
	char *nodeType; //Div or Button or <p> etc.

	char *varName;  //The variable name in the code to reference to append as child

	int classCount;
	char *classes[64];

	int styleCount;
	HtmlStyle styles[64];

	int clickCount;
	char *onClickFunctions[64];

	int srcCount;
	char *srcs[64];

		
	//NOTE: 1 Dimensional tree to pop back up to last parent
	HtmlNode *parent;
};


static void pushStyle(HtmlNode *node, char *name, char *value) {
	assert(node->styleCount < arrayCount(node->styles))
	HtmlStyle *style = node->styles + node->styleCount++;

	style->name = name;
	style->value = value;
}

static void pushClass(HtmlNode *node, char *name) {
	assert(node->classCount < arrayCount(node->classes))
	node->classes[node->classCount++] = name;
}

static void pushSrc(HtmlNode *node, char *name) {
	assert(node->srcCount < arrayCount(node->srcs))
	node->srcs[node->srcCount++] = name;
}


static void pushClickFunc(HtmlNode *node, char *name) {
	assert(node->clickCount < arrayCount(node->onClickFunctions))
	node->onClickFunctions[node->clickCount++] = name;
}

typedef struct {
	InfiniteAlloc functionHeader;
	InfiniteAlloc contentsToWrite;
	InfiniteAlloc tempHtmlEncoded;
	InfiniteAlloc jsFilesToAddInFooter;

	InfiniteAlloc inlineVariablesToAdd;	


	HtmlNode *currentNode;

	int inputVariableCount;
	char *inputVariables[64];

	int elementCount; //used as index to create unique elemnts

} FileState;

static HtmlNode *pushHtmlNode(FileState *state, char *nodeType, char *varName) {

	HtmlNode *node = (HtmlNode *)malloc(sizeof(HtmlNode));
	easyMemory_zeroStruct(node, HtmlNode);

	node->nodeType = nodeType;
	node->varName = varName;

	return node;
}

static void pushInputVar(FileState *state, char *name) {
	assert(state->inputVariableCount < arrayCount(state->inputVariables))
	state->inputVariables[state->inputVariableCount++] = name;
}

static void initFileState(FileState *state) {
	state->contentsToWrite = initInfinteAlloc(u8);
	state->tempHtmlEncoded = initInfinteAlloc(u8);
	state->jsFilesToAddInFooter = initInfinteAlloc(char *);
	state->inlineVariablesToAdd = initInfinteAlloc(char *);

	state->functionHeader = initInfinteAlloc(u8);

	state->currentNode = 0;
}

static void outputFile(FileState *state, char *filename) {
	FILE *file = fopen(filename, "wb");

	size_t sizeWritten = fwrite(state->functionHeader.memory, 1, state->functionHeader.count, file);
	assert(sizeWritten == state->functionHeader.count);

	sizeWritten = fwrite(state->contentsToWrite.memory, 1, state->contentsToWrite.count, file);
	assert(sizeWritten == state->contentsToWrite.count);
	
	fclose(file);
}

static u8 *openFileNullTerminate(char *filename) {
	FILE *file = fopen(filename, "rb");

	if(fseek(file, 0, SEEK_END) != 0) {
		assert(false);
	}

	size_t sizeOfFile = ftell(file);

	if(fseek(file, 0, SEEK_SET) != 0) {
		assert(false);
	}	

	//NOTE(ollie): plus one for null terminator
	u8 * result = (u8 *)malloc(sizeof(u8)*(sizeOfFile + 1)); 

	size_t sizeRead = fread(result, 1, sizeOfFile, file);
	if(sizeRead != sizeOfFile) {
		assert(false);
	}

	result[sizeOfFile] = '\0';

	fclose(file);

	return result;

}


int main(int argc, char **args) {
	char *exts[] = { "html" };
	FileNameOfType filesToConvert = getDirectoryFilesOfType(args[1], exts, 1);
	for(int fileIndex = 0; fileIndex < filesToConvert.count; ++fileIndex) {

		FileState state = {0};
		initFileState(&state);

		
		u8 *result = openFileNullTerminate(filesToConvert.names[fileIndex]);

		bool parsing = true;
	    EasyTokenizer tokenizer = lexBeginParsing((char *)result, EASY_LEX_DONT_EAT_SLASH_COMMENTS);

	    HtmlNode *openNode = 0;

	    while(parsing) {
	    	EasyToken token = lexGetNextToken(&tokenizer);
	    	switch(token.type) {
		    	case TOKEN_NULL_TERMINATOR: {
		    		parsing = false;
		    	} break;
		    	case TOKEN_LESS_THAN: {

		    		//< start or end of a node <> or </>
		    		EasyToken nxtToken = lexSeeNextToken(&tokenizer);

		    		if(nxtToken.type == TOKEN_FORWARD_SLASH) {
		    			//Popup a node
		    			state.currentNode = state.currentNode->parent;

		    			//Move past the token
		    			nxtToken = lexGetNextToken(&tokenizer);
		    			assert(nxtToken.type == TOKEN_FORWARD_SLASH);

		    			nxtToken = lexGetNextToken(&tokenizer);

		    			assert(nxtToken.type == TOKEN_WORD);

		    			nxtToken = lexGetNextToken(&tokenizer);
		    			assert(nxtToken.type == TOKEN_GREATER_THAN);
		    		} else if(nxtToken.type == TOKEN_WORD) {
		    			//NOTE(ollie): Eat the token
		    			nxtToken = lexGetNextToken(&tokenizer);


		    			char varNameBuffer[1024];
		    			sprintf_s(varNameBuffer, arrayCount(varNameBuffer), "element%d", (state.elementCount + 1)); //NOTE: Plus one because we haven't incremented it yet

		    			char *varName = nullTerminate(varNameBuffer, easyString_getSizeInBytes_utf8(varNameBuffer));

		    			//NOTE: start of an element
		    			HtmlNode *node = pushHtmlNode(&state, nullTerminate(nxtToken.at, nxtToken.size), varName);

		    			openNode = node;
		    			// printf("%s\n", "openNode");
		    			assert(openNode);

		    			
	    				//NOTE: Can be a parent of other nodes 	
	    				node->parent = state.currentNode;
	    				state.currentNode = node;
		    			
		    			
		    		} 
		    	} break;
		    	case TOKEN_GREATER_THAN: {
		    		// printf("%s\n", "endNode");
		    		//NOTE: end of an element
		    		if(openNode) {
			    			
			    		//NOTE: Output the actual info of the div
			    		state.elementCount++;

			    		//output the info
			    		char *str = "\nlet element";
			    		addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

			    		//Unique element id
			    		char strBuffer[512];
			    		sprintf_s(strBuffer, arrayCount(strBuffer), "%d", state.elementCount);
			    		addElementInifinteAllocWithCount_(&state.contentsToWrite, strBuffer, easyString_getSizeInBytes_utf8(strBuffer));

			    		str = " = document.createElement('";
			    		addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));


			    		addElementInifinteAllocWithCount_(&state.contentsToWrite, openNode->nodeType, easyString_getSizeInBytes_utf8(openNode->nodeType));
			    		
			    		str = "');\n";
			    		addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
			    		//////////////////


			    		for(int i = 0; i < openNode->classCount; ++i) {
			    			char *str = "element";
			    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

			    			//Unique element id
			    			char strBuffer[512];
			    			sprintf_s(strBuffer, arrayCount(strBuffer), "%d", state.elementCount);
			    			addElementInifinteAllocWithCount_(&state.contentsToWrite, strBuffer, easyString_getSizeInBytes_utf8(strBuffer));

			    			str = ".classList.add(\"";
			    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

			    			str = openNode->classes[i];
			    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
							
							str = "\");\n";
							addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
			    				
			    		}

    		    		for(int i = 0; i < openNode->srcCount; ++i) {
    		    			char *str = "element";
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

    		    			//Unique element id
    		    			char strBuffer[512];
    		    			sprintf_s(strBuffer, arrayCount(strBuffer), "%d", state.elementCount);
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, strBuffer, easyString_getSizeInBytes_utf8(strBuffer));

    		    			str = ".src = \"";
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

    		    			str = openNode->srcs[i];
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
    						
    						str = "\";\n";
    						addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
    		    				
    		    		}


    		    		for(int i = 0; i < openNode->clickCount; ++i) {
    		    			char *str = "element";
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

    		    			//Unique element id
    		    			char strBuffer[512];
    		    			sprintf_s(strBuffer, arrayCount(strBuffer), "%d", state.elementCount);
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, strBuffer, easyString_getSizeInBytes_utf8(strBuffer));

    		    			str = ".addEventListener(\"click\", function() { ";
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));


    		    			str = openNode->onClickFunctions[i];
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

    		    			str = " });\n";
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
    		    						
    		    		}


    		    		for(int i = 0; i < openNode->styleCount; ++i) {
    		    			char *str = "element";
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

    		    			//Unique element id
    		    			char strBuffer[512];
    		    			sprintf_s(strBuffer, arrayCount(strBuffer), "%d", state.elementCount);
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, strBuffer, easyString_getSizeInBytes_utf8(strBuffer));

    		    			str = ".style.";
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));


    		    			str = openNode->styles[i].name;

    		    			bool moveLettersUp = false;
    		    			char *at = str;
    		    			char *nullTerminateChar = 0;
    		    			while(*at) {
    		    				if(*at == '-') {
    		    					moveLettersUp = true;
    		    					if((at[1] > 96) && (at[1] < 123)) at[1] ^=0x20;
    		    				} else if(moveLettersUp) {
    		    					char *value = (at - 1);
    		    					*value = *at;
    		    				} 

    		    				if(at[1] == '\0' && moveLettersUp) {
    		    					nullTerminateChar = at;
    		    				}
    		    				at++;
    		    			}

    		    			if(nullTerminateChar) {
    		    				nullTerminateChar[0] = '\0';
    		    			}

    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
    						
    						str = " = '";
    						addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
    		    			
    		    			str = openNode->styles[i].value;
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
    		    			
    		    			str = "';\n";
    		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
    		    						
    		    		}

    		    		//NOTE: add to the parent
    		    		assert(state.currentNode); 

    		    		char *parentVariableName = "parentDiv";//comes into the function as a variable

    		    		if(state.currentNode->parent) {
    		    			parentVariableName = state.currentNode->parent->varName;
    		    		} else {
    		    			//NOTE: Top level node so attach to the input variable called 'parentDiv'
    		    		}


    		    		//output the info
    		    		addElementInifinteAllocWithCount_(&state.contentsToWrite, parentVariableName, easyString_getSizeInBytes_utf8(parentVariableName));

    		    		str = ".appendChild(";
    		    		addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

    		    		addElementInifinteAllocWithCount_(&state.contentsToWrite, state.currentNode->varName, easyString_getSizeInBytes_utf8(state.currentNode->varName));

    		    		str = ");\n";
    		    		addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));




    		    		//There are some html types that can't have children - <img>, <input> etc.

    		    		char *singletoneTags[] = {"img", "input", "area", "br", "hr", "base", "col", "command", "embed", "keygen", "link", "meta", "param", "source", "track", "wbr"};

    		    		bool isSingleton = false;

    		    		for(int i = 0; i < arrayCount(singletoneTags) && !isSingleton; ++i) {
    		    			if(cmpStrNull(singletoneTags[i], openNode->nodeType)) {
    		    				isSingleton = true;
    		    				break;
    		    			}
    		    		}

    		    		if(isSingleton) {
    		    			// pop back up now instead of waiting for a </ characters
    		    			state.currentNode = state.currentNode->parent;
    		    		}
			    	}

			    	// pop back up

		    		openNode = 0;
		    	} break;
		    	case TOKEN_OPEN_BRACKET: {
		    		//NOTE: Inline Variable
		    		assert(!openNode);

		    		EasyToken token = lexGetNextToken(&tokenizer);
		    		assert(token.type == TOKEN_WORD);

		    		char *varName = nullTerminate(token.at, token.size);

		    		addElementInifinteAllocWithCount_(&state.contentsToWrite, state.currentNode->varName, easyString_getSizeInBytes_utf8(state.currentNode->varName));

		    		char *str = ".appendChild(document.createTextNode(";
		    		addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));


		    		addElementInifinteAllocWithCount_(&state.contentsToWrite, varName, easyString_getSizeInBytes_utf8(varName));

		    		str = "));\n";
		    		addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

		    		pushInputVar(&state, varName);

		    		token = lexGetNextToken(&tokenizer);
		    		assert(token.type == TOKEN_CLOSE_BRACKET);
		    	} break;
		    	case TOKEN_WORD: {
		    		if(openNode) {
		    			//NOTE: Get all the classes
		    			if(stringsMatchNullN("class", token.at, token.size)) {
		    				EasyToken token = lexGetNextToken(&tokenizer);
		    				assert(token.type == TOKEN_EQUALS);

		    				token = lexGetNextToken(&tokenizer);
		    				assert(token.type == TOKEN_STRING);

		    				//NOTE: create new tokenizer
	    					bool parsing = true;
	    				    EasyTokenizer tokenizer = lexBeginParsing((char *)(token.at), EASY_LEX_OPTION_EAT_WHITE_SPACE); 

		    				while(*tokenizer.src != '"' && *tokenizer.src != '\'') {
		    					token = lexGetNextToken(&tokenizer);
		    					assert(token.type == TOKEN_WORD);

		    					pushClass(openNode, nullTerminate(token.at, token.size));

		    					tokenizer.src = lexEatWhiteSpace(tokenizer.src);
		    				}

		    			} else if(stringsMatchNullN("src", token.at, token.size)) {
		    				//NOTE: Get the src
		    				EasyToken token = lexGetNextToken(&tokenizer);
		    				assert(token.type == TOKEN_EQUALS);

		    				token = lexGetNextToken(&tokenizer);
		    				assert(token.type == TOKEN_STRING);
		    				
		    				char *name = nullTerminate(token.at, token.size);

		    				pushSrc(openNode, name);
		    				
		    			} else if(stringsMatchNullN("style", token.at, token.size)) {
		    				//NOTE: Get all the styles
		    				EasyToken token = lexGetNextToken(&tokenizer);
		    				assert(token.type == TOKEN_EQUALS);

		    				token = lexGetNextToken(&tokenizer);
		    				assert(token.type == TOKEN_STRING);

		    				//NOTE: create new tokenizer
	    					bool parsing = true;
	    				    EasyTokenizer tokenizer = lexBeginParsing((char *)(token.at), EASY_LEX_OPTION_EAT_WHITE_SPACE); 

	    				    // printf("%s\n", token.at);

		    				while(*tokenizer.src != '"' && *tokenizer.src != '\'') {
		    					token = lexGetNextToken(&tokenizer);
		    					assert(token.type == TOKEN_WORD);
		    					char *name = nullTerminate(token.at, token.size);



		    					token = lexGetNextToken(&tokenizer);
		    					assert(token.type == TOKEN_COLON);

		    					tokenizer.src = lexEatWhiteSpace(tokenizer.src);

		    					char *start = tokenizer.src;

		    					int count = 0;
		    					while(*tokenizer.src != ';' && *tokenizer.src != '"' && *tokenizer.src != '\'' && *tokenizer.src != '\0') {
		    						tokenizer.src++;
		    						count++;
		    					}

		    					char *value = nullTerminate(start, count);

		    					pushStyle(openNode, name, value);

		    					tokenizer.src = lexEatWhiteSpace(tokenizer.src);

		    					token = lexGetNextToken(&tokenizer);
		    					assert(token.type == TOKEN_SEMI_COLON);
		    				}
		    			} else if(stringsMatchNullN("onclick", token.at, token.size)) {
		    				//NOTE: Get all the on clicks
		    				EasyToken token = lexGetNextToken(&tokenizer);
		    				assert(token.type == TOKEN_EQUALS);

		    				token = lexGetNextToken(&tokenizer);
		    				assert(token.type == TOKEN_STRING);

		    				char *lastArgumentAt = 0;

		    				bool hadArguments = false;
		    				bool inArguments = true;
		    				char *strAt = token.at;
		    				while(*strAt != '"' && *strAt != '\0') {

		    					if(*strAt == '(') {
		    						inArguments = true;
		    						lastArgumentAt = &strAt[1];
		    					} else if(*strAt == ',' && inArguments) {
		    						pushInputVar(&state, nullTerminate(lastArgumentAt, strAt - lastArgumentAt));
		    						lastArgumentAt = &strAt[1];
		    						hadArguments = true;

		    						while(*lastArgumentAt == ' ') {
		    							lastArgumentAt++;
		    						}
		    					} else if(*strAt == ')') {
		    						inArguments = false;

		    						if(hadArguments) {
		    							pushInputVar(&state, nullTerminate(lastArgumentAt, strAt - lastArgumentAt));
		    						}
		    					} else if(inArguments && *strAt != ' ') {
		    						hadArguments = true;
		    					}

		    					strAt++;
		    				}

		    				char *value = nullTerminate(token.at, token.size);

		    				pushClickFunc(openNode, value);

		    			}
		    		} else {
		    			printf("%.*s\n", token.size, token.at);
		    			assert(token.type == TOKEN_WORD);

		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, state.currentNode->varName, easyString_getSizeInBytes_utf8(state.currentNode->varName));

		    			char *str = ".appendChild(document.createTextNode(\"";
		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));


		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, token.at, (token.size));

		    			str = "\"));\n";
		    			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

		    		}
		    	} break;
		    	default: {
		    		if(!openNode) {
			    		// assert(false);
			    		printf("%.*s\n", token.size, token.at);
			    		addElementInifinteAllocWithCount_(&state.contentsToWrite, state.currentNode->varName, easyString_getSizeInBytes_utf8(state.currentNode->varName));


			    		char *str = ".appendChild(document.createTextNode(\"";
			    		addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));


			    		addElementInifinteAllocWithCount_(&state.contentsToWrite, token.at, (token.size));

			    		str = "\"));\n";
			    		addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));

		    		}
		    	}
		    }
		}

		char *shortName = (char *)getShortName((u8 *)filesToConvert.names[fileIndex]);
		printf("%s\n", shortName);
		

		{
			char *str = "function meta_create_";
			addElementInifinteAllocWithCount_(&state.functionHeader, str, easyString_getSizeInBytes_utf8(str));

			addElementInifinteAllocWithCount_(&state.functionHeader, shortName, easyString_getSizeInBytes_utf8(shortName));

			str = "(parentDiv, ";
			addElementInifinteAllocWithCount_(&state.functionHeader, str, easyString_getSizeInBytes_utf8(str));

		}

		for(int i = 0; i < state.inputVariableCount; ++i) {
			char *varName = state.inputVariables[i];

			addElementInifinteAllocWithCount_(&state.functionHeader, varName, easyString_getSizeInBytes_utf8(varName));
				
			if(i < (state.inputVariableCount - 1)) {
				char *str = ", ";
				addElementInifinteAllocWithCount_(&state.functionHeader, str, easyString_getSizeInBytes_utf8(str));
			}
		}

		{
			char *str = ") {\n";
			addElementInifinteAllocWithCount_(&state.functionHeader, str, easyString_getSizeInBytes_utf8(str));
		}

		{
			char *str = "\nreturn element1;\n}\n";
			addElementInifinteAllocWithCount_(&state.contentsToWrite, str, easyString_getSizeInBytes_utf8(str));
		}


		//NOTE: Output the resulting file 
		char *outputFileNameA = concat(concat("meta_", shortName), ".js");
		char *outputFileNameB = concat(args[2], outputFileNameA);
		// printf("%s\n", outputFileNameB);
		outputFile(&state, outputFileNameB);	

		//NOTE(ollie): Free all memory for this file
		free(outputFileNameA);
		free(outputFileNameB);
		free(result);
		free(filesToConvert.names[fileIndex]);
		free(shortName);

		////////////////////////////////
	}
}
