---
title: '[Design Pattern] Specification Pattern'
tags: [design-pattern, visitor-pattern]
categories: code
---

Specification pattern 은 
복잡한 비즈니스 규칙이 있는 불리언 로직을 간단하게 표현할 수 있는 패턴이다.

<!--more-->

Specification pattern 을 이용하면 논리 연산하는 복잡한 로직을 객체지향적으로 표현할 수 있으며,  
하나의 객체로 두고 재활용할 수 있다는 것이 장점이다.

논리연산이 중복되거나 그 의미를 명확하게 표현하고 싶다면 유용하게 사용할 수 있는 패턴이다. 


## 구조

{% include image.html alt="Specification pattern structure" path="images/code/specification-pattern/specification-structure.png" %}

구현하는 방식에 따라 조금씩 차이가 있을 수 있지만 나는 위와 같이 정의했다.  
인터페이스에서 마지막에 참, 거짓을 판단하는 `isSatisfiedBy` 메소드와 논리연산을 하는 `and`, `or`, `not` 을 정의한다.

추상 클래스에서는 논리 연산 메소드드들에서는 각각 알맞는 구현체들을 반환해주고  
구현체들은 본인의 역할에 맞는 `isSatisfiedBy` 만 구현하면 된다.


## 구현

나의 경우에는 인터페이스를 정의하면서 타입 안전하게 사용할 수 있도록 제너릭을 추가했다.  
이렇게 제너릭을 이용하면 내부에서 캐스팅없이 원하는 객체의 타입을 다룰 수 있다. 

또한, 더 유연하게 사용하기 위해 상위 타입의 `Specification` 도 수용할 수 있도록 `super` 키워드도 추가했다.

### Specification

인터페이스에서 `and`, `or`, `not` 이외에도 필요한 논리 연산이 있다면 메소드를 추가하도록 한다.

```java  

interface Specification<T> {

    Specification<T> and(Specification<? super T> other);
    Specification<T> andNot(Specification<? super T> other);
    Specification<T> or(Specification<? super T> other);
    Specification<T> orNot(Specification<? super T> other);
    Specification<T> not();
    boolean isSatisfiedBy(T candidate);
}

```


### CompositeSpecification (Abstract Class)

```java

public abstract class CompositeSpecification<T> implements Specification<T> {
    @Override
    public Specification<T> and(Specification<? super T> other) {
        return new AndSpecification<>(this, other);
    }
    @Override
    public Specification<T> andNot(Specification<? super T> other) {
        return new AndNotSpecification<>(this, other);
    }
    @Override
    public Specification<T> or(Specification<? super T> other) {
        return new OrSpecification<>(this, other);
    }
    @Override
    public Specification<T> orNot(Specification<? super T> other) {
        return new OrNotSpecification<>(this, other);
    }
    @Override
    public Specification<T> not() {
        return new NotSpecification<>(this);
    }
}
```

### implementation

```java 

public class AndSpecification<T> extends CompositeSpecification<T> {

    private final Specification<? super T> leftCondition;
    private final Specification<? super T> rightCondition;

    public AndSpecification(Specification<? super T> leftCondition, Specification<? super T> rightCondition) {
        this.leftCondition = leftCondition;
        this.rightCondition = rightCondition;
    }
    @Override
    public boolean isSatisfiedBy(T candidate) {
        return leftCondition.isSatisfiedBy(candidate) && rightCondition.isSatisfiedBy(candidate);
    }
}
```

```java 

public class OrNotSpecification<T> extends CompositeSpecification<T> {

    private final Specification<? super T> leftCondition;
    private final Specification<? super T> rightCondition;

    public OrNotSpecification(Specification<? super T> leftCondition, Specification<? super T> rightCondition) {
        this.leftCondition = leftCondition;
        this.rightCondition = rightCondition;
    }
    @Override
    public boolean isSatisfiedBy(T candidate) {
        return leftCondition.isSatisfiedBy(candidate) || !rightCondition.isSatisfiedBy(candidate);
    }
}
```

```java 
public class NotSpecification<T> extends CompositeSpecification<T> {

    private final Specification<? super T> condition;

    public NotSpecification(Specification<? super T> condition) {
        this.condition = condition;
    }
    @Override
    public boolean isSatisfiedBy(T candidate) {
        return !condition.isSatisfiedBy(candidate);
    }
}
```

전체 코드는 [깃허브 레포지토리](https://github.com/devyonghee/design-pattern-java/tree/master/specification) 참고

## Review

Specification 패턴은 복잡한 논리연산을 쉽게 정리하고 재활용할 수 있는 유용한 패턴이다.  
여기에서는 코드를 직접 구현했지만 `java` 에서는 `Predicate<T>`이 이 패턴을 이용했기 때문에 직접 구현할 필요는 없다.  
그래서 `Predicate<T>`를 많이 이용하는 `Stream` API 에서도 이 패턴을 유용하게 사용할 수 있다.

## 출처
- [https://en.wikipedia.org/wiki/Specification_pattern](https://en.wikipedia.org/wiki/Specification_pattern)