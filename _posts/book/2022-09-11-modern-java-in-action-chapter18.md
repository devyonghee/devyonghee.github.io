---
title: '[Modern Java in Action] Chapter18. 함수형 관점으로 생각하기'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 18장에서는 함수형 프로그래밍에 대해 소개한다.   
함수형 프로그래밍이 무엇인지 개념에 대해 자세히 살펴본다.  

<!--more-->

<br/>

## 18.1 시스템 구현과 유지보수

쉽게 유지보수하기 위해서는 클래스 계층으로 반영하는 것이 좋다.  
상호 의존성을 가리키는 결합성(coupling)과 어떤 관계를 갖는지 가리키는 응집성(cohesion)으로 구조를 평가할 수 있는데 
함수형 프로그래밍이 제공하는 부작용 없음(no side effect)과 불변성(immutability)이라는 개념이 도움을 준다. 


### 공유된 가변 데이터

여러 메서드에서 가변 데이터 구조를 읽고 갱신하면 변수는 예상하지 못한 값을 갖게 되어 유지보수가 어려워진다.  
그러므로 클래스, 객체의 상태를 바꾸지 않고 결과를 반환해야 한다. 
이러한 메서드를 순수(pure) 메서드 또는 부작용 없는(side effect free) 메서드라고 한다.  

다음은 부작용의 예다. 
- 자료구조를 고치거나 필드에 값을 할당
- 예외 발생
- 파일에 쓰기 등의 I/O 동작 수행

불변 객체를 이용하면 상태를 변경할 수 없으므로 스레드 안정성도 제공하고, 이러한 부작용도 없앨 수 있다.  

### 선언형 프로그래밍

구현하는 방식은 크게 두가지로 구분할 수 있다. 

- 객체지향 프로그래밍
  - '어떻게(how)' 집중하는 프로그래밍 형식
  - 컴퓨터의 저수준 언어와 비슷한 모습
  - 명령형 프로그래밍
  ```java 
  Transaction mostExpensive = transactions.get(0);
  if (mostExpensive == null) {
       throw new IllegalArgumentException("Empty list of transactions");
  }
  for (Transaction t: transactions.subList(1, transactions.size())) {
       if (t.getValue() > mostExpensive.getValue()) {
           mostExpensive = t;
       }
  }
  ```
- 선언형 프로그래밍
  - '무엇을(what)' 집중하는 방식
  - 질의문 구현방법은 라이브러리가 결정
  - 내부 반복(internal iteration)
  ```java 
  Optional<Transaction> mostExpensive = 
      transactions.stream()
                  .max(comparing(Transaction::getValue));
  ```
  
### 왜 함수형 프로그래밍인가?

- 함수형 프로그래밍은 선언형 프로그래밍을 따르는 방식
- 부작용 없는 계산 지향
- 더 쉽게 시스템을 구현하고 유지보수하는데 도움


<br/>
