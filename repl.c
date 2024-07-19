#include <stdio.h>
#include <stdlib.h>

#include <readline/readline.h>
#include <readline/history.h>

//#include "parse.h"

static char input[2048]; //Makes a buffer of 2048 characters

int main(int argc, char** argv) {
    puts("JavBrish v0.0.1");
    puts("Press Ctrl+C to Exit\n");
    
    while(1) {
        char* input = readline("javbrish> "); //Prints the prompt and takes input from the user
        add_history(input); //adds the input to the history
        /*if (mpcerr != NULL) { //If there is an error, print it
            mpc_err_print(mpcerr);
            mpc_err_delete(mpcerr);
            exit(1);
        }
        mpc_result_t r;
        if (mpc_parse_pipe("<stdin>", stdin, Bite, &r)) { //Parses the input
            mpc_ast_print(r.output); //Prints the parsed input
            mpc_ast_delete(r.output); //Deletes the parsed input
        } else {
            mpc_err_print(r.error); //Prints the error
            mpc_err_delete(r.error); //Deletes the error
        }*/
        //frees up the buffer "input"
        free(input);
    };
    //Cleans up the mpc parsers
    //mpc_cleanup(38, Letter, Number, Special, Expr, Bite, Block, TypeIdent, Ident, BiteList, NumLit, StrLit, BoolLit, Char, VarDec, LabelDec, LogExpr, EquExpr, RelExpr, AddExpr, MulExpr, UnaExpr, PrimExpr, Assign, If, While, For, ParamList, Call, Import, Struct, PropList, Prop, PropName, CompPropVal, PropVal, Syscall, Hw, ArgList);
    return 0;
}