---
title: '[Design Pattern] 복합체 패턴(Composite Pattern)'
tags: [design-pattern, visitor-pattern]
categories: code
---

복합체 패턴(Composite Pattern) 은 구조(structural) 패턴 중 하나로   
여러 객체를 지닌 복합 객체와 단일 객체를 동일하게 사용할 수 있는 패턴이다.

<!--more-->

객체를 트리(tree)구조로 구성하여 부분-전체 계층을 표현한다.  
Composite = Composite + Leaf 의 형식으로 재귀적인 특성을 띄고 있다.

## 구조

{% include image.html alt="composite pattern structure" path="images/code/composite-pattern/structure.png" %}

### Component

- 복합 객체(Composite) 와 단일 객체(Leaf)를 동시에 접근하고 관리하기 위한 인터페이스
- 공통적으로 가져야 할 기능들 정의

### Composite

- Component를 통해 자기 자신(Composite) 과 단일 객체(Leaf)들을 관리
- 하위 객체들에 접근하고 요청에 대한 작업을 구현

### Leaf

- 하위 객체가 존재하지 않는 단일 객체
- Component 에서 정의된 메소드들의 기본 작업을 구현

