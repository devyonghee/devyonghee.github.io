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
- 트리 구조의 클래스 들을 하나의 타입으로 쉽게 관리할 수 있다.
- 기존 코드의 수정 없이 새로운 클래스만으로 기능을 추가할 수 있어 확장에 용이하다.

## 단점
- 다양한 기능들을 인터페이스 하나에 포함되도록 설계하는 것이 어렵다.
- 객체들의 개인 특성이 많아지면서 캐스팅해서 사용하지 않도록 주의해야 한다.

## 구현

Composite pattern 을 이용하여 메뉴 구성을 구현해본다.  
메뉴 구성에는 메뉴라는 복합체(Composite) 객체가 있고 메뉴 아이템이라는 단일(Leaf) 객체가 있다. 

### Component

```java 

public interface MenuComponent {

    BigDecimal price();
}
```

### Composite

```java 

public class Menu implements MenuComponent {

    private final BigDecimal defaultPrice;
    private final List<MenuComponent> components = new ArrayList<>();

    public Menu(BigDecimal defaultPrice) {
        this.defaultPrice = defaultPrice;
    }

    public void add(MenuComponent component) {
        if (component == null) {
            throw new IllegalArgumentException("component to be added must not be null");
        }
        components.add(component);
    }

    public void remove(MenuComponent component) {
        if (component == null) {
            throw new IllegalArgumentException("component to be removed must not be null");
        }
        components.remove(component);
    }

    @Override
    public BigDecimal price() {
        return defaultPrice.add(componentsPrice());
    }

    private BigDecimal componentsPrice() {
        return components.stream()
                .map(MenuComponent::price)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
```


### Leaf

```java 

public class MenuItem implements MenuComponent {

    private final BigDecimal price;

    public MenuItem(BigDecimal price) {
        this.price = price;
    }

    @Override
    public BigDecimal price() {
        return price;
    }
}

```

전체 코드는 [깃허브 레포지토리](https://github.com/devyonghee/design-pattern-java/tree/master/composite) 참고

## Review

복합체 패턴(Composite Pattern)은 하나의 타입으로 관리할 수 있어서 편리한 패턴이다.  
하지만 `Composite` 는 본인의 역할과 자식들의 역할을 동시에 수행해야 하기 때문에 주의해서 사용하도록 하자


## 출처
- [https://en.wikipedia.org/wiki/Flyweight_pattern](https://en.wikipedia.org/wiki/Flyweight_pattern)
- [https://readystory.tistory.com/137](https://readystory.tistory.com/137)