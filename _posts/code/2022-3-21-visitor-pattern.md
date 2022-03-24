---
title: '[Design Pattern] 방문자 패턴(Visitor Pattern)'
tags: [design-pattern, visitor-pattern]
categories: code
---

visitor 는 어떤 장소에 방문하는 사람이라는 의미로  
방문자가 특정 공간에 방문할 때, 적절한 행동을 취한다.
    
<!--more-->

일반적으로 OOP 에서 객체는 스스로 일을 하도록 한다.  
하지만, 그 행위를 분리하여 외부로 분리하는 다양한 패턴들이 존재하는데 비지터 패턴이 그중 하나이다.  

방문자 패턴을 이용하여 데이터 구조와 처리를 분리하게 되면, 
구조를 변경하지 않아도 새로운 연산을 추가할 수 있다.  
즉, 비지터 패턴은 개방-페쇄 원칙을 적용하는 방법중에 하나인 것이다.

알고리즘이 너무 복잡해지거나 자료구조가 너무 많아져서 분리가 필요한 경우,  
같은 자료구조에 알고리즘이 자주 변경되는 경우에 비지터 패턴을 유용하게 사용할 수 있다.

## 구조

{% include image.html alt="비지터 패턴 구조" path="images/code/visitor-pattern/visitor-structure.png" %}

방문자 패턴은 기존의 객체인 `element` 와 `visitor` 로 나눠지게 된다.  
`Visitor` 인터페이스에는 `Element` 의 구현체 종류별로 메소드가 존재한다.  
그러므로 `visitor` 를 구현하는 구현체들은 각 `element` 들을 위한 메소드들을 구현해야 한다.

- Visitor
  - 방문자 클래스의 인터페이스
  - object 구조내의 ConcreteElement 만큼 visit operation 선언
  - `visit(Element)` 를 공용 인터페이스로 사용
- ConcreteVisitor
  - 실제 알고리즘을 가지고 있는 구현체
- Element
  - 방문 공간 클래스의 인터페이스
  - `Visitor` 가 방문하여 수행해야할 대상 (`Visitor.visit(this)` 호출)
  - 방문자들을 수용할 수 있는 `accept(Visitor)` 를 공용 인터페이스로 사용
- ConcreteElement
  - `Element` 의 구현체
- ObjectStructure
  - Element 를 가지고 있는 객체 구조
  - 보통 `Set`, `List`, `CompositeComponent` 가 그 역할

## 장점
- 방문하는 대상(Element)과 작업하는 대상(Visitor) 을 분리한다.
  - 데이터만 담고 있는 자료구조를 만들 수 있음
  - 작업하는 대상은 `visit()` 안에 대상을 받아 처리만 하면 됨
  - 데이터와 알고리즘이 분리되어, 데이터의 독립성 향상

## 단점
- 새로운 방문 대상이 추가되면 모든 작업 대상(Visitor)들의 메소드를 추가해야 함
- `Element` 와 `Visitor`의 양방향 참조로 결합도가 매우 높음

 


## 출처
- https://dailyheumsi.tistory.com/216
- https://thecodinglog.github.io/design/2019/10/29/visitor-pattern.html