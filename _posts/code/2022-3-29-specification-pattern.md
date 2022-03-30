---
title: '[Design Pattern] Specification Pattern'
tags: [design-pattern, visitor-pattern]
categories: code
---

Specification pattern 은 
복잡한 비즈니스 규칙이 있는 불리언 로직을 간단하게 표현할 수 있는 패턴이다.

<!--more-->

Specification pattern 을 이용하면 논리 연산하는 복잡한 로직을 객체지향적으로 표현할 수 있으며,  
하나의 객체로 두고 재활용할 수 있다는 것이 장점이다.

논리연산이 중복되거나 그 의미를 명확하게 표현하고 싶다면 유용하게 사용할 수 있는 패턴이다. 


## 구조

{% include image.html alt="Specification pattern structure" path="images/code/specification-pattern/specification-structure.png" %}

구현하는 방식에 따라 조금씩 차이가 있을 수 있지만 나는 위와 같이 정의했다.  
인터페이스에서 마지막에 참, 거짓을 판단하는 `isSatisfiedBy` 메소드와 논리연산을 하는 `and`, `or`, `not` 을 정의한다.

추상 클래스에서는 논리 연산 메소드드들에서는 각각 알맞는 구현체들을 반환해주고  
구현체들은 본인의 역할에 맞는 `isSatisfiedBy` 만 구현하면 된다.




## 출처
- [https://en.wikipedia.org/wiki/Specification_pattern](https://en.wikipedia.org/wiki/Specification_pattern)