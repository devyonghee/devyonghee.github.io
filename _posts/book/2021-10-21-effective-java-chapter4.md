---
title: 이펙티브 자바 Chapter4. 클래스와 인터페이스
tags: [book, effective-java]
categories: book
---


이펙티브 자바 4장에서는 클래스와 인터페이스 설계 요소에 대해 설명하고 있다.   
견고하고 유연한 코드를 위해 자세하게 알아보도록 한다.

<!--more-->

## 아이템15. 클래스와 멤버의 접근 권한을 최소화하라

모든 클래스와 멤버의 접근성을 가능한한 좁혀야 함 (정보 은닉 핵심)  
외부에서 쓸 이유가 없다면 ￿`package-private` 선언

- 권장 사항
  - `public` 클래스의 어떠한 필드도 `public` 이면 안됨 (가변 필드를 가진 클래스는 스레드 안전하지 않음)
  - `public static final` 배열 필드나 이를 반환하는 메서드 제공하면 안됨 (불변 리스트 or 복사본 반환 사용)

- **정보 은닉** 장점
  - 여러 컴포넌트 병렬 개발로 속도 향상
  - 컴포넌트 교체 부담 감소, 빠른 디버깅으로 관리 비용 하락
  - 다른 컴포넌트 영향없이 해당 컴포넌트만 최적화 가능
  - 새로운 환경에서도 유용하게 쓰일 수 있어 재상용성 증가
  - 개변 컴포넌트 동작 검증 가능하여 큰 시스템 제작 난이도 감소

- 접근 범위
  - `private` : 멤버를 선언한 톱레벨 클래스에서만 접근
  - `package-private` : 소속된 패키지 안의 모든 클래스에서 접근 (명시하지 않으면 적) 
  - `protected` : `package-private` 포함, 하위 클래스에서도 접근 
  - `private` : 모든 곳에서 접근
  
<br/>

## 아이템16. `public`클래스에서는 `public`필드가 아닌 접근자 메서드를 사용하라

패키지 바깥에서 접근할 수 있으면 접근자를 제공
`package-private`, `private` 클래스라면 데이터 필드 노출해도 문제 없음

<br/>


  