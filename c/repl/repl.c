#include <stdio.h>
#include <stdlib.h>

#include <editline/readline.h>
#include <histedit.h>

static char input[2048]; //Makes a buffer of 2048 characters

int main(int argc, char** argv) {
    puts("JavBrish v0.0.1");
    puts("Press Ctrl+C to Exit\n");
    
    while(1) {
        char* input = readline("javbrish> "); //Prints the prompt and takes input from the user
        add_history(input); //adds the input to the history

        //frees up the buffer "input"
        free(input);
    };

    return 0;
}