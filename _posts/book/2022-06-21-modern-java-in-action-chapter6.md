---
title: '[Modern Java in Action] Chapter6. 스트림으로 데이터 수집'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 6장에서는 다양한 요소 누적 방식으로 리듀싱 연산하는 방법에 대해 소개한다.
`collect` 메서드에 범용적인 컬렉터를 전달하여 원하는 연산을 간결하게 구현해본다.  

<!--more-->

<br/>

## 6.1 컬렉터란 무엇인가

`Collector` 인터페이스 구현은 스트림의 요소를 어떻게 결과를 도출할지 지정한다.     
조합성과 재사용도 뛰어나며, 결과를 수집하는 과정을 간단하면서 유연하게 구현할 수 있다는 점이 큰 장점이다.  

`Collector` 에서 제공하는 메서드의 기능은 크게 세 가지가 있다.

- 스트림 요소를 하나의 값으로 리듀스하고 요약
  - 총합, 최대 최소 등 다양한 계산을 수행할 때 활용
- 요소 그룹화
  - 다수준으로 그룹화 하거나 서브그룹에 추가로 리듀싱 연산
- 요소 분할
  - 프레디케이트를 그룹화 함수로 사용



## 6.2 리듀싱과 요약

컬렉터로 스트림의 모든 항목을 하나의 결과로 도출해낼 수 있다.

- `Collectors.counting`
  - 요소의 갯수를 계산
  - 다른 컬렉터와 함께 사용할 때 특히 유용
  - `count()` 로 대체 가능
- `Collectors.maxBy`, `Collectors.minBy`
  - 스트림의 최댓값과 최솟값 계산 가능
  - `Comparator` 를 인수로 받음
- `Collectors.summingInt`, `Collectors.summingLong`, `Collectors.summingDouble`
  - 요약 팩토리 메서드
  - 요소들을 매핑한 값들의 합을 구함 (요약 연산)
  - 객체를 `int`, `long`, `double` 로 매핑하는 함수를 인수로 받음
  - `Collectors.averagingInt` (평균값), `Collectors.summarizingInt` (합계, 평균, 최댓값 등 한번에 계산) 메서드도 존재
- `Collectors.joining`
  - 추출한 모든 문자열을 하나의 문자열로 연결
  - 구분 문자열 추가 가능 (ex. `joining(", ")`)
- `Collectors.reducing`
  - 위의 모든 기능들을 `reducing` 으로도 구현 가능
  - 리듀싱 연산의 시작값, 변환 함수, 두 항목을 하나의 값으로 더하는 `BinaryOperator` 를 인수로 받음


### collect vs reduce

- `collect`
  - 도출하려는 결과를 누적하는 컨테이너를 변경하도록 설계된 메서드
  - 가변 컨테이너를 다루면서 병렬성도 확보 가능
- `reduce`
  - 두 값을 하나로 도출하는 불변형 연산
  - 여러 스레드가 동시에 데이터 구조체를 변경하면 문제가 발생되므로 병렬 수행 불가능 (매번 새로운 리스트를 할당한다면 성능저하)