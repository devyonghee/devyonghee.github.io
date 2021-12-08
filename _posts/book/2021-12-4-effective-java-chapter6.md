---
title: 이펙티브 자바 Chapter6. 열거 타입과 애너테이션
tags: [book, effective-java]
categories: book
---


이펙티브 자바 6장에서는  
클래스의 일종인 열거 타입(enum)과 인터페이스의 일종인 애너테이션(annotation)을 올바르게 사용하는 방법을 소개한다.   

<!--more-->

<br/>

## 아이템 34. int 상수 대신 열거 타입을 사용하라

아래와 같은 정수 열거 타입 패턴 기법은 타입 안전을 보장하지 않고 표현력도 좋지 않다.
필요한 원소를 컴파일 타임에 알 수 있는 상수 집합이라면 항상 **열거 타입**을 사용하라
문자열 열거 패턴은 문자열에 오타가 있어도 컴파일러는 확인할 수 없어 런타임 버그가 더 많이 생긴다.

```java
public static final int APPLE_FUJI = 0;
publis static final int ORANGE_NAVEL = 0;
```

위와 같은 열거 패턴은 열거 타입을 이용하면 이와 같은 단점을 개선할 수 있다.
```java 
public enum APPLE { PUJI, PIPPIN, GRANNY_SMITH }
public enum Orange { NAVEL, TEMPLE, BLOOD }
``` 

### 열거 타입의 장점
- 컴파일 타임 타입 안전성
- 각자의 이름 공간이 있어서 이름이 같은 상수도 공존 가능
- 새로운 상수를 추가하거나 순서가 바뀌어도 다시 컴파일할 필요 없음
- 적합한 문자열 반환하는 `toString` 메서드 
- 메서드나 필드를 추가할 수 있고 인터페이스도 구현 가능 (특정 데이터와 연결하려면 생성자에서 데이터를 받아 인스턴스 필드에 저장)


### 전략 열거 타입 패턴

상수별 메서드 구현에는 열거 타입 상수끼리 코드를 공유하기 어렵다.  
실수로 구현 또는 조건을 놓치면 오류가 발생하기 쉽다.
이런 경우 깔끔한 방법은 전략 열거 타입 패턴을 이용하는 것이다.

```java
enum PayrollDay {
    MONDAY(WEEKDAY), TUESDAY(WEEKDAY), WEDNESDAY(WEEKDAY),
    THURSDAY(WEEKDAY), FRIDAY(WEEKDAY),
    SATURDAY(WEEKEND), FUNDAY(WEEKEND);

    private final PayType payType;
    
    int pay() {
        return payType.pay();
    }

    enum PayType {
        WEEKDAY {
            int pay() {
                ...
            } 
        }

        WEEKEND {
            int pay() {
                ...
            } 
        }
        abstract int pay();
    } 
}
``` 


<br/>

## 아이템 35. ordinal 메서드 대신 인스턴스 필드를 사용하라

인스턴스 필드를 이용해야 한다.
`ordinal` 메서드를 사용할 일이 없지만 `EnumSet` 또는 `EnumMap` 같이 범용 자료구조에 쓸 목적으로 설계된 메서드다. 

### enum 에서 ordinal 사용 단점
- 상수 선언 순서를 변경하는 순간 오동작하기 쉬움
- 중간에 값을 비울 수 없음
- 똑같은 값을 사용하는 상수 선언 불가


<br/>

## 아이템 36. 비트 필드 대신 EnumSet을 사용하라

아래와 같은 집합을 비트 필드라고 한다.
이와 같이 사용하면 합집합과 교집합 같은 집합 연산을 수행할 수 있지만 해석하기 어렵다.

```java
public class Text {
    public static final int STYLE_BOLD  = 1 << 0;  //1
    public static final int STYLE_ITALIC = 1 << 1; //2
    
    public void applyStyles(int styles) {...}
}

text.applyStyles(STYLE_BOLD | STYLE_ITALIC);
```

`EnumSet` 클래스는 열거 타입 상수의 값으로 된 집합을 효과적으로 표현한다.  
타입 안전하고 어떤 `Set` 구현체와 함께 사용 가능  
모든 클라이언트가 `EnumSet`으로 넘겨준다해도 이왕이면 인터페이스인 `Set` 으로 받는 것이 좋은 습관이다.

```java
public class Text {
    public enum Style { BOLD, ITALIC }
    
    public void applyStyles(Set<Style> styles) {...}
}
```
