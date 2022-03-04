/*
	George Gannon
	February 17, 2021
	OLA2
	This program iterates over an array and outputs the result of a mathematical expression
(WX)-(Y/Z)
	
	So let's think of the basic algorithm:
	main is going to push zero into rax and rdx
*/

.global main

.data
array:	.quad 16, 4, 3, 5, 12, 5, 2, 1, 3, 6, 7, 10, 5, 2, 4, 3
max_times: .quad 0 /*the code can run a maximum of 4 times*/
position: .quad 0
addition_str:		.ascii	"%ld + %ld = %ld\n\0"
subtraction_str:	.ascii	"%ls - %ls = %ld\n\0"
expr_str:		.ascii	"(%ld * %ld) - (%ld / %ld)\0"
result_str:		.ascii	"= %ld\n\0"
.text
main:
	mov $0, %rax
	mov $0, %rdx
	mov (position), %rbx /*This is a constant register*/
	mov $0, %r13
/*calc_func: Takes 4 arguments in these 4 registers: rdi, rsi, rdx, rcx*/
loop:
	cmp $13, %rbx
	je done
	mov %r13, %r15 /* It's free real estate*/

	mov array(,%r13,8), %rdi
	inc %r13

	mov array(,%r13,8), %rsi/* 8 is one space away, 16 is two, 24 is 3*/	
	inc %r13

	mov array(,%r13,8), %rdx
	inc %r13

	mov array(,%r13,8), %rcx
	inc %r13

	call calc_func
/*
	This is the printing section.
	I will pray for whoever has to try and make sense of it

	I apologize.
*/	
	mov $expr_str, %rdi /* expr_str is the part that will print everything out in one go (minus the answer)*/
	mov array(,%r15,8), %rsi
	inc %r15

	mov array(,%r15,8), %rdx
	inc %r15

	mov array(,%r15,8), %rcx
	inc %r15

	mov array(,%r15,8), %r8 /*I read some documentation that the fifth argumen for a function is r8, so there she is*/ 
	inc %r15
	mov %rax, %r14
	mov $0 , %rax
	call printf

	mov $result_str, %rdi
	mov %r14, %rsi
	mov $0 , %rax
	call printf	

	inc %rbx /* sets the beginning of the array for math*/
	mov %rbx, %r13

	jmp loop
/*calc_func: Takes 4 arguments in these 4 registers: rdi, rsi, rdx, rcx
						      w    x    y   z */

calc_func:
	mov %rdi, %rax
/*
	I push these two on to the stack so that way they aren't overwritten in the math
*/
	PUSH %rdx
	PUSH %rcx

	MUL %rsi
	MOV %rax, %r14
	/*
	answer is stored here
	I did not want to lose it
	I will get it soon
	*/	

/*
	I pop the two off the stack for the math that is going to happen
*/	
	POP %rcx
	POP %rdx
	mov %rdx, %rax
	mov $0 , %rdx
	DIV %rcx

	SUB %rax, %r14
	MOV %r14, %rax
	ret

done:
	ret
