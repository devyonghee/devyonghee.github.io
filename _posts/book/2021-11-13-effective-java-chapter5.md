---
title: 이펙티브 자바 Chapter5. 제네릭
tags: [book, effective-java]
categories: book
---


이펙티브 자바 5장 제네릭에 대해서 설명하고 있다.  
이전에는 런타임에 형변환 오류가 나곤 했는데 제네릭을 통해 컴파일 과정에서 방지할 수 있다.   

<!--more-->

<br/>

## 아이템 26. 로 타입은 사용하지 말라

> 로타입 : 제네릭 타입에서 타입 매개변수를 사용하지 않음 (ex. `List<E>`의 로타입은 `List`)

- 로타입은 제네릭이 주는 안전성과 표현력 상실 (호환성 때문에 지원)
  - 컬렉션에 다른 타입을 넣어도 컴파일되고 실행
  - `List<Object>` 는 제네릭 하위 타입 규칙으로 괜찮다. (`List<String>` 이 `List<Object>` 하위 타입이 아님)
  - 실제 타입 매개변수를 신경쓰고 싶지 않다면 와일드 카드 타입(`<?>`) 사용 (`Collection<?>` 에는 `null` 외의 어떤 원소도 추가 불가)

- 로타입 사용 예외
  - `class` 리터럴에 로타입 사용 (ex. `List.class`, `String[].class`, `int.class`)
  - `instanceof` 연산자 사용할 때 와일드 카드는 아무 역할 없어 지저분해지므로 로타입 사용 (ex. `o instanceof Set`)

<br/>

## 아이템 27. 비검사 경고를 제거하라

비검사 경고는 런타임중 `ClassCastException` 일으킬 수 있는 잠재적 가능성을 나타내므로 최대한 제거하라

- 경고를 제거할 수 없지만 타입 안전하다고 확신한다면 `@SuppressWarnings("unchecked")` 달아 경고 숨기자
  - 가능하면 `@SuppressWarnings("unchecked")` 범위는 좁은 범위
  - `return` 문제 필요하다면 메소드에 추가하지말고 지역 변수 선언하여 반환
  - `@SuppressWarnings("unchecked")` 사용한다면 경고를 무시해도 되는 이유를 주석으로 남기자
  
