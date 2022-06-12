---
title: 이펙티브 자바 Chapter9. 일반적인 프로그래밍 원칙
tags: [book, effective-java]
categories: book
---


이펙티브 자바 8장에서는 지역변수, 제어구조, 라이브러리 등    
자바 언어 핵심 요소에 대해 소개한다.

<!--more-->

<br/>

## 아이템 57. 지역변수의 범위를 최소화하라 

- 지역 변수는 처음 쓰일 때 선언하라
  - 미리 선언하면 코드가 어수선, 초기값 기억 못함
- 모든 지역변수는 선언과 동시에 초기화
  - `try-catch` 문은 예외   
- 변수의 값을 반복문이 종료되어도 사용하는 상황이 아니라면 `while` 보다 `for` 문 사용
  - `for` 키워드는 반복변수의 범위를 최소화
- 메서드를 작게 유지하고 한가지 기능에 집중하여 지역범위 최소화


<br/>

## 아이템 58. 전통적인 `for`문 보다는 `for-each` 문을 사용하라

`for-each`문은 반복자와 인덱스 변수를 사용하지 않아 코드가 깔끔하고 오류 예방  
성능 저하도 없기 때문에 가능하면 `for`문 보다는 `for-each` 이용

### `for-each` 사용할 수 없는 경우
- 파괴적인 필터링(destructive filtering)
  - 특정 원소를 제거하는 경우 반복자의 `remove` 메서드 호출 불가
  - `Collection`의 `removeIf` 메서드를 이용할 순 있음
- 변형 (transforming)
  - 원소의 값을 교체해야 한다면 반복자나 인덱스 사용 필요  
- 병력 반복(parallel iteration)
  - 병렬로 순회해야 한다면 반복자와 인덱스 변수를 사용해 명시적으로 제어해야 함
  
<br/>

## 아이템 59. 라이브러리를 익히고 사용하라

- 메이저 릴리즈마다 주목할 만한 기능들이 라이브러리에 추가 되므로 관심을 가져야 함 
- `java.lang`, `java.util`, `java.io` 와 하위 패키지들에 익숙해져라
  - 그 외에 컬렉션, 스트림, `java.util.concurrent` 도 익히면 좋음
- 자바 표준 라이브러리에서 원하는 기능을 찾지 못했다면 서드파티 라이브러리를 선택  

### 라이브러리 사용 장점
- 표준 라이브러리를 사용하면 전문가의 지식과 다른 프로그래머의 경험을 활용 가능  
- 핵심적인 일과 관련없는 문제 해결 시간을 허비하지 않아도 됨  
- 따로 노력하지 않아도 성능이 지속적으로 개선
- 기능이 점점 많아짐
- 작성된 코드가 많은 사람에게 낯익은 코드가 됨 (가독성, 유지보수, 재활용)

<br/>

## 아이템 60. 정확한 답이 필요하다면 `float` 와 `double` 은 피하라

- `float` 와 `double`은 정확한 계산을 필요로할 때 사용하면 안됨
- 정확한 계산을 하려면 `BigDecimal`, `int`, `long` 이용해야 한다.
  - 아홉자리 십진수 : `int` 
  - 열 여덟자리 십진수 : `long` 
  - 열 여덟자리 이상 : `BigDecimal`
    
### BigDecimal 단점
- 기본 타입보다 사용이 불편
- 기본 타입보다 훨씬 느림

<br/>

## 아이템 61. 박싱된 기본 타입보다는 기본 타입을 사용하라

### 기본 타입과 박싱된 기본 타입 차이점
- 기본 타입은 값만 갖고 있지만, 박싱된 기본 타입은 값과 식별성을 가짐
  - 박싱된 기본타입으로 `==` 연산자 사용하면 오류 발생 
- 박싱된 기본 타입은 `null` 허용
  - 두 타입을 혼용해서 연산하면 박싱이 자동으로 풀리면서 `NullPointerException` 발생
- 기본 타입이 시간과 메모리 사용면에서 더 효율적

### 박싱된 기본 타입이 필요한 경우
- 컬렉션의 원소, 키, 값과 타입 매개변수로 사용
- 리플렉션을 통해 메서드를 호출하는 경우


<br/>

## 아이템 62. 다른 타입이 적절하다면 문자열 사용을 피하라

문자열을 잘못 사용하면 코드도 복잡해지고, 느리고, 오류도 쉽게 발생된다.

- 문자열은 **다른 값 타입**을 대신하기에 적합하지 않다.
  - 수치형 데이터라면 `int`, `float`, `BigInteger` 사용
  - 질문의 답이라면 열거 타입이나 `boolean` 사용
  
- 문자열은 **열거 타입**을 대신하기에 적합하지 않다.
  - 상수를 열거할 때는 열거 타입
  
- 문자열은 **혼합 타입**을 대신하기에 적합하지 않다.
  - 구분자를 넣어서 여러 요소를 문자로 표현하면 느리고 오류도 쉽게 발생 
  
- 문자열은 **권한**을 표현하기에 적합하지 않다.
  - 같은 키를 사용하게 된다면 의도치 않은 값을 공유
  - 악의적으로 다른 클라이언트의 값을 가져올 수 있어 보안 취약

<br/>

## 아이템 63. 문자열 연결은 느리니 주의하라

문자열 연결 연산자(`+`)로 문자열 n개를 잇는 시간은 n^2 에 비례
→ 성능을 생각한다면 `StringBuilder` 사용


<br/>

## 아이템 64. 객체는 인터페이스를 사용해 참조하라

- 적합한 인터페이스만 있다면 모두 **인터페이스 타입**으로 선언하라
  - 인터페이스를 사용하면 유연하게 교체가 가능하다.
- 적합한 인터페이스가 없으면 가장 **덜 구체적인 클래스 타입**으로 사용


### 적합한 인터페이스가 없는 경우
- `String`, `BigInteger` 같은 값 클래스
- 클래스 기반으로 작성된 프레임워크가 제공하는 객체 (ex. `OutputStream`같은 `java.io` 패키지)
- 인터페이스에는 없는 특별한 메서드 제공 클래스(ex. `comparator` 메서드가 있는 경우)

<br/>

## 아이템 65. 리플렉션보다는 인터페이스를 사용하라

리플렉션은 제한된 형태로만 사용해야 함
→ 인스턴스 생성에만 사용하고, 해당 인스턴스는 인터페이스 또는 상위 클래스 참조

### 리플렉션 단점
- 컴파일 타임에 타입 검사, 예외 검사가 불가능 (런타임 오류)
- 코드가 지저분하고 장황해져서 가독성 저하
- 성능 저하, 리플렉션으로 호출한 메서드가 일반 메서드보다 훨씬 느림

<br/>

## 아이템 66. 네이티브 메서드는 신중히 사용하라

> 네이티브 메서드 : C 나 C++ 같은 네이티브 프로그래밍 언어로 작성한 메서드

성능 개선 목적으로 네이티브 메서드 사용하지 말라
→ 현재의 자바는 다른 플랫폼에 견줄만한 성능을 보여준다.

### 네이티브 메서드 사용
- 레지스트리 같은 플랫폼 특화 기능 사용
- 네이티브 코드로 작성된 기존 라이브러리를 사용
- 성능 개선 목적

### 네이티브 메서드 단점
- 네이티브 메서드를 사용하면 메모리 훼손 오류로부터 안전하지 않음
- 플랫폼에 의존적이라 이식성이 낮음
- 디버깅이 어려움
- 속도가 오히려 느려질 수 있음 (자바 코드와 네이티브 코드 경계를 넘을 때마다 추가 비용)
- 가비지 컬렉터라 네이티브 메모리는 자동 회수도 못하고 추적도 불가능
- 자바와 네이티브 사이의 접착 코드(glue code) 작성으로 가독성 저하, 비용 발생

<br/>

## 아이템 67. 최적화는 신중히 하라

- 최적화 시도전후로 성능을 **측정**하라
  - 빠르지 않다면 **프로파일러**를 사용해 원인이 되는 부분을 찾아 최적화 진행
- 빠른 프로그램보다 **좋은 프로그램**을 작성하라
  - 좋은 결과 보다는 해로운 결과가 나타날 수 있음  
  - 빠르지도 않고 제대로 동작하지 않는 어려운 소프트웨어 탄생

### 설계 단계에서 성능을 고려하자
- 성능을 제한하는 설계는 피하라
  - 컴포넌트 또는 외부 시스템과 **소통하는 방식**이 변경하기 어렵거나 **시스템 성능을 제한**
- API 설계할 때 성능에 주는 영향을 고려하라
  - 가변으로 만들면 **불필요한 방어적 복사** 유발
  - 컴포지션 대신 **상속 방식**으로 설계하면 상위 클래스에 영원히 종속되며 **성능 제약**도 물려받음
  - 인터페이스 대신 **구현 타입**을 이용하면, 더 빠른 구현체로 **대체가 힘들어**진다.
- 성능을 위해 API 를 왜곡하지 말라
  - 신중하게 설계하고 멋진 구조를 갖추고 최적화를 고려
  
<br/>

## 아이템 68. 일반적으로 통용되는 명명 규칙을 따르라

### 패키지와 모듈 
- **점**(`.`)으로 구분
- 모두 **소문자 알파벳** 혹은 숫자
- 일반적으로 **8자 이하**의 짧은 단어(ex. `utilities` 보다는 `util`)
- 여러 단어로 구성됐다면 각 단어의 첫 글자만 따도 좋음(ex. `awt`)
- 바깥에서도 사용되는 패키지라면 **인터넷 도메인 이름 역순**

### 클래스와 인터페이스
- **각 단어는 대문자**
- 통용되는 줄임말(ex. `max`, `min`) 이외에는 **줄여쓰지 말기**
- **약자**의 경우 **첫 글자만 대문자**인 훨씬 많음(ex. `HttpUrl`)
- 보통 단수 **명사**나, **명사구**
- **생성할 수 없는** 클래스는 **복수형 명사** (ex. `Collectors`, `Collections`)
- **인터페이스 이름**은 클래스와 같거나 `able` 혹은 `ible` 형용사 (ex. `Runnable`, `Accessible`)
- **애너테이션**은 **규칙없이** 명사, 전치사, 형용사, 동사 다양하게 사용

### 메서드와 필드 이름
- **첫글자는 소문자** 
- 클래스와 명명 규칙과 동일
  - **상수 필드**(`static final`)는 예외, **모두 대문자**로 쓰고 밑줄로 구분 (ex. `NEGATIVE_INFINITY`)
- **동사**나 목적어를 포함한 **동사구**
- `boolean` 반환이라면 `is` 또는 `has` 시작
- **인스턴스의 속성**을 반환한다면 `get`(비추천), **명사**, **명사구**
- **다른 타입의 객체**를 반환하면 `to{Type}` 형태
- **기본 타입 값**으로 반환하면 보통 `{type}Value` 형태
- **정적 팩토리** 이름은 `from`, `of`, `valueOf`, `instance`... 

### 지역변수
- 문맥에서 의미를 유추할 수 있어서 **약어**를 써도 좋음
- 직접 노출될일이 거의 없어 덜 중요
- **명사**나 **명사구**, `boolean` 이라면 **형용사** 

### 타입 매개변수
- `T`: 임의의 타입
- `E`: 컬렉션 원소 타입
- `K` 와 `V`: 맵의 키와 값 
- `X`: 에외
- `R`: 메서드 반환 타입
- `T`, `U`, `V` 와 `T1`, `T2`, `T3`: 임의 타입의 시퀀스