---
title: '[Modern Java in Action] Chapter4. 스트림 소개'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 4장에서는 스트림에 대해 소개하고 있다.  
스트림에 대해 자세히 알아본다.  

<!--more-->

<br/>

## 4.1 스트림이란 무엇인가?

스트림은 자바 8 에서 추가된 기능으로 컬렉션 데이터를 편하게 처리가 가능하다.  
또한, 멀티 스레드 코드 구현 없이 간편하게 병렬로도 처리가 가능하다.  

### 장점
- 선언형으로 코드 구현 가능
  - 루프, `if` 조건문 등 제어블록을 이용한 동작 구현 없이 동작의 수행만을 지정할 수 있음
  - 선언형 코드와 동작 파라미터화를 활용하면 유연하게 대응 가능
- 복잡한 데이터 처리 파이프 라인 생성 가능(ex. `filter`, `sorted`, `map`...)
  - 가독성과 명확성 유지

### 특징
- 선언형
  - 더 간결하고 가독성 향상
- 조립 가능
  - 유연성 향상
- 병렬화
  - 성능 향상

> 컬렉션 제어하는데 도움이 되는 라이브러리
> - 구아바(Guava)
> - 멀티맵 (Multimap)
> - 멀티셋(Multiset)
> - 아파치 공통 컬렉션(Apache Commons Collections)
> - 람다제이(lambdaj)

## 4.2 스트림 시작하기

스트림은 데이터 처리 연산을 지원하도록 소스에서 추출된 연속된 요소를 의미한다.

- 연속된 요소
  - 특정 요소 형식으로 이루어진 연속된 값 집합의 인터페이스 제공
  - `filter`, `sorted`, `map` 같은 표현 계산식 위주
  - 컬렉션의 주제는 데이터, 스트림은 계산
- 소스
  - 스트림은 데이터 제공 소스로부터 데이터를 소비한다.
  - 정렬된 컬렉션으로 스트림을 생성하면 같은 순서를 유지
- 데이터 처리 연산
  - 일반적인 연산과 데이터베이스 비슷한 연산들을 지원
  - `filter`, `map`, `reduce`, `find`, `match`, `sort` 등 지원
  - 순차 또는 병렬로 실행 가능

### 스트림 특징

- 파이프라이닝(pipelining)
  - 대부분의 연산이 자신을 반환하여 파이프라인 구성 가능
  - laziness, short-circuiting 같은 최적화 가능
- 내부 반복

## 4.3 스트림과 컬렉션

- 계산 시점
  - 컬렉션 : 자료구조가 포함하는 모든 값을 메모리에 저장 (컬렉션의 모든 요소는 컬렉션에 추가하기 전에 계산)
  - 스트림 : 요청할 때만 요소를 계산하는 고정된 자료구조 (요소를 추가하거나 제거 불가, 게으른 생성) 
- 탐색
  - 컬렉션 : 데이터 소스 반복 사용 가능 
  - 스트림 : 한번만 탐색 가능, 탐색된 요소는 소비 (다시 사용하려면 새로운 스트림 생성 필요)
- 반복 처리
  - 컬렉션 : 사용자가 직접 요소를 반복(외부 반복, external iteration)
    - 병렬성을 스스로 관리해야 함
  - 스트림 : 어떤 작업을 수행할지만 지정하면 알아서 처리 (내부 반복, internal iteration)
    - 병렬성 구현을 자동으로 선택 가능
    - 반복 과정을 신경쓰지 않아도 됨


{% include image.html alt="internal and external iteration" source_txt='모던 자바 인 액션' path="images/book/modern-java-in-action/internal-external-iteration.png" %}


## 4.4 스트림 연산

- 중간 연산(intermediate operation): 연결할 수 있는 스트림 연산
  - 중간 연산을 연결해서 질의 생성
  - 단말 연산을 스트림 파이프라인에 실행하기 전까지 연산을 수행하지 않음(최종 연산으로 한번에 처리)
- 최종 연산(terminal operation): 스트림을 닫는 연산
  - 파이프라인에서 결과 도출

### 스트림 이용 과정 (builder pattern 과 비슷)
- 질의를 수행할 데이터 소스
- 스트림 파이프라인을 구성할 중간 연산 연결
- 스트림 파이프라인을 실행하고 결과를 만들 최종 연산

| 연산       | 형식    | 반환 형식         | 
|----------|-------|---------------|
| `filter`  | 중간 연산 | `Stream<T>`     |
| `map`     | 중간 연산 | `Stream<T>`     |
| `limit`   | 중간 연산 | `Stream<T>`     |
| `sorted`  | 중간 연산 | `Stream<T>`     |
| `distinct` | 중간 연산 | `Stream<T>`     |
| `forEach` | 최종 연산 | `void`          |
| `count`   | 최종 연산      | `long(generic)` |
| `collect` |  최종 연산     |               |


