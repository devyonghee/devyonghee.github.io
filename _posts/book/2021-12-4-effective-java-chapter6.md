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

<br/>

## 아이템 37. ordinal 인덱싱 대신 EnumMap을 사용하라

아래와 같이 배열을 사용하면 비검사 형변환이 필요하고 정확한 정숫값을 사용하지 않으면 오류 발생하기 쉽다.

```java
plantsByLifeCycle[p.lifeCycle.ordinal()].add(p);
```

`ordinal` 보다는 짧고 명료하고 안전한 `EnumMap` 을 사용하자.

```java  
Map<PlantLifeCycle, Set<Plant>> plantsByLifeCycle = new EnumMap<>(Plant.LifeCycle.class);
```

`EnumMap` 성능이 `ordinal` 과 비슷한 이유가 결국 내부에서도 배열을 사용한다.  
내부 구현 방식을 숨겨 타입 안전성과 성능을 모두 잡았다.  
다차원 관계라면 `EnumMap<..., EnumMap<...>>`으로 표현하자

<br/>

## 아이템 38. 확장할 수 있는 열거 타입이 필요하면 인터페이스를 사용하라

타입 안전 열거 패턴은 열거한 값들에 다음 값을 추가하여 확장할 수 있지만 열거 타입은 불가능하다.  
열거 타입으로 확장하려면 인터페이스를 구현하게 하면 된다.  

```java 
public interface Operation {
    double apply(double x, double y);
}

public enum BasicOperation implements Operation {
    PLUS {
        @Override
        public double apply(double x, double y) {
            return x + y;
        }
    },
    MINUS {
        @Override
        public double apply(double x, double y) {
            return x - y;
        }
    },
    ...
}

public enum ExtendedOperation implements Operation {
    EXP {
        @Override
        public double apply(double x, double y) {
            return Math.pow(x, y);
        }
    },
    REMAINDER {
        @Override
        public double apply(double x, double y) {
            return x % y;
        }
    }
}
```

하지만 열거 타입끼리 구현을 상속할 수 없다는 문제가 있다.  
이러한 문제는 디폴트 구현을 이용하거나 정적 도우미 메서드로 해결하도록 하자.
java 라이브러리에 있는 `LinkOption` 열거 타입이 `CopyOption`, `OpenOption` 
인터페이스를 구현하는 패턴을 사용하고 있으므로 참고하자 


<br/>

## 아이템 39. 명명 패턴보다 애너테이션을 사용하라

### 명명 패턴 단점

- 오타가 나면 안됨
  - junit3에서는 메서드 이름이 `test`로 시작되어야 하는데 실수로 `tsetSafety`라고 지으면 테스트가 무시된다.
  
- 올바름 프로그램 요소에서 사용되리라 보증할 방법이 없음
  - junit3에서 `TestSafety`라고 클래스 이름을 지으면 테스트들이 돌 것이라 기대하지만 클래스 이름에는 관심이 없다.
  
- 프로그램 요소를 매개변수로 전달할 방법이 없음
  - 메서드 이름에 덧붙이는 방법이 있지만 보기도 힘들고 깨지기 쉽다.

애너테이션을 이용하면 위의 단점을 모두 해결할 수 있다.  
애너테이션을 선언할 때 `@Retention`, `@Target` 메타애너테이션을 추가하자 
여러개 값을 받는 애너테이션을 받아야 한다면 `@Repeatable` 을 이용하는 방법도 있다.

> ##### 메타애너테이션  
> 애너테이션 선언에 다는 애너테이션

일반 프로그래머는 애너테이션 타입을 정의할 일은 거의없다.  
자바 프로그래머라면 자바가 제공하는 애너테이션 타입들을 사용하자.


