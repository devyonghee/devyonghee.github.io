---
title: '[Design Pattern] 템플릿 메소드 패턴(Template Method Pattern)'
tags: [design-pattern, template-method-pattern]
categories: code
---

템플릿 메소드 패턴(Template Method Pattern)은 특정 작업 일부분을 서브 클래스로 위임하는 패턴이다.  
GoF(Gang of Four) Design Pattern 에서 행위(behavioral) 패턴에 속하는 패턴이다.

<!--more-->

템플릿 메소드 패턴(Template Method Pattern)은 서브 클래스에서 특정 로직을 구현하여 골격을 정의한다.  
이 패턴을 이용하면 로직의 일부분을 캡슐화하여 구조를 변경하지 않고 특정 단계를 구현할 수 있다.  

전체적인 구조를 상위 클래스에서 정의하면서,   
동작이 다른 부분을 하위 클래스에서 구현하기 때문에 전체적인 구조를 재사용하는데 용이하다.

## 구조 

{% include image.html alt="template method pattern" path="images/code/template-method-pattern/structure.png" %}

- AbstractClass
  - 템플릿 메서드를 정의하는 클래스
  - 하위 클래스에서 수행 할 공통 알고리즘 정의
  - 하위 클래스에서 구현되어야 하는 기능을 추상 메서드로 정의

- ConcreteClass
  - 추상 메서드를 구현하는 클래스
  - 상위 클래스에서 정의된 알고리즘에 구현된 메서드가 적합하게 수행


## 장점


## 단점

## 구현


전체 코드는 [깃허브 레포지토리](https://github.com/devyonghee/design-pattern-java/tree/master/templatemethod) 참고

## 출처

- Head First Design Patterns
