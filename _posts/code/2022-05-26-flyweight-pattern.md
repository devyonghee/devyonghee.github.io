---
title: '[Design Pattern] 플라이웨이트 패턴(Flyweight Pattern)'
tags: [design-pattern, flyweight-pattern]
categories: code
---

플라이웨이트 패턴(Flyweight Pattern) 은 가능한 많은 데이터를 공유하여 메모리를 사용을 줄일 수 있는 패턴이다.
GoF(Gang of Four) Design Pattern 중 하나이며, 구조(structural) 패턴에 속한다.

<!--more-->

플라이웨이트 패턴은 자주 사용하는 객체를 캐싱해놓고 재활용하는 패턴이다.  
`new` 연산자를 사용하면 각 객체마다 메모리를 새로 할당받아 사용하게 되는데,  
이 패턴을 이용하면 객체를 재활용하기 때문에 메모리를 절약할 수 있고 객체 생성 시간을 줄일 수 있다.

다음과 같은 상황일 때, 플라이웨이트 패턴 적용을 고려해보자

- 생성된 객체가 오랜 기간 GC 의 대상이 되지 않고 메모리에 위치 
- 동일하거나 유사한 객체가 자주 사용되거나 생성됨
- 객체의 내적 속성(Intrinsic Properties)과 외적 속성(Extrinsic Properties) 중, 외적 속성이 클라이언트에 의해 정의

> 내적 속성 : 객체를 유니크하게 하는 속성 
> 외적 속성 : 클라이언트의 코드로부터 설정되어 다른 동작을 수행하도록 사용되는 속성


## 구조

{% include image.html alt="flyweight pattern structure" source_txt='wikipedia' source='https://en.wikipedia.org/wiki/Flyweight_pattern' path="images/code/flyweight-pattern/structure.png" %}

### FlyweightFactory

- Flyweight 객체를 생성하고 재활용(캐싱)하는 역할
- 생성한 객체들을 관리

### Flyweight

- 공통된 메소드를 정의한 인터페이스

### ConcreteFlyweight

- Flyweight 인터페이스를 구현한 구현 클래스
- Factory 에 의해 생성되고 메모리를 확보한 상태에서 공유
- intrinsic state(고유한 상태)들을 저장하는 클래스

## 동작

{% include image.html alt="flyweight pattern sequence" source_txt='wikipedia' source='https://en.wikipedia.org/wiki/Flyweight_pattern' path="images/code/flyweight-pattern/sequence.png" %}

1. Client 에서 `FlyweightFacotry`에 있는 `getFlyweight(key)` 메소드를 호출한다.
2. `FlyweightFacotry` 에서는 주어진 `key` 에 해당되는 `Flyweight` 객체를 찾는다. 객체가 존재하지 않으면 새로운 객체를 생성하고 키와 함께 메모리에 저장한다. 
3. Client 에서는 반환된 `Flyweight` 객체의 `operation()` 메소드를 호출한다.
4. 다시 Client 에서 `FlyweightFacotry`에 있는 `getFlyweight(key)` 메소드를 호출한다.
5. `FlyweightFacotry` 는 키를 통해 저장해둔 객체를 찾아서 반환한다.


## 장점
- 유사하거나 속성이 동일한 객체를 재활용하기 때문에 메모리를 절약할 수 있다.

## 단점
- `factory` 역할을 위한 코드가 필요하기 때문에 코드가 복잡해진다. 
- 같은 객체를 계속 공유하기 때문에 내부 상태가 변경되면 의도치 않게 다른 곳에서도 영향을 받을 수 있다.
- 이전에 존재하는 객체를 찾는 비용이 증가할 수 있다.
- 특정 인스턴스만 다른 동작을 하도록 구현할 수 없다.

## 구현

### Flyweight

```java 

interface Vehicle {

    String name();
}

```

### ConcreteFlyweight

```java 

public final class Car implements Vehicle {

    private static final String NAME_SUFFIX = " 자동차";
    private final String name;

    public Car(String name) {
        this.name = name;
    }

    @Override
    public String name() {
        return name + NAME_SUFFIX;
    }
}
```


### FlyweightFactory

```java 

public final class CarFactory {

    private static final Map<String, Car> FLYWEIGHT = new HashMap<>();

    private CarFactory() {
        throw new AssertionError();
    }

    public static Vehicle getCar(String name) {
        return FLYWEIGHT.computeIfAbsent(name, Car::new);
    }
}

```

### Client

``` java 

@DisplayName("플라이 웨이트 패턴")
class ClientTest {

    @Test
    @DisplayName("팩토리에서 같은 이름으로 자동차를 가져오면 같은 객체")
    void car() {
        //given
        String carName = "car";
        //when
        Vehicle car1 = CarFactory.getCar(carName);
        Vehicle car2 = CarFactory.getCar(carName);
        //then
        assertThat(car1).isSameAs(car2);
    }

    @Test
    @DisplayName("같은 이름으로 자전거를 생성하면 다른 객체")
    void bike() {
        //given
        String bikeName = "bike";
        //when
        Vehicle bike1 = new Bike(bikeName);
        Vehicle bike2 = new Bike(bikeName);
        //then
        assertAll(
                () -> assertThat(bike1).isNotSameAs(bike2),
                () -> assertThat(bike1.name()).isEqualTo(bike2.name())
        );
    }
}

```

### Flyweight (static factory method)

위의 코드에서는 이미 생성된 `Flyweight`의 객체를 `FlywieghtFactory` 라는 별도의 클래스로 분리해서 관리하고 있다.  
하지만 이렇게 클래스로 분리된 코드가 복잡하고 관리가 어렵다면 정적 팩토리 메소드를 이용하는 방법도 고려해볼 수 있다.

```java 

public final class Car {

    private static final Map<String, Car> FLYWEIGHT = new HashMap<>();

    private static final String NAME_SUFFIX = " 자동차";
    private final String name;

    private Car(String name) {
        this.name = name;
    }

    public static Car from(String name) {
        return FLYWEIGHT.computeIfAbsent(name, Car::new);
    }

    public String name() {
        return name + NAME_SUFFIX;
    }
}

```

### Client (static factory method)

정적 팩토리 메소드로 구현한 플라이웨이트 패턴의 클라이언트 코드는 정적 메소드로만 생성하면 되기 때문에 더욱 간단해진다.

```java 

@DisplayName("자동차")
class CarTest {

    @Test
    @DisplayName("정적 팩토리 메소드로 같은 이름의 자동차를 생성하면 같은 객체")
    void from() {
        //given
        String carName = "car";
        //when
        Car car1 = Car.from(carName);
        Car car2 = Car.from(carName);
        //then
        assertThat(car1).isSameAs(car2);
    }
}

```

전체 코드는 [깃허브 레포지토리](https://github.com/devyonghee/design-pattern-java/tree/master/flyweight) 참고

## Result
 
플라이웨이트 패턴은 생성되는 데이터를 공유하기 때문에 메모리를 절약할 수 있다. 
하지만 생성된 객체는 사용된 이후에도 참조가 남아있기 때문에 GC 의 대상이 되지 않고,  
상태가 변경되면 예기치 못한 문제가 발생될 수 있기 때문에 적절한 상황에서 사용하도록 하자.  

플라이웨이트 패턴은 사실 Java String Pool, 래퍼 클래스(Wrapper class) 의 `valueOf` 정적 메소드 등 많은 곳에서 활용되고 있다.

```java 

@DisplayName("flyweight 활용 예시")
class FlyweightTest {

    @Test
    @DisplayName("같은 문자열은 같은 객체")
    void string() {
        String abc1 = "abc";
        String abc2 = "abc";
        assertThat(abc1).isSameAs(abc2);
    }

    @Test
    @DisplayName("생성자를 이용한 문자열은 다른 객체")
    void string_constructor() {
        String abc1 = new String("abc");
        String abc2 = new String("abc");
        assertThat(abc1).isNotSameAs(abc2);
    }

    @Test
    @DisplayName("래퍼 클래스의 정적 팩토리 메소드로 생성하면 같은 객체")
    void integer_valueOf() {
        Integer one1 = Integer.valueOf("1");
        Integer one2 = Integer.valueOf("1");
        assertThat(one1).isSameAs(one2);
    }
}
```

플라이웨이트 패턴을 통해 생성된 객체를 공유하기 때문에 위 테스트 코드는 통과한다.
그러므로 `new` 키워드 대신 String literal(`""`), `valueOf` 를 이용하는 것이 메모리를 더 효율적으로 사용할 수 있다.

## 출처
- [https://en.wikipedia.org/wiki/Flyweight_pattern](https://en.wikipedia.org/wiki/Flyweight_pattern)
- [https://readystory.tistory.com/137](https://readystory.tistory.com/137)