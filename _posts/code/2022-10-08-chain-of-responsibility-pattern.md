---
title: '[Design Pattern] 책임 연쇄 패턴(Chain of Responsibility Pattern)'
tags: [design-pattern, chain-of-responsibility-pattern]
categories: code
---

책임 연쇄 패턴(Chain of Responsibility Pattern)은 다수의 객체를 체인 형태로 연결하여 처리하는 패턴이다.  
GoF(Gang of Four) Design Pattern 에서 행위(behavioral)에 속한다. 

<!--more-->

책임 연쇄 패턴은 처리 객체들을 집합으로 만들어 클라이언트의 요청을 받는다.  
요청을 받은 객체는 자신이 처리할 지 연결된 다음 객체로 책임을 부여할 지 결정한다.  
이렇게 클라이언트의 요청은 객체들을 순차적으로 회전하면서 처리 객체를 결정하고 실행된다.  

책임 연쇄 패턴은 주로 처리할 수 있는 객체가 여러 개이고 처리 객체가 특정되어 있지 않은 경우 사용한다.

### 구조 

{% include image.html alt="chain of responsibility pattern structure" path="images/code/chain-of-responsibility-pattern/structure.png" %}

{% include image.html alt="chain of responsibility pattern sequence" path="images/code/chain-of-responsibility-pattern/sequence.png" %}

- Handler: 요청을 객체 집합에 전달하는 역할
- ConcreteHandler : 요청을 실제 처리하는 역할


### 장점

-


### 단점




전체 코드는 [깃허브 레포지토리](https://github.com/devyonghee/design-pattern-java/tree/master/singleton) 참고


## 출처
