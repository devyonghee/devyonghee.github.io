---
title: '[Modern Java in Action] Chapter3. 람다 표현식'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 3장에서는 자바 8의 새로운 기능인 람다 표현식에 대해 소개한다.
람다 표현식을 어떻게 만들고, 사용하여 코드를 간결하게 만드는지 자세히 알아보도록 한다. 

<!--more-->

<br/>

## 3.1 람다란 무엇인가?

람다 표현식은 메서드로 전달할 수 있는 익명 함수를 단순화 한 것이다.  

### 람다 특징
- 익명
  - 보통 메서드와 달리 이름이 없음
  - 구현할 코드에 대해 걱정거리 감소
- 함수
  - 특정 클래스에 종속되지 않으므로 함수라고 부름
  - 메서드처럼 파라미터 리스트, 바디, 반환 형식, 가능한 예외리스트는 포함
- 전달
  - 람다 표현식을 메서드 인수로 전달하거나 변수로 저장
- 간결성
  - 익명 클래스처럼 많은 코드가 필요하지 않음

### 람다 구성

``` java 
//       람다 파라미터       // 화살표 //               람다 바디                      // 
(Apple apple1, Apple apple2) -> apple1.getWeight().compareTo(apple2.getWeight());    
```

- 람다 파라미터
  - 메서드 파라미터 (`apple1`, `apple2`)
- 화살표 (`->`)
  - 람다 파라미터와 람다 바디를 구분
- 람다 바디
  - 람다의 반환 값에 해당하는 표현식

### 람다 기본 문법

- 표현식 스타일(expression style) : `(parameters) -> expression`
- 블록 스타일(block style) : `(parameters) -> { statements; }`


<br/>

## 3.2 어디에, 어떻게 람다를 사용할까?

### 함수형 인터페이스

함수형 인터페이스란 하나의 추상메서드만 지정하는 인터페이스를 의미한다.  
`Predicate<T>`, `Comparator`, `Runnable` 등이 바로 함수형 인터페이스다.  
**람다 표현식**은 추상 메소드의 구현을 직접 전달하므로 **함수형 인터페이스의 인스턴스**로 취급한다.

```java 
public interface Predicate<T> {
    boolean test (T t);
}
```

> #### @FunctionalInterface
> `@FunctionalInterface` 은 함수형 인터페이스임을 의미하는 애노테이션이다.  
> 이 애노테이션을 추가했는데 추상 메서드가 한 개 이상이라면 컴파일 에러가 발생된다. 

### 함수 디스크립터 (function descriptor)

함수 디스크립터는 람다 표현식의 시그니처(signature)를 서술하는 메서드를 의미한다. 

#### Example
- `() -> void `
  - 파라미터가 없으며, `void` 를 반환하는 함수를 의미
- `(Apple, Apple) -> int`
  - 두 개의 Apple 을 인수로 받아 int 반환하는 함수를 의미

