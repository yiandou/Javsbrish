%{
#include <string.h>
#include "parser.tab.h"

%}
%option noyywrap
%option yylineno
digit       [0-9]
letter      [a-zA-Z]
identifier  ({letter}|_)({letter}|{digit}|_)*
string_literal      \".+\"

%%

"mov"                   { return MOV; }
"if"                    { return IF; }
"else"                  { return ELSE; }
"for"                   { return FOR; }
"import"                { return IMPORT; }
"struct"                { return STRUCT; }
"syscall"               { return SYSCALL; }
"hw"                    { return HW; }
"while"                 { return WHILE; }
"string"                { return STRING; }
"int"                   { return INT; }
"float"                 { return FLOAT; }
"double"                { return DOUBLE; }
"ptr"                   { return PTR; }
"hardware"              { return HARDWARE; }
"true"                  { yylval.num = 1; return TRUE; }
"false"                 { yylval.num = 0; return FALSE; }
{string_literal}        { yylval.str = strdup(yytext); return STRING_LITERAL; }
{identifier}            { yylval.str = strdup(yytext); return IDENTIFIER; }
{digit}+                { yylval.num = atoi(yytext); return NUMERIC_LITERAL; }
"&&"                    { return yytext[0]; }
"||"                    { return yytext[0]; }
"=="                    { return yytext[0]; }
"!="                    { return yytext[0]; }
"<="                    { return yytext[0]; }
">="                    { return yytext[0]; }
"+"                     { return yytext[0]; }
"-"                     { return yytext[0]; }
"*"                     { return yytext[0]; }
"/"                     { return yytext[0]; }
"%"                     { return yytext[0]; }
"<"                     { return yytext[0]; }
">"                     { return yytext[0]; }
"="                     { return yytext[0]; }
"("                     { return yytext[0]; }
")"                     { return yytext[0]; }
"{"                     { return yytext[0]; }
"}"                     { return yytext[0]; }
","                     { return yytext[0]; }
";"                     { return yytext[0]; }
":"                     { return yytext[0]; }
[ \t\n]                 { /* Skip whitespace */ }
.                       { printf("Unrecognized character: %s\n", yytext); }

%%
