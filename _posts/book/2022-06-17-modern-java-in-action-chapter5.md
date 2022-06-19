---
title: '[Modern Java in Action] Chapter5. 스트림 활용'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 5장에서는 스트림 활용하는 방법에 대해 소개한다.
스트림 API 가 지원하는 연산들에 대해 자세히 알아본다.   

<!--more-->

<br/>

## 5.1 핊터링

스트림 요소를 선택하는 방법

- `filter` 메서드
  - 전체 스트림을 반복
  - `Predicate<T>` 를 인수로 받아 일치하는 모든 요소를 포함하는 스트림 반환
- `distinct` 메서드
  - 고유 요소 필터링, 중복 제거 (`hashCode`, `equals` 로 결정)

<br/>

## 5.2 스트림 슬라이싱 (자바 9)
  
스트림 요소를 선택하거나 스킵하는 방법 

- `takeWhile`
  - `Predicate<T>` 를 인수로 받아 일치하는 요소들을 포함한 스트림 반환
  - `filter` 와 다르게 정렬된 리스트를 대상으로 하여 일치하지 않는 경우 반복 작업을 중단 
- `dropWhile`
  - `takeWhile` 와 반대로 처음으로 일치하지 않는 지점까지의 이전 요소들을 제거하고 남은 모든 요소 반환
- `limit(n)`
  - `long` 타입을 인수로 받아 요소 n 개 반환
- `skip(n)`
  - 처음 `n` 개 요소를 제외한 스트림을 제외한 스트림 반환
  - 주어진 `n` 이 요소의 갯수보다 크면 빈 스트림 반환

<br/>

## 5.3 매핑

특정 객체에서 특정 데이터를 선택하는 기능

- `map`
  - 함수를 인수로 받아 각 요소에 적용. 그 결과는 새로운 요소로 매핑된다.
  - 다른 `map` 메서드와 연결(chaining) 가능
- `flatMap`
  - 스트림의 각 요소들을 다른 스트림으로 만들어서 하나의 스트림으로 연결

<br/>

## 5.4 검색과 매칭

- `anyMatch` 
  - 적어도 한 요소가 주어진 `Predicate` 와 일치하는지 확인
- `allMatch`
  - 모든 요소가 주어진 `Predicate` 와 일치하는지 확인
- `noneMatch`
  - `allMatch` 와 반대 연산
  - 주어진 `Predicate` 와 일치하는 요소가 없는지 확인
- `findAny`
  - 현재 스트림에서 임의의 요소 반환
  - 다른 스트림 연산과 연결해서 사용 가능 
  - `Optional` 반환
- `findFirst`
  - 논리적인 아이템 순서로 정렬된 데이터의 첫번째 요소 반환
  - `Optional` 반환


> 쇼트서킷 평가  
>   
> 자바의 &&, || 와 같은 연산  
> 전체 스트림을 처리하지 않아도 결과 반환 가능  
> 원하는 요소를 찾으면 즉시 결과 반환  
> ex) allMatch, noneMatch, findFirst, findAny, limit...

### `Optional`

- 값의 존재 여부를 표현하는 컨테이너 클래스
- 에러를 일으킬 수 있는 `null` 대신 사용
- 값의 유무에 따라 처리를 강제하는 기능 제공 
  - `isPresent()` : 값이 존재하면 참(`true`), 없으면 거짓(`false`) 반환
  - `ifPresent(Consumer<T> block)` : 값이 존재하면 주어진 블록 실행
  - `T get()` : 값이 존재하면 값 반환, 없으면 `NoSuchElementException` 발생
  - `T orElse(T other)`: 값이 존재하면 값 반환, 없으면 기본값(`other`) 반환

<br/>

## 5.5 리듀싱

스트림의 모든 요소를 반복적으로 처리하여 값으로 도출하는 연산 (종이를 작은 조각이 될 때까지 접는 것과 비슷해서 폴드라고도 부름)

리듀스 인수
- 초깃값
  - 스트림에 요소가 없는 경우가 있기 때문에 초깃값이 없으면 `Optional<T>` 반환
- 스트림의 두 요소를 합쳐서 하나의 값으로 만드는 데 사용할 람다

- 예시
  - 요소의 합
    - `numbers.stream().reduce(0, (a, b) -> a + b);`
      - 초깃값 0
      - 람다 표현식으로 두 요소를 합함
  - 최댓값 최솟값
    - `numbers.stream().reduce(Integer::max);`
    - `numbers.stream().reduce(Integer::min);`

| 연산        | 형식    | 반환 형식       | 함수형 인터페이스 형식           |
|-----------|-------|-------------|------------------------|
| filter    | 중간 연산 | Stream<T>   | Predicate<T>           |
| distinct  | 중간 연산 | Stream<T>   |                        |
| takeWhile | 중간 연산 | Stream<T>   | Predicate<T>           |
| dropWhile | 중간 연산 | Stream<T>   | Predicate<T>           |
| skip      | 중간 연산 | Stream<T>   | long                   |
| limit     | 중간 연산 | Stream<T>   | long                   |
| map       | 중간 연산 | Stream<R>   | Function<T, R>         |
| flatMap   | 중간 연산 | Stream<R>   | Function<T, Stream<R>> |
| sorted    | 중간 연산 | Stream<T>   | Comparator<T>          |
| anyMatch  | 최종 연산 | boolean     | Predicate<T>           |
| noneMatch | 최종 연산 | boolean     | Predicate<T>           |
| allMatch  | 최종 연산 | boolean     | Predicate<T>           |
| findAny   | 최종 연산 | Optional<T> |                        |
| findFirst | 최종 연산 | Optional<T> |                        |
| forEach   | 최종 연산 | void        | Consumer<T>            |
| collect   | 최종 연산 | R           | Collector<T, A, R>     |
| reduce    | 최종 연산 | Optional<T> | BinaryOperator<T>      |
| count     | 최종 연산 | long     |            |


<br/>

## 5.7 숫자형 스트림

스트림 API 에는 박싱 비용을 피하고 효율적으로 처리할 수 있도록 3가지 기본형 특화 스트림(primitive stream specialization)을 제공한다.  

- `IntStream`
- `DoubleStream`
- `LongSteam`

### 기본형 특화 스트림

- 숫자 스트림으로 매핑
  - `mapToInt`
  - `mapToDouble`
  - `mapToLong`
- 객체 스트림으로 복원
  - `boxed`
    - 특화 스트림을 일반스트림으로 변환
- 기본값: Optional 기본형 특화 스트림 버전
  - `OptionalInt`
  - `OptionalDouble`
  - `OptionalLong`

### 숫자 범위

`IntStream`, `LongStream` 에서의 `range`, `rangeClosed` 정적 메서드로 특정 범위의 숫자를 이용할 수 있다.  
두 메서드 모두 첫번째 인수로 시작값, 두번째 인수로 종료값을 받는다.

- `range`
  - 종료값이 포함되지 않음
- `rangeClosed`
  - 종료값이 결과에 포함

