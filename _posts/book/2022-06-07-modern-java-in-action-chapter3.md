---
title: '[Modern Java in Action] Chapter3. 람다 표현식'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 3장에서는 자바 8의 새로운 기능인 람다 표현식에 대해 소개한다.
람다 표현식을 어떻게 만들고, 사용하여 코드를 간결하게 만드는지 자세히 알아보도록 한다. 

<!--more-->

<br/>

## 3.1 람다란 무엇인가?

람다 표현식은 메서드로 전달할 수 있는 익명 함수를 단순화 한 것이다.  

### 람다 특징
- 익명
  - 보통 메서드와 달리 이름이 없음
  - 구현할 코드에 대해 걱정거리 감소
- 함수
  - 특정 클래스에 종속되지 않으므로 함수라고 부름
  - 메서드처럼 파라미터 리스트, 바디, 반환 형식, 가능한 예외리스트는 포함
- 전달
  - 람다 표현식을 메서드 인수로 전달하거나 변수로 저장
- 간결성
  - 익명 클래스처럼 많은 코드가 필요하지 않음

### 람다 구성

``` java 
//       람다 파라미터       // 화살표 //               람다 바디                      // 
(Apple apple1, Apple apple2) -> apple1.getWeight().compareTo(apple2.getWeight());    
```

- 람다 파라미터
  - 메서드 파라미터 (`apple1`, `apple2`)
- 화살표 (`->`)
  - 람다 파라미터와 람다 바디를 구분
- 람다 바디
  - 람다의 반환 값에 해당하는 표현식

### 람다 기본 문법

- 표현식 스타일(expression style) : `(parameters) -> expression`
- 블록 스타일(block style) : `(parameters) -> { statements; }`


<br/>

## 3.2 어디에, 어떻게 람다를 사용할까?


