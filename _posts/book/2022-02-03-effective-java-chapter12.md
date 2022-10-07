---
title: 이펙티브 자바 Chapter12. 직렬화
tags: [book, effective-java]
categories: book
---


이펙티브 자바 12장에서는 직렬화에 대해서 소개한다.   
객체를 바이트 스트림으로 인코딩하고 디코딩하면서 생기는 위험에 대해 최소화하는 방법을 알아본다.

<!--more-->

<br/>

## 아이템 85. 자바 직렬화의 대안을 찾으라

**직렬화**는 공격 범위가 너무 넓어 **방어가 어려움**
- 역 직렬화 과정에서 타입안의 모든 코드를 수행할 수 있음
- 신뢰할 수 없는 스트림을 역직렬화하면 원격 코드 실행(RCE), 서비스 거부(DOS) 등 공격 가능
- 위험을 피하기 위해 아무것도 **역직렬화 하지 않아야 함**
- 새로운 시스템에서 자바 직렬화를 사용하지 않아야 함

자바 직렬화 위험을 회피, 다양한 플랫폼 지원, 성능 우수 등 이점이 있는 **크로스 플랫폼 구조화된 데이터 표현** 사용 추천
- 대표적인 **크로스 플랫폼 구조화된 데이터 표현** 은 JSON 과 프로토콜 버퍼
- **JSON** 은 **텍스트 기반**이라 읽을 수 있음
- **프로토콜 버퍼**는 이진 표현이라 **효율이 높음**

직렬화가 필요하고 역직렬화가 안전한지 모른다면 **객체 역직렬화 필터링**(`java.io.ObjectInputFilter`) 사용
- **객체 역직렬화 필터링**은 역직렬화되기 전에 **필터**를 설치하는 기능
- 특정 클래스를 받아들이거나 거부 가능, **화이트리스트** 방식 추천 (안전하다고 알려진 클래스만 수용)

<br/>

## 아이템 86. `Serializable`을 구현할지는 신중히 결정하라

`Serializable` 구현한 뒤에는 **수정이 어려움**
- 직렬화 가능한 클래스가 퍼진다면 직렬화 형태를 **영원히 지원**해야 됨
- 클래스의 private, package-private 필드들이 공개 됨(**캡슐화 깨짐**)
- 내부 구현을 수정하면 기존 직렬화 형태와 달라짐 (신버전 클래스로 역직렬화 하면 깨짐)
- 고유 식별 번호(`static final long serialVersionUID`) 명시하지 않으면 자동 생성되므로 **호환성이 쉽게 깨짐**

**버그**와 **보안 구멍**이 생길 위험이 생김
- 역직렬화는 **숨은 생성자**가 됨 (불벽식 깨짐, 허가되지 않은 접근에 노출)

해당 클래스의 신버전을 릴리즈할 때 **테스트**할 것이 늘어남
- 신버전, 구버전의 **직렬화**/**역직렬화** 가능 테스트
- 객체의 **복제 가능** 테스트

**상속용 클래스**는 `Serializable` 구현 금지, **인터페이스**는 `Serializable` 확장 금지
- 확장하거나 구현할 때 큰 부담을 주게 됨
- 구현한 예로는 `Throwable`, `Component`가 존재
- 직렬화를 지원하지 않는 상속용 클래스의 하위 클래스가 직렬화하려면 상위 클래스에서 **매개변수 없는 생성자**가 필요함
  - 생성자 지원하지 않으면 **직렬화 프록시 패턴**을 사용

직렬화가 가능하다면 주의해야 할 점
- `finalize` 메서드로 재정의하지 못하게 해야 함 (finalizer 공격 방지)
- 불변식이 있다면 `readObjectNoData` 메서드 추가 (직렬화 가능 상위 클래스를 추가하기 위한 메서드)

**내부 클래스**는 직렬화 구현 금지
- 내부 클래스에 대한 기본 직렬화 형태가 분명하지 않음
- 정적 멤버 클래스는 `Serializable` 구현 가능

<br/>

## 아이템 87. 커스텀 직렬화 형태를 고려해보라

**유연성**, **성능**, **정확성** 측면에서 괜찮다면 기본 직렬화 형태 사용

**물리적 표현**과 **논리적 표현**이 같다면 기본 직렬화 형태 사용  
- 기본 직렬화 형태가 적합해도 불변식 보장과 보안을 위해 `readObject` 메서드를 제공해야할 수도 있음

```java
// 기본 직렬화 형태에 적합
public class Name implements Serializable {
    private final String lastName;
    private final String firstName;
    private final String middleName; 
}

// 기본 직렬화 형태에 적합하지 않음
public class StringList implements Serializable {
    private int size = 0;
    private Entry head = null;
    private static class Entry implements Serializable {
        String data;
        Entry next;
        Entry previous;
    }
}
```

물리적 표현과 논리적 표현이 다르다면 물리적인 상세 표현을 배제하고 논리적인 구성만 담기
- `transient` 한정자를 이용하여 기본 직렬화 형태에 제외

논리적 상태와 무관한 필드라고 확신할 때만 `transient` 한정자 생략
- 기본 직렬화를 사용하면 `transient` 필드들은 역직렬화될 때 기본값

객체의 전체 상태를 읽는 메서드에 적용해야 하는 동기화 메커니즘을 직렬화에도 적용
- 자원 순서 교착상태에 빠지지 않도록 주의해야 함

직렬화 가능 클래스 모두에 **직렬 버전 UID** 명시적 보유
- 잠재적인 호환성 문제 해결
- 성능이 조금 빨라짐 (명시하지 않으면 이 값을 생성하려고 복잡한 연산 수행)
- 어떤 `long` 값을 선택해도 상관 없음
- 반드시 고유할 필요는 없음
- 구버전과 호환성을 끊는 경우를 제외하고는 수정 금지

### 물리적 표현과 논리적 표현의 차이가 있지만 기본 직렬화 형태를 사용할 때 문제점
- 공개 API 가 현재 내부 표현 방식에 영구히 묶임
  - 관련 코드는 수정 불가능
- 너무 많은 **공간 차지**될 수 있음
  - 객체간 연결 정보가 포함된다면 형태가 너무 커져서 저장 또는 전송 속도가 느려짐 
- **시간**이 너무 많이 걸림
  - 객체 그래프의 위상에 대한 정보가 없어 그래프를 직접 순회 해야 함
- **스택 오버플로** 발생 가능
  - 객체 그래프를 재귀 순회하다가 스택 오버플로 발생

<br/>

## 아이템 88. readObject 메서드는 방어적으로 작성하라

`readObject` 은 또 다른 `public` 생성자
- 이 메서드의 인수가 유효한지 검증해야 함
- `defaultReadObject`로 역직렬화 하여 유효한 객체인지 검증해야 함
- 공격자가 손쉽게 불변식을 깨뜨릴 수 있음 

객체를 역직렬화 할때 클라이언트가 가지면 안되는 객체 참조를 갖는 필드를 방어적으로 복사해야 함
- 의도적으로 내부의 값이 수정될 수 있음
- `final` 필드는 방어적 복사가 불가능하므로 주의

### 안전한 `readObject` 메서드 작성 방법
- `private`이어야 하는 객체 참조 필드는 방어적으로 복사
- 모든 불변식을 검사하여 어긋났다면 `InvalidObjectException` 던지기
  - 방어 복사 다음 불변식 검사 수행
- 역직렬화한 후 객체 그래프 전체의 유효성 검사해야 한다면 `ObjectInputValidation` 인터페이스 사용
- 재정의할 수 있는 메서드 호출 금지


<br/>

## 아이템 89. 인스턴스 수를 통제해야 한다면 readResolve 보다는 열거 타입을 사용하라

`Serializable` 구현하면 싱글턴이 아니게 됨 (`readResolve` 이용하면 만든 인스턴스를 대체 가능)  

`readResolve`를 인스턴스 통제 목적으로 사용한다면 객체 참조 인스턴스 필드는 `transient` 선언 해야 함
- 역직렬화된 객체의 참조 공격 방지

`readResolve` 메서드의 접근성은 매우 중요
- `final class`라면 `private`
- `final` 아닌 경우
  - `private` 하위 클래스에서 사용 불가
  - `package-private` 같은 패키지에 속한 하위 클래스에서만 사용
  - `protected` 또는 `public` 하위 클래스에서 재정의하지 않고 역직렬화 하면 상위 클래스의 인스턴스 생성 됨 (`ClassCastException` 발생) 

```java 
//열거타입 싱글턴
public enum Person {
    INSTANCE;
    private String[] favoriteAnimals = { "Dog", "Cat" }
    public void printFavorites() {
        System.out.println(Arrays.toString(favoriteSongs));
    }
}
```

<br/>

## 아이템 90. 직렬화된 인스턴스 대신 직렬화 프록시 사용을 검토하라

직렬화 프록시 패턴을 이용하여 직렬화의 버그와 보안은 방지
- 논리적인 상태를 표현하는 중첩 클래스를 `private static` 선언
- 바깥 클래스를 매개변수로 받아 인스턴스 데이터 복사
- 바깥, 중첩 클래스 모두 `Serializable` 선언
- 가짜 바이트 스트림 공격, 내부 필드 탈취 공격 차단
- 필드를 `final` 로 선언 가능 (불변 아이템)


```java
private static class SerializationProxy implements Serializable {
    private static final long serialVersionUID = 1L;
    private final Date start;
    private final Date end;
    
    SerializationProxy(Period p) {
        this.start = p.start;
        this.end = p.end;
    }
    // 바깥 클래스와 논리적으로 동이한 인스턴스 반환
    private Object readResolve() {
        return new Period(start, end);
    }
}

// 바깥 클래스에 메서드 추가
private Object writeReplace() {
    return new SerializationProxy(this);
}
private void readObject(ObjectInputStream stream) {
    throw new InvalidObjectException("프록시 필요");
}
```

### 직렬화 프록시 패턴의 한계
- 클라이언트가 멋대로 확장할 수 있는 클래스에 적용 불가능
- 객체 그래프에 순환이 있는 클래스에 적용 불가