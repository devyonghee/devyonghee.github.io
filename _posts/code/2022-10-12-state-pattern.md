---
title: '[Design Pattern] 스테이트 패턴(State Pattern)'
tags: [design-pattern, state-pattern]
categories: code
---

스테이트 패턴(State Pattern)은 내부 상태에 따라 객체의 행위가 변경되는 패턴이다.  
GoF(Gang of Four) Design Pattern 에서 행위(behavioral) 패턴에 속한다. 

<!--more-->

스테이트 패턴은 특정 상태에 따라 다르게 행동하는 객체의 행위를 상태 객체로 위임하는 패턴이다. 
상태를 캡슐화하여 객체화해서 사용하기 때문에 마치 객체의 클래스가 바뀌는 것처럼 보인다.  

상태에 따른 조건 로직이 복잡해지는 경우 복잡도를 낮추는데 유용하게 사용할 수 있다.  
이 상태는 Context 객체 내부에서 관리되고 있으므로 클라이언트의 입장에서는 내부 구조를 알 필요가 없다.  

## 구조 

{% include image.html alt="state pattern structure" path="images/code/state-pattern/structure.png" %}

- Context 
  - 다양한 내부 상태를 지닐 수 있는 객체
  - 사용자가 요청하는 메소드를 구현 (작업은 상태 객체에게 위임)

- State
  - 구현체 인스턴스들에 대한 공통 인터페이스 정의

- ConcreteState
  - 전달된 요청을 실제로 처리하는 역할
  - 요청을 처리하는 방법을 각자 구현 

## 장점

- 각 상태에게 책임을 위임하기 때문에 코드 복잡도 감소 (조건문 제거)
- 구현할 때 상태 객체만 보면되므로 추가, 수정, 삭제가 간단
- 상태에 따른 행위 파악 간단

## 단점

- 상태마다 새로운 클래스가 추가되어 클래스가 많아지므로 유지보수가 어려워질 수 있음

## 구현


전체 코드는 [깃허브 레포지토리](https://github.com/devyonghee/design-pattern-java/tree/master/chain-of-responsibility) 참고

## 출처

- []()
