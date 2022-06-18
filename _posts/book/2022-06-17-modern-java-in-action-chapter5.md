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

