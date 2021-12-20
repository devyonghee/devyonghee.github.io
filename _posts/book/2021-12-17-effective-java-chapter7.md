---
title: 이펙티브 자바 Chapter7. 람다와 스트림
tags: [book, effective-java]
categories: book
---


이펙티브 자바 7장에서는 함수 객체를 쉽게 다루기 위한  
함수형 인터페이스, 람다, 메서드 참조 기능을 효과적으로 다루는 방법에 대해 소갠한다.    

<!--more-->

<br/>

## 아이템 42. 익명 클래스보다는 람다를 사용하라

익명클래스 방식은 코드가 너무 길기 때문에 함수형 프로그래밍에 적합하지 않다.  
익명 클래스는 **함수형 인터페이스가 아닌 타입**의 인스턴스 만들때만 사용  

- 람다는 익명 클래스와 개념은 비슷하지만 **코드는 간결**
- 타입을 명시해야 코드가 명확할 때 제외하고 람다의 모든 **매개변수 타입은 생략**
- 람다 자리에 **비교자 생성 메서드**를 사용하면 더 간결 (ex. `String::lenght`)
- 람다는 이름이 없고 문서화도 못하므로 **동작이 명확하지 않거나 코드 줄 수가 길어지면 사용하지 말아야 함** (1줄이 가장 좋고, 3줄 안에 끝나야 함)
- 람다는 직렬화 형태가 다를 수 있어 직렬화하는 일은 삼가야 한다. 필요하다면 `private` 정적 중첩 클래스 사용


<br/>

## 아이템 43. 람다보다는 메서드 참조를 사용하라

메서드 참조가 짧고 명확하다면 메서드 참조 사용, 그렇지 않다면 람다 사용

보통 메서드 참조가 람다보다 더 간결함  
`(count, incr) -> count + incr` -> `Integer::sum`

메서드와 람다가 같은 클래스 안에 있을 경우 람다가 더 짧고 명확
`GoshThisClassNameIsHumongous::action` -> `() -> action()`


### 메서드 참조 유형
- 정적 
  - 예 : `Integer::parseInt`
  - 람다 : `str -> Integer.parseInt(str)`
- 한정적(인스턴스)
  - 예 : `Instant.now()::isAfter`
  - 람다 : `Instant then = Instant.now();  t -> then.isAfter(t)`
- 비한정적(인스턴스)
  - 예 : `String::toLowerCase`
  - 람다 : `str -> str.toLowerCase()`
- 클래스 생성자
  - 예 : `TreeMap<K,V>::new`
  - 람다 : `() -> new TreeMap<K,V>()`
- 배열 생성자
  - 예 : `int[]::new`
  - 람다 : `len -> new int[len]`

