---
title: 이펙티브 자바 Chapter8. 메서드
tags: [book, effective-java]
categories: book
---


이펙티브 자바 8장에서는 메서드 매개변수, 반환값, 시그니처 설계 등  
메서드를 설계할 때 고려해야 할 점들에 대해 소개한다.

<!--more-->

<br/>

## 아이템 49. 매개변수가 유효한지 검사하라

매개변수들의 제약을 고려하고 명시적으로 검사하는 습관을 기르자

### 메서드가 몸체가 **시작되기 전**에 매개변수 제약(`null` 체크 같은)들을 검사해야 한다
- 메서드가 중간에 모호한 예외를 던지며 실패 가능
- 메서드가 수행되지만 잘못된 결과 반환 가능
- 객체를 이상한 상태로 변경하여 알수 없는 시점에 관련 없는 오류 반환

  `public`과 `protected` 메서드는 던지는 예외를 문서화 해야됨  
→ 보통 `IllegalArgumentException`, `IndexOutOfBoundsException`, `NullPointerException`

java7 에 추가된 `Objects.requireNonNull` 메서드,  
java9 에 추가된 `checkFromIndexSize`, `checkFromToIndex`, `checkIndex` 메서드를 사용해도 좋다


### 유효성 검사 규칙 예외
- 유효성 검사 비용이 지나치게 높거나 실용적이지 않음
- 계산과정에서 암묵적으로 검사가 수행
  - 하지만 암묵적인 유효 검사에 너무 의존하면 실패 원자성을 해칠 수 있음
