---
title: '[Modern Java in Action] Chapter2. 동작 파라미터화 코드 전달하기'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션2장에서는 동작 파라미터로 변화하는 요구사항에 대해 유연하게 대응하는 방법을 소개한다.  
동작 파라미터화를 사용하는 방법에 대해 자세히 알아보도록 하자.

<!--more-->

<br/>

동작 파라미터화는 아직 어떻게 실행할 것인지 정해지지 않는 코드 블록을 의미한다.  
동작 파라미터화를 이용하면 다음과 같은 기능들을 수행할 수 있어서 자주 바뀌는 요구사항에 대해 효과적으로 대응이 가능하다. 

- 리스트의 모든 요소에 대해 '어떤 동작'을 수행
- 리스트 관련 작업을 끝낸 다음에 '어떤 다른 동작'을 수행
- 에러가 발생하면 '정해진 어떤 다른 동작'을 수행

<br/>

## 2.1 변화하는 요구사항에 대응하기

사과 필터링 예제로 유연한 코드가 필요한 사례를 소개한다.

### 1) 녹색 사과 필터링

녹색 사과만을 걸러내는 기능을 구현한 코드는 다음과 같다.

```java
public static List<Apple> filterGreenApples(List<Apple> inventory) {
    List<Apple> result = new ArrayList<>();
    for (Apple apple: inventory) {
        if (GREEN.equals(apple.getCollor())) {
           result.add(apple);
        }
    }
    return result;
}
```

### 2) 빨간색 사과 추가 필터링: 색을 파라미터화

다음은 다양한 색으로 필터링하고 싶어지는 요구사항에 대응하기 위해 파라미터를 통해 빨간 사과도 필터링을 할 수 있도록 변경된 코드다. 

```java
public static List<Apple> filterApplesByColor(List<Apple> inventory, Color color) {
    List<Apple> result = new ArrayList<>();
    for (Apple apple: inventory) {
        if (color.equals(apple.getCollor())) {
           result.add(apple);
        }
    }
    return result;
}

filterApplesByColor(inventory, GREEN);
filterApplesByColor(inventory, RED); 
```

갑자기 무게에 대해서도 필터링이 필요하다는 요구사항이 추가되었다.  
다양한 무게에 대응할 수 있도록 무게 정보 파라미터를 추가하여 다음과 같이 코드를 구현한다.

```java
public static List<Apple> filterApplesByColor(List<Apple> inventory, int weight) {
    List<Apple> result = new ArrayList<>();
    for (Apple apple: inventory) {
        if (apple.getWeight() > weight) {
           result.add(apple);
        }
    }
    return result;
}
```

하지만 이렇게 되면 DRY(don`t repeat yourself) 원칙 위반이 된다.  


### 3) 모든 속성으로 필터링

요구사항에 대응하기 위해 추가된 속성을 모두 파라미터로 추가하면 다음과 같은 코드가 된다.  
하지만 이 코드에서 `true`, `false`이 무엇을 의미하는지 알 수 없으며, 요구사항이 변경되면 유연하게 대응할 수 없다.  

```java
public static List<Apple> filterApplesByColor(List<Apple> inventory, Color color, int weight, boolean flag) {
    List<Apple> result = new ArrayList<>();
    for (Apple apple: inventory) {
        if ((flag && color.equals(apple.getColor())) ||
            (!flag && apple.getWeight() > weight)) {
           result.add(apple);
        }
    }
    return result;
}

filterApplesByColor(inventory, GREEN, 0 true);
filterApplesByColor(inventory, null, 150, false);
```

<br/>

## 2.2 동작 파라미터화

이제 요구사항에 유연하게 대응하기 위해 선택 조건을 결정하는 인터페이스(프레디케이트)를 정의하고 구현 클래스를 작성해보도록 한다.

> 프레디케이트 : 참 또는 거짓을 반환하는 함수

```java
public interface ApplePredicate {
    boolean test (Apple apple);
}

public class AppleHeavyWeightPredicate implements ApplePredicate {
    public boolean test (Apple apple) {
        return apple.getWeight() > 150;
    }
}

public class AppleGreenColorPredicate implements ApplePredicate {
    public boolean test (Apple apple) {
        return GREEN.equals(apple.getColor());
    }
}
```

이제 조건에 따라 `filter` 메서드가 다르게 동작할 것인데, 이를 전략 디자인 패턴(strategy design pattern)이라고 한다.  
`ApplePredicate` 는 알고리즘 패밀리고, `AppleHeavyWeightPredicate` 와 `AppleGreenColorPredicate` 는 전략이다.

### 1) 추상적 조건으로 필터링 

위의 예제에서 나온 메소드를 새롭게 정의한 `ApplePredicate` 를 이용하도록 변경한다.

```java 
public static List<Apple> filterApples(List<Apple> inventory, ApplePredicate p) {
    List<Apple> result = new ArrayList<>();
    for (Apple apple: inventory) {
        if (p.test(apple))
           result.add(apple);
        }
    }
    return result;
}

filterApples(inventory, new AppleHeavyWeightPredicate());
filterApples(inventory, new AppleGreenColorPredicate());
```

<br/>

## 2.3 복잡한 과정 간소화

추상화는 됐지만 `ApplePredicate` 를 구현하는 클래스를 정의하고 인스턴스화하는 번거로운 과정이 필요하다.  
자바는 클래스 선언과 인스턴스화를 동시에 할 수 있는 익명 클래스(anonymous class) 라는 기법을 제공하여 이 과정을 줄일 수 있다.

### 익명 클래스

- 이름이 없는 클래스
- 자바의 지역클래스와 비슷한 개념(블록 내부에 선언된 클래스)
- 클래스 선언과 인스턴스화를 동시에 가능

```java 
filterApples(inventory, new ApplePredicate() {
    public boolean test (Apple apple) {
        return apple.getWeight() > 150;
    }
});
```

#### 단점
- 익명 클래스는 많은 공간(메소드 정의, 생성자 호출 등)을 차지
- 많은 프로그래머가 익명 클래스 사용에 익숙하지 않음

### 람다 표현식

자바 8의 람다 표현식을 통해 코드가 간결해지고 복잡성이 해결된다.

```java 
filterApples(inventory, (Apple apple) -> apple.getWeight() > 150);
```

