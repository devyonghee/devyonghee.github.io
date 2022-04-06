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