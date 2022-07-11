---
title: '[Modern Java in Action] Chapter11. null 대신 Optional 클래스'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 11장에서는 `null` 로 부터 안전한 코드에 대해 소개한다.  
`NullPointerException` 예외가 발생되지 않도록 고려하는 방법들에 대해 알아본다.


<!--more-->

<br/>

자바로 개발하면서 겪는 예외 중 `NullPointerException` 이 가장 많을 것이다.  
대부분의 언어 설계에는 `null` 참조 개념을 포함하는데 이로 인한 피해비용은 굉장히 클 수 있다.  

<br/>

## 11.1 값이 없는 상황을 어떻게 처리할까?

```java 
public class Person {
    private Car car;
    public Car getCar() { return car; }
}

public class Car {
    private Insurance insurance;
    public Insurance getInsurance() { return insurance; }
}

public class Insurance {
    private String name;
    public String getName() { return name; }
}

//client
public String getCarInsuranceName(Person person) {
    return person.getCar().getInsurance().getName();
}
```

이 코드에서 `get`으로 가져오는 값들이 `null` 참조를 반환하고 있다면 런타임에 `NullPointerException` 이 발생하면서 프로그램이 중단될 것이다. 

### 보수적인 자세로 `NullPointerException` 줄이기

예기치 않은 `NullPointerException` 을 피하려고 대부분은 `null` 확인 코드를 추가해서 예외를 해결하려 할 것이다.    
하지만 이러한 코드는 쉽게 에러를 일으킬 수 있으며, `null` 처리를 놓친다면 동일하게 예외가 발생될 것이다.  
그러므로 값이 있거나 없음을 분명하게 표현할 수 있는 방법이 필요하다.

```java 
public String getCarInsuranceName(Person person) {
    if (person == null) {
        return "Unknown";
    }
    Car car = person.getCar();
    if (car == null) {
        return "Unknown";
    }
    Insurance insurance = car.getInsurance();
    if (insurance == null) {
        return "Unknown";
    }
    return insurance.getName();
}

```

### null 때문에 발생하는 문제

- 에러의 근원이다.
  - `NullPointerException` 은 자바에서 가장 흔히 발생하는 에러다
- 코드를 어지럽힌다.
  - 중첩된 `null` 확인 코드를 추가해야 하므로 코드 가독성이 떨어진다.
- 아무 의미가 없다.
  - `null`은 아무 의미도 표현하지 않는다. 
  - 정적 형식 언어에서 값이 없음을 표현하는 방법으로 적절하지 않다.
- 자바 철학에 위배된다. 
  - 자바는 개발자로부터 모든 포인터를 숨겼다. 하지만 그 예외가 `null` 포인터다.
- 형식 시스템에 구멍을 만든다.
  - `null`은 모든 참조 형식에 할당 가능하다. 이러한 `null`이 나중에는 무슨 의미로 사용됐는지 알 수 없다. 

### 다른 언어는 null 대신 무얼 사용하나?

그루비 같은 언어에서는 안전 내비게이션 연산자(safe navigation operator, `?.`)을 도입하여 `null` 문제를 해결했다.  
호출 체인에 `null`인 참조가 있으면 결과로 `null`이 반환된다.  
이 연산자를 사용하면 부작용을 최소화하면서 `null` 예외 문제를 근본적으로 해결할 수 있다.

```groovy
def carInsuranceName = person?.car?.insurance?.name
```

함수형 언어에서는 선택형값(optional value)을 저장할 수 있는 형식을 제공하면서 `null` 문제를 해결했다. (`null` 참조 개념이 자연스럽게 사라짐)

- 하스켈
  - `Maybe` 형식 제공, 주어진 형식의 값을 갖거나 아무 값도 가질 수 없음
- 스칼라
  - `Option[T]` 구조 제공, `Option` 형식에서 제공하는 연산을 통해 값이 존재하는지 명시적으로 확인(`null` 확인)

자바8 에서는 선택형값 개념의 영향을 받아 `java.util.Optional<T>` 이라는 클래스를 제공한다.    
이제 `java.util.Optional<T>` 을 이용해서 값이 없는 상황을 모델링하는 방법에 대해 알아본다.

