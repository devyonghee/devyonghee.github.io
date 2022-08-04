---
title: '[Modern Java in Action] Chapter15. CompletableFuture 와 리액티브 프로그래밍 컨셉의 기초'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 15장에서는 동시성 API 에 대해 소개하고 있다.   
CompletableFuture 와 리팩티브 프로그래밍에 대해 자세히 알아본다. 

<!--more-->

소프트웨어 개발 방법을 뒤집는 추세 2가지  

1. 멀티코어 프로세서 발전 
   - 멀티 코어 프로세서 활용하면서 애플리케이션 속도 개선 
2. 인터넷 서비스를 이용하는 애플리케이션 증가
   - 거대한 애플리케이션 대신 작은 애플리케이션 서비스로 나눔

이러한 추세로 서비스간의 상호 작용이 많아지면서 응답을 기다리는 동안 연산이 블록 되거나 CPU 클록 사이클 자원이 낭비된다.   
그래서 자바에서는 연산 자원 낭비를 피하기 위해 다음 두 가지를 제공한다. 

1. `CompletableFuture` (자바 8 추가) 
   - `Future` 인터페이스의 구현체
2. 플로 API (자바 9 추가) 
   - 리액티브 프로그래밍 개념 


