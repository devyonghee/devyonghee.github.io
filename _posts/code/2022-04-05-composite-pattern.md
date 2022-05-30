---
title: '[Design Pattern] 복합체 패턴(Composite Pattern)'
tags: [design-pattern, visitor-pattern]
categories: code
---

복합체 패턴(Composite Pattern) 은 구조(structural) 패턴 중 하나로   
여러 객체를 지닌 복합 객체와 단일 객체를 동일하게 사용할 수 있는 패턴이다.

<!--more-->

객체를 트리(tree)구조로 구성하여 부분-전체 계층을 표현한다.  
Composite = Composite + Leaf 의 형식으로 재귀적인 특성을 띄고 있다.

## 구조

{% include image.html alt="composite pattern structure" path="images/code/composite-pattern/structure.png" %}

### Component

- 복합 객체(Composite) 와 단일 객체(Leaf)를 동시에 접근하고 관리하기 위한 인터페이스
- 공통적으로 가져야 할 기능들 정의

### Composite

- Component를 통해 자기 자신(Composite) 과 단일 객체(Leaf)들을 관리
- 하위 객체들에 접근하고 요청에 대한 작업을 구현

### Leaf

- 하위 객체가 존재하지 않는 단일 객체
- Component 에서 정의된 메소드들의 기본 작업을 구현

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
- [https://ko.wikipedia.org/wiki/%EC%BB%B4%ED%8F%AC%EC%A7%80%ED%8A%B8_%ED%8C%A8%ED%84%B4](https://ko.wikipedia.org/wiki/%EC%BB%B4%ED%8F%AC%EC%A7%80%ED%8A%B8_%ED%8C%A8%ED%84%B4)
- [https://icksw.tistory.com/243](https://icksw.tistory.com/243)