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


