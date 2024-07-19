%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int yylex(void);
void yyerror(const char *s);
%}

%union {
    char *str;
    int num;
    /* Add other types as needed */
}

/* Tokens */
%token <str> IDENTIFIER STRING_LITERAL
%token <num> NUMERIC_LITERAL
%token TRUE FALSE
%token MOV IF ELSE FOR IMPORT STRUCT SYSCALL HW WHILE
%token STRING INT FLOAT DOUBLE PTR HARDWARE
/* Add other token types as needed */

%type <str> type program bite_list bite block expression logical_expression equality_expression relational_expression additive_expression multiplicative_expression unary_expression primary_expression variable_declaration label_declaration assignment parameter_list label_call argument_list if_bite for_loop import struct property_list property property_name property_value computed_property_name syscall hw
/* Add other non-terminal types as needed */

%%

program
    : bite_list
    ;

bite_list
    : bite
    | bite bite_list
    ;

bite
    : variable_declaration
    | assignment
    | if_bite
    | while
    | expression ';'
    | label_declaration
    | label_call
    | import
    | syscall
    | hw
    | for_loop
    ;

block
    : '{' bite_list '}'
    ;
type
    : STRING
    | INT
    | FLOAT
    | DOUBLE
    | PTR
    | HARDWARE
    ;
expression
    : logical_expression
    ;

logical_expression
    : equality_expression
    | logical_expression '&' '&' equality_expression
    | logical_expression '|' '|' equality_expression
    ;

equality_expression
    : relational_expression
    | equality_expression '=' '=' relational_expression
    | equality_expression '!' '=' relational_expression
    ;

relational_expression
    : additive_expression
    | relational_expression '<' additive_expression
    | relational_expression '>' additive_expression
    | relational_expression '<' '=' additive_expression
    | relational_expression '>' '=' additive_expression
    ;

additive_expression
    : multiplicative_expression
    | additive_expression '+' multiplicative_expression
    | additive_expression '-' multiplicative_expression
    ;

multiplicative_expression
    : unary_expression
    | multiplicative_expression '*' unary_expression
    | multiplicative_expression '/' unary_expression
    | multiplicative_expression '%' unary_expression
    ;

unary_expression
    : primary_expression
    | '+' unary_expression
    | '-' unary_expression
    ;

primary_expression
    : IDENTIFIER
    | NUMERIC_LITERAL
    | STRING_LITERAL
    | TRUE
    | FALSE
    | '(' expression ')'
    | struct
    ;

variable_declaration
    : MOV IDENTIFIER '<' type '>' ',' expression ';'
    ;

label_declaration
    : IDENTIFIER '(' parameter_list ')' ':' '=' block ';'
    ;

assignment
    : MOV IDENTIFIER '<' type '>' ',' expression ';'
    ;
while
    : WHILE '(' expression ')' block ';'
    ;
parameter_list
    : IDENTIFIER
    | parameter_list ',' IDENTIFIER
    ;

label_call
    : IDENTIFIER '(' argument_list ')' ';'
    ;

argument_list
    : expression
    | argument_list ',' expression
    ;

if_bite
    : IF '(' expression ')' block ';'
    | IF '(' expression ')' block ';' ELSE block ';'
    ;

for_loop
    : FOR '(' assignment ',' expression ',' assignment ')' block ';'
    ;

import
    : IMPORT STRING_LITERAL ';'
    ;

struct
    : STRUCT IDENTIFIER '{' property_list '}' ';'
    ;

property_list
    : property
    | property_list ',' property
    ;

property
    : property_name ':' property_value
    ;

property_name
    : IDENTIFIER
    | STRING_LITERAL
    | computed_property_name
    ;

computed_property_name
    : '(' expression ')'
    ;

property_value
    : expression
    | label_declaration
    ;

syscall
    : SYSCALL '(' argument_list ')' ';'
    ;

hw
    : HW IDENTIFIER STRING_LITERAL '(' argument_list ')' ';'
    ;

%%

void yyerror(const char *s) {
    fprintf(stderr, "Error: %s\n", s);
}

int main() {
    yyparse();
    return 0;
}