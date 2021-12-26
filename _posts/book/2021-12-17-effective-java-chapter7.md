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

<br/>

## 아이템 44. 표준 함수형 인터페이스를 사용하라

필요한 용도에 맞는게 있다면 직접 구현하지 말고 표준 함수형 인터페이스를 활용하라 
- api가 다루는 개념이 줄어 익히기 쉬움
- 디폴트 메서드를 많이 제공하여 좋아진 상호운용성


`java.util.function` 패키지에 43개 인터페이스 존재한다.  
표준 인터페이스에 박싱된 기본타입을 넣어 사용하지 말자  

### 대표 기본인터페이스 6가지
- UnaryOperator<T> 
  - ex. `String::toLowerCase`
- BinaryOperator<T>
  - ex. `BigInteger::add`
- Predicate 
  - ex. `Collection::isEmpty`
- Function<T,R>
  - ex. `Arrays::asList`
- Supplier<T>
  - ex. `Instance::now`
- Consumer<T>    
  - ex. `System.out::println`


### 전용 함수형 인터페이스를 구현을 고민해야 하는 경우
- 자주 쓰이며, 이름 자체가 용도를 명확하게 설명
- 반드시 따라야하는 규약 존재
- 유용한 디폴트 메서드를 제공

직접 만든 함수형 인터페이스에는 항상 `@FunctionalInterface` 사용해야 한다.


## 아이템 45. 스트림은 주의해서 사용하라

스트림을 과용하면 가독성이 떨어지고 유지보수가 어려워짐    
람다에서는 타입을 생략하므로 매개변수 이름을 잘지어야 함  
스트림을 사용한 코드가 나아보일 때만 리팩토링 (반복문과 스트림 적절한 조합)  
둘다 해보고 더 나아보이는 방법을 선택하자

### 스트림 api 가 제공하는 추상 개념
- 데이터 원소의 유한 혹은 무한 시퀀스
- 스트림 파이프라인은 원소들로 수행하는 연산 단계를 표현하는 개념

### 스트림 파이프 라인은 지연 평가(lazy evaluation)
- 평가는 종단 연산이 호출 될 때 이루어짐   
  → 종단 연산이 없으면 원소는 안쓰임

### 스트림 api 는 플루언트 api
- 메서드 연쇄를 지원, 하나를 구성하는 모든 호출을 연결하여 하나의 표현식으로 나타냄


### 스트림과 맞지 않는 상황
- 람다에서는 `final` 변수만 읽을 수 있고, 지역변수 변경이 불가능
- `return`으로 메서드를 빠져나가거나, `break`나 `continue` 문 사용할 수 없음
- 메서드 선언에 명시된 검사 예외를 던질 수 없음

### 스트림과 맞는 상황
- 원소들의 시퀀슬를 일관되게 변환
- 원소들의 시퀀스를 필터링
- 원소들의 시퀀스를 하나의 연산을 사용해 결합
- 원소들의 시퀀스를 컬렉션에 모으기
- 원소들의 시퀀스에서 특정 조건에 만족하는 원소 찾기


<br/>

## 아이템 46. 스트림에서는 부작용 없는 함수를 사용하라

외부 상태를 수정하는 람다를 실행하면 문제가 생길 수 있다.  
`forEach` 연산은 스트림 계산 결과를 보고할 때만 사용하고, 계산할 때는 사용하면 안된다.  

### 스트림을 사용하려면 `Collector` 개념을 알고 있는 것이 좋다.  

#### 주요 콜렉터
- `toList` 
- `toSet` 
- `toMap` 
- `groupingBy` 
- `joining` 

### toMap collector
1. toMap(keyMapper, valueMapper)
   - 키에 매핑하는 함수와 값에 매핑하는 함수를 인수로 받음
   - ex. `toMap(Object::toString, e -> e)`
2. toMap(keyMapper, valueMapper, mergeFunction)
   - 키에 연관된 원소들 중 하나를 골라 연관 짓는 맵 만들기
   - ex. `toMap(Album::artist, a -> a, maxBy(comparing(Album::sales)))`   
    → 음악가와 베스트 앨범
3. toMap(keyMapper, valueMapper, mergeFunction, mapFactory)
   - `EnumMap` 이나 `TreeMap`처럼 원하는 특정 맵 구현체 지정

<br/>

## 아이템 47. 반환 타입으로는 스트림보다 컬렉션이 낫다

`Stream`은 `Iterable` 인터페이스가 정의한 방식대로 동작은 하지만, 확장하지는 않아서 `for-each` 구문에 사용될 수 없다.  
반복(`for-each`)을 사용하는게 자연스러워 보여도 `Stream`을 사용하거나 `Iterable`로 변환해주는 어댑터를 이용해야 한다.  

만약, 나중에 자바가 `Stream` 인터페이스에서 `Iterable`을 지원한다면 안심하고 반환해도 될 듯하다.

스트림을 우회하여 반복하기 위한 방법이 있지만 굉장히 난잡하고 직관성이 떨어진다.
```java 
for (ProcessHandle ph : (Iterable<ProcessHandle>)
                         ProcessHandle.allProcesses()::iterator)  {
}
```

`Collection` 인터페이스는 `Iterable` 하위 타입, `stream` 메서드를 제공  
→ 원소 시퀀스를 반환하는 타입은 `Collection` 이나 그 하위 타입이 최선이다. 적절한 컬렉션이 없다면 직접 구현을 고려


<br/>

## 아이템 48. 스트림 병렬화는 주의해서 적용하라


