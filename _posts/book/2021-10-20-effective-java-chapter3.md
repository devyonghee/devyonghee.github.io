---
title: 이펙티브 자바 Chapter3. 모든 객체의 공통 메서드
tags: [book, effective-java]
categories: book
---


이펙티브 자바 3장에서는 `Object` 메서드들 정의에 대해 소개하고 있다.   
모든 클래스는 일반 규약에 맞춰 재정의 해야하는데 어떻게 재정의 해야하는지 알아본다. 

<!--more-->

## 아이템10. `equals`는 일반 규약을 지켜 재정의하라

`equals`는 논리적 동치성 검사가 필요하지만 상위 클래스가 재정의하지 않았을 경우 재정의    
구글의 `AutoValue` or IDE 기능 활용

- `equals` 구현 방법
  1. `==` 연산자로 자기 자신인지 확인 (성능 최적화용)
  2. `instanceof` 연산자로 타입 확인 (`null`도 체크됨)
  3. 올바른 타입으로 형변환
  4. 대응되는 핵심 필드 비교

- `equals` 규약 (어기면 다른 객체에서의 동작을 예상하지 못함)
  - 반사성 : 객체는 자기 자신과 같음
  - 대칭성 : 두 객체가 서로에 대한 동치 여부가 같음
  - 추이성 : `x.equals(y)`, `y.equals(z)` 라면 `x.equals(z)`
  - 일관성 : 두 불변 객체는 같으면 영원히 같음
  - null-아님 : 모든 객체는 `null`과 같지 않음
   
- `equals` 재정의가 필요없는 경우
  - 각 인스턴스가 모두 고유한 경우
  - 논리적 동치성이 필요 없는 경우
  - 상위 클래스에서 재정의했는데 하위에서도 맞는 경우
  - 클래스가 `private`, `package-private`면서 `equals` 호출이 필요없는 경우
  - 값이 같은 인스턴스가 2개 이상 만들어지지 않을 경우 (ex. Enum)
  
- 주의 사항
  - 기본 타입 `==`, 참조 타입 `equals`, `float`은 `Float.compare`, `double`은 `Double.compare` 으로 필드 비교
  - 성능을 위해 다를 가능성이 크거나 **비용이 저렴한** 필드 우선 비교
  - 복잡한 필드를 가진 클래스의 경우 필드의 **표준형**을 저장
  - `equals` 재정의할 때, 반드시 `hashCode`도 재정의
  - 반드시 `Object` 타입을 매개변수로 받아야 함

<br/>

## 아이템11. `equals`를 재정의하려거든 `hashCode`도 재정의하라

- `hashCode` 규약
  - 정보가 변경되지 않는 한, 항상 일관된 값 반환
  - 두 객체가 `equals`로 같다면, `hashCode`도 같은 값 반환 (가장 중요)
  - `equals`로 다르다고 해도 `hashCode`도 같을 필요는 없음
  
- `hashCode` 작성 요령
  1. `int`변수 `result`로 선언하고 첫 비교 필드의 해시코드로 초기화
  2. 기본필드 `Type.hashCode(f)`, 참조 타입 `hashCode` 재귀 호출, `null`은 0, 배열은 `Arrays.hashCode`으로 해시코드 계산
  3. 계산된 해시코드 `result` 할당
  4. `result` 반환
  
- `hashCode` 주의
  - 핵심필드를 생략하면 안됨
  - 생성 규칙을 클라이언트가 의지하지 않도록 자세히 공표하면 안됨  
  
<br/>

## 아이템12. `toString`을 항상 재정의하라

`Obejct`의 기본 `toString`은 아무것도 알려주지 않는다.  
재정의하여 디버깅하기 쉽도록 한다.

- `toString` 권장 사항 
  - 간결하고 사람이 읽기 쉬운 형태의 정보를 제공  
  - 객체의 모든 주요 정보 반환
  - 반환 값의 포맷을 문서화할지 결정 (포맷이 정해지면 변경이 어려움)
  - 포맷 명시하거나 안해거나 의도를 명확하게 표현
  - `toString` 반환 값에 포함된 정보를 얻는 API 명시
  - 하위 클래스들에 공유해야하는 문자열이 있다면 추상클래스도 재정의

- `toString` 재정의가 필요 없는 경우
  - 정적 유틸리티 클래스
  - 열거 타입
  - 상위클래스에서 알맞게 재정의

<br/>
  
## 아이템13. `clone` 재정의는 주의해서 진행하라

- `clone` 문제
  - `clone` 메서드는 `super.clone` 호출하고 내부 객체 필드는 재귀적으로 호출(스택 오버플로 위험)  
  - `final` 한정자를 제거해야할 수 있음
  -  적절한 동기화 처리 필요

- `clone` 대안
  - 복사 생성자 -> 변환 생성자(conversion constructor)  
  - 복사 팩터리 -> 변환 팩터리(conversion factory)
  

<br/>

## 아이템 14. `Comparable`을 구현할지 고려하라

순서가 명확한 값 클래스를 작성한다면 반드시 `Comparable` 구현

- `compareTo` 규약
  - 두 객체를 바꿔 비교해도 예상한 결과가 나와야 함
  - 추이성 → `x.compareTo(y) > 0`, `y.compareTo(z) > 0` 라면 `x.compareTo(z) > 0`
  - 크기가 같은 객체들끼리 비교하면 항상 같아야 함
  
- `compareTo` 권장
  - `<`,`>` 연산자 대신 기본 타입 클래스의 정적 `compare` 메서드 사용
  - `Comparator` 인터페이스가 제공하는 메서드 사용
  