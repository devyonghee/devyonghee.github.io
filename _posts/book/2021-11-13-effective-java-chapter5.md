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