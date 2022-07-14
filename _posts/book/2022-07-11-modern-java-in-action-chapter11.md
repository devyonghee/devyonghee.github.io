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

<br/>

## 11.2 Optional 클래스 소개

자바 8에서 제공하는 `java.util.Optional<T>` 이라는 새로운 클래스는 선택형값을 캡슐화하는 클래스다.  
값이 있으면 Optional 클래스는 값을 감싸고 값이 없으면 `Optional.empty` 정적 팩토리 메서드로 반환한다.  
`null` 와 비슷하지만 `NullPointerException`이 발생되지 않고 `Optional` 객체로 다양한 방식으로 활용 가능하다.  

```java 
public class Person {
    private Optional<Car> car;
    public Optional<Car> getCar() { return car; }
}

public class Car {
    private Optional<Insurance> insurance;
    public Optional<Insurance> getInsurance() { return insurance; }
}

public class Insurance {
    private String name;
    public String getName() { return name; }
}
```

`Optional` 클래스를 사용하면서 모델의 의미가 더 명확해졌다.   
하지만 모든 `null` 참조를 `Optional`로 대치하는 것보다는 이해하기 쉬운 API 설계를 위한 용도로 사용하는 것이 바람직하다.  

<br/>

## 11.3 Optional 적용 패턴

### Optional 객체 만들기

- 빈 Optional
  - `Optional.empty();`
- null 이 아닌 값으로 Optional 만들기
  - `Optional.of(car);`
- null 값으로 Optional 만들기
  - `Optional.ofNullable(car);`
- 값 가져오기
  - `get` 메서드 사용

### 맵으로 Optional 의 값을 추출하고 반환하기 

`Optional`은 객체의 정보를 추출하기 위한 용도로 `map` 메서드를 지원한다.

```java 
String name = null;
if (insurance != null) {
    name = insurance.getName();
}
// 동일한 동작의 코드
Optional<String> name = Optional.ofNullable(insurance)
                                .map(Insurance::getName);
```

### flatMap 으로 Optional 객체 연결

`flatMap` 메서드는 이차원 `Optional`을 일차원 `Optional`로 평준화한다.

```java 
String carInsuranceName = person.flatMap(Person::getCar)
                                .flatMap(Car::getInsurance)
                                .map(Insurance::getName)
                                .orElse("Unknown");
```


### Optional 스트림 조작

자바 9 에서는 `Optional` 포함하는 스트림을 쉽게 처리하도록 `stream()` 메서드가 추가되었다.  

```java 
public Set<String> getCarInsuranceNames(List<Person> persons) {
    return persons.stream()
            .map(Person::getCar)
            .map(optCar -> optCar.flatMap(Car::getInsurance))
            .map(optIns -> optIns.map(Insurance::getName))
            .flatMap(Optional::stream)   // Stream<Optional<String>> 을 Stream<String>으로 변환
            .filter(Optional::isPresent)  // 빈 값을 제거해서 값만 가져올 수 있음
            .map(Optional::get)
            .collect(Collectors.toSet());
}
```


### 디폴트 액션과 Optional 언랩

`Optional` 인스턴스에 포함된 값을 읽는 다양한 방법 

- `get()`
  - 가장 간단하지만 안전하지 않음
  - 래핑된 값이 있으면 반환하고 없으면 `NoSuchElementException` 발생
  - 반드시 있다고 가정하지 않으면 사용하지 안흔 것이 바람직
- `orElse(T other)`
  - 값을 포함하지 않을때 기본값 제공 가능
- `orElseGet(Supplier<? extends T> other)`
  - `orElse` 의 게으른 버전의 메서드 (값이 없을 때만 실행)
  - 디폴드 메서드를 만드는 데 시간이 걸리거나, 비어있을 때만 생성해야 한다면 사용
- `orElseThrow(Supplier<? extends X> exceptionSupplier)`
  - 값이 비어있을 때만 예외 발생
  - `get()` 과 비슷하지만 발생할 예외 선택 가능
- `ifPresent(Consumer<? super T> consumer)`
  - 값이 존재할 때 인수로 넘겨준 동작을 실행
  - 값이 없으면 아무일도 일어나지 않음
- `ifPresentOrElse(Consumer<? super T> action, Runnable emptyAction)`
  - 자바 9에서 추가된 메서드
  - 비어있을 때 실행할 수 있는 `Runnable` 인수를 받음

### 두 Optional 합치기

두 `Optional`을 인수로 받아서 `Optional<Insurance>`를 반환하는 `null` 안전 버전 메서드를 구현해본다.

```java 
public Optional<Insurance> nullSafeFindCheapestInsurance(
        Optional<Person> person, Optional<Car> car) {
    if (person.isPresent() && car.isPresent()) {
        return Optional.of(findCheapestInsurance(person.get(), car.get()));
    }
    return Optional.empty();
}
// 언랩하지 않고 합치기
public Optional<Insurance> nullSafeFindCheapestInsurance(
        Optional<Person> person, Optional<Car> car) {
    return person.flatMap(p -> car.map(c -> findCheapestInsurance(p, c));
}
```

### 필터로 특정값 거르기

`filter` 메서드는 프레디케이트를 인수로 받아서 일치하면 그 값을 반환하고 그렇지 않으면 빈 `Optional` 객체를 반환한다.  
`Optional` 이 비어있는 상태라면 `filter` 연산은 아무 동작하지 않는다.

```java 
optInsurance.filter(insurance ->
        "CambridgeInsurance".equals(insurance.getName()))
        .ifPresent(System.out::println);
```

### Optional 메서드

| 메서드              | 설명                                            |
|------------------|-----------------------------------------------|
| `empty`          | 빈 `Optional` 인스턴스 반환                          |  
| `filter`         | 값이 존재하며 프레디케이트와 일치하면 값을 포함,<br/> 없거나 일치하지 않으면 빈 `Optional` 반환 |  
| `flatMap`        | 값이 존재하면 인수로 제공된 함수를 적용한 결과 `Optional` 반환      |  
| `get`            | 값이 존재하면 감싸고 있는 값 반환<br/>없으면 `NoSuchElementException` |  
| `ifPresent`      | 값이 존재하면 지정된 `Consumer` 실행                     |  
| `ifPresentOrElse` | 값이 존재하면 지정된 `Consumer` 실행<br/>없으면 `Runnable` 실행    |  
| `isPresent`      | 값이 존재하면 `true`, 없으면 `false`                   |  
| `map`            | 값이 존재하면 제공된 매핑 함수 적용                          |  
| `of`             | 값이 존재하면 값을 감싼 `Optional`<br/>`null`이면 `NullPointerException` |  
| `ofNullable`     | 값이 존재하면 값을 감싼 `Optional`<br/>`null`이면 빈 `Optional` 반환 |  
| `or`             | 값이 존재하면 같은 `Optional` 반환<br/>없으면 `Supplier` 에서 만든 `Optional` 반환 |  
| `orElse`         | 값이 존재하면 값 반환<br/>없으면 기본값 반환                        |  
| `orElseGet`      | 값이 존재하면 값 반환<br/>없으면 `Supplier` 제공 값 반환            |  
| `orElseThrow`    | 값이 존재하면 값 반환<br/>없으면 `Supplier` 에서 생성한 예외 발생       |  
| `stream`         | 값이 존재하면 존재하는 값만 포함하는 스트림 반환<br/>없으면 빈 스트림 반환       |  


<br/>

## 11.4 Optional 을 사용한 실용 예제

기존 자바 API 에 Optional 기능을 활용할 수 있는 방법에 대해 알아본다.

### 잠재적으로 null 이 될 수 있는 대상을 Optional 로 감싸기

`null`을 반환하는 것보다는 `Optional`을 반환하는 것이 더 바람직하다.  
`Optional.ofNullable` 을 이용하여 `null` 일 수 있는 값을 `Optional` 로 안전한게 변환한다.

```java 
Optional<Object> value = Optional.ofNullable(map.get("key"));
```

### 예외와 Optional 클래스

자바 API는 값을 제공할 수 없을 때 `null` 대신 예외를 발생시킬 때도 있다.  
예외가 발생되면 번거로운 `try`/`catch` 블록을 사용하는 것 대신 유틸리티 메서드로 빈 `Optional` 을 반환할 수 있다.

```java 
public static Optional<Integer> stringToInt(String s) {
    try {
        return Optional.of(Integer.parseInt(s));
    } catch (NumberFormatException e) {
        return Optional.empty();
    }
}
```

### 기본형 Optional 을 사용하지 말아야 하는 이유

`Optional`도 기본형으로 특화된 `OptionalInt`, `OptionalLong`, `OptionalDouble` 등 클래스가 존재한다.  
하지만 다음과 같은 이유로 사용하는 것을 권장하지 않는다.

- `Optional`의 요소 수는 최대 한 개이므로 성능이 개선되지 않음
- `map`, `flatMap`, `filter` 등 메서드를 지원하지 않음
- 기본형 특화 `Optional`은 다른 일반 `Optional` 과 혼용 불가


### 응용

```java 
public int readDuration(Properties props, String name) {
    String value = props.getProperty(name);
    if (value != null) {
        try {
            int i = Integer.parseInt(value);
            if (i > 0) {
                return i;
            }
        } catch (NumberFormatException nfe) { }
    }
    return 0;
}

// Optional 과 유틸리티 메서드를 통해 가독성 개선
public int readDuration(Properties props, String name) {
    return Optional.ofNullable(props.getProperty(name))
                   .flatMap(OptionalUtility::stringToInt)
                   .filter(i -> i > 0)
                   .orElse(0);
}
```

