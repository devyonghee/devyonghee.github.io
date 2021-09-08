---
title: 코드 스피츠 Object83 6회차 정리
tags: [강의, 설계]
categories: lecture
---

<!--more-->

디자인 pattern 에서 가장 중요한 pattern 은 **abstract factory method pattern**, **command pattern** 이다.

## 합성과 의존성

**객체망**을 구성할 때, **의존성** 없이 객체 망이 될 수 없으므로 그만큼 **의존성 관리**가 중요하다.
하지만 적절한 **의존성** 관리라는 건 명확하지 않으므로 **의존성**의 방향이 **양방향**으로 되지 않도록 주의 해야 한다.
**합성**이나 **상속** 할 때 **의존성**의 방향 때문에 많은 문제가 일어난다.
그래서 이러한 의존성 문제를 해결하는 방법과  
**design pattern** 중 **template method pattern** 과 **strategy pattern** 통해서 합성과 상속의 차이까지 알아본다.
 
### Template method

```java 

abstract class DiscountPolicy {
    private Set<DiscountCondition> conditions = new HashSet<>();

    public void addCondition(DiscountCondition condition) {
        conditions.add(condition);
    }

    public Money calculateFee(Screening screening, int count, Money fee) {
        for (DiscountCondition condition : conditions) {
            if (condition.isSatisfiedBy(screening, count)) return calculateFee(fee);
        }
        return fee;
    }

    protected abstract Money calculateFee(Money fee);
}


```

`DiscountPolicy` 에 대해서 **Template method pattern** 을 적용했다.
`calculateFee` 가 `Template method` 로 작동하면서 `abstract method` 를 통해 `hook` 을 발생시키고 있다.

**Template method pattern** 은 일반적인 상속과 다르게 의존성의 방향이 보다 추상화된 쪽을 역전시키려고 하기 때문에 중요하다.
일반적인 **상속**을 하면 **의존성의 방향**이 자식이 부모를 가리키게 되면서 의존성이 굉장히 넓게 퍼져서 문제가 나타난다.
부모 수정의 여파가 모든 자식에게 가기 때문에 일반적인 상속은 사용하면 안된다.

하지만 **Template method pattern** 은 부모와 자식간의 관계를 역전 시킨다.
부모가 `abstract method` 를 `interface` 처럼 사용하여 부모가 자식을 알고 있게 되고 자식은 책임만 구현하면 된다.
자식은 독립된 인터페이스를 구현하고 부모가 자식의 `interface` 의존하기 때문에 수정이 서로에게 영향을 미치지 않는다.

```java 

public class AmountPolicy extends DiscountPolicy {
    public final Money amount;

    public AmountPolicy(Money amount) {
        this.amount = amount;
    }

    @Override
    protected Money calculateFee(Money fee) {
        return fee.minus(amount);
    }
}

```


**Template method pattern** 을 이용하여 `AmountPolicy` 를 만들었다.
`AmountPolicy` 는 `calculateFee` 만 구현하고 부모를 전혀 사용하지 않는다.

자식들은 부모의 지식을 함부로 사용하지 않고 미리 확정되어 있는 **protocol** 만을 이용해서 통신을 하고 있고 hollywood 원칙(Tell Don't Ask)을 지키고 있다. 
`getter` 로 이용해서 어떤 동작을 하지 않고 서로 시키고 있다. 
자식에서 `private` 가 아닌 `protected` 로 선언된 부모의 내부 속성이나 `getter`, `setter` 를 쓰고 있다면 좋지 않은 상속이다.
 
객체망에서 자식 객체를 생성하면 실제로 부모 객체도 하나의 포인터로 관리될 뿐이지 힙 메모리에 따로 저장된다.
그래서 별개의 객체라고 생각하고 서로 `interface` 로 통신을 해야한다.

### Strategy

**template method pattern** 을 **strategy pattern** 로 변경한다.
안정화되고 상속층으로 만들어도 될 거 같다면 **template method pattern** 을 사용하고,
유연하게 더 연결될 수 있을 것 같다면 **strategy pattern** 을 사용한다.
보통은 **strategy pattern** 으로 시작해서 유연성을 충분히 확보하고  안정화 됐다고 생각하면 **template method pattern** 으로 변경한다.


```java 

public class DiscountPolicy {
    private final Set<DiscountCondition> conditions = new HashSet<>();
    private final Calculator calculator;

    public DiscountPolicy(Calculator calculator) {
        this.calculator = calculator;
    }

    public void addCondition(DiscountCondition condition) {
        conditions.add(condition);
    }

    public Money calculateFee(Screening screening, int count, Money fee) {
        for (DiscountCondition condition : conditions) {
            if (condition.isSatisfiedBy(screening, count)) return calculator.calculateFee(fee);
        }
        return fee;
    }
}

```
**strategy pattern** 상에서는 합성의 원리를 사용하게 되므로 `calculateFee` 를 처리하는 `calculator` 를 소유 하게 된다.
그래서 `DiscountPolicy` 는 외부 객체의 도움을 받는 단일 클래스가 되었다.

```java 

public class AmountCalculator implements Calculator {
    public final Money amount;

    public AmountCalculator(Money amount) {
        this.amount = amount;
    }

    @Override
    public Money calculateFee(Money fee) {
        return fee.minus(amount);
    }
}

```

`calculator` 를 상속받은 `AmountCalculator` 가 `calculateFee` 라는 `interface` 를 구현한다.
코드는 거의 동일하지만 상속을 이용하지 않고 `interface` 로 통신할 뿐이다.
**template method pattern** 이 하는 일을 정확하게 **strategy pattern** 으로 변경할 수 있다.

```java 

public class AmountPolicy extends DiscountPolicy {
    public final Money amount;

    public AmountPolicy(Money amount) {
        this.amount = amount;
    }

    @Override
    protected Money calculateFee(Money fee) {
        return fee.minus(amount);
    }
}

```

두가지 **pattern** 을 비교해서 보면 결국, `DiscountPolicy` 라는 부모는 `Calculator` 의 역할을 하고 있었던 것이다.
즉, `abstract class` 를 `interface` 처럼 `protocol` 로 사용하고 있었던 것이다.
이처럼 `abstract class` 를 `interface` 처럼 사용해야 상속을 잘 사용하는 것이고 잘 만들어진 추상 layer 는 **strategy pattern** 로 쉽게 변경할 수 있다.


{% include image.html alt="template-with-strategy1" path="/images/lecture/code-spitz/template-with-strategy1.jpg" %}

상속을 사용해서 **template method pattern** 을 사용할 때 장점은 의존성 관계가 단순해진다.
관계가 `DiscountPolicy` 와 상속 받고 있는 `AmountPolicy` 밖에 없고 의존성도 역전 되었다.


**strategy pattern** 에서는 `DiscountPolicy` 가 `AmountCalculator` 를 직접 모르게 하기 위해서 중간에 `Calculator` 를 끼워 넣어 단방향 의존성을 해결 했다.
`DiscountPolicy` 의 무거운 역할이 `Calculator` 에게 옮겨지지만 수정이 어려워진다. 
즉, `interface` 에 대한 확신 없이 전략 패턴을 도입하면 여파가 오게 된다.

**strategy pattern** 을 쓰면 **template method pattern** 과 굉장히 유사해 보이지만 차이점이 존재한다.
**strategy pattern** 에서는 **strategy layer** 이라는 것이 생겨서 충격을 흡수함과 동시에 무거워진다.
**template method pattern**은 추상 메소드에 대한 무게가 생긴다. 

처음부터 정립된 domain 을 파악하기 힘들기 때문에 관계도를 분리해서 **strategy layer**가 여파를 흡수하도록 하여 유연성을 확보하고,
**template method pattern**을 통해서 관계를 단순화 시키고 방향성을 고정시킨다. 

### Template Method & strategy 

{% include image.html alt="template-with-strategy2" path="/images/lecture/code-spitz/template-with-strategy2.jpg" %}

**template method** 를 사용하게 된다면 `if` 를 통해서 원하는 `class` 를 선택하는 거에 비해
**strategy** 은 `DiscountPolicy`를 생성하고 합성해야 할 객체를 `if` 를 통해서 생성해야 한다.
**strategy pattern**은 pointer 의 pointer 를 원리를 이용하게 되므로 Runtime 에 언제든지 `Calculator` 를 바꿀 수 있지만 **template method pattern** 은 형 자체를 변경해야 한다.

각 pattern 에는 단점이 존재한다. 
**template method pattern** 은 자식이 중첩 구조인 경우에 조합할 수 있는 경우의 수가 계속 늘어나게 되서 **조합 폭발**이 발생한다.
상속을 이용해서 세트를 만들었기 때문에 **조합 폭발**이 일어난다.

이에 비해 합성은 Runtime 에 필요한 것들만 넣어주면 되므로 조합 폭발이 일어나지 않지만 의존성이 폭발한다. 
관계에 대해 알아야 되는 경우의 수만큼 들어오기 때문에 의존성 폭발이 발생한다.

{% include image.html alt="template-with-strategy3" path="/images/lecture/code-spitz/template-with-strategy3.jpg" %}

**template method pattern**를 사용해도 상속의 문제가 해결되지 않는다.
하지만 **strategy pattern**에서의 의존성 폭발은 해결할 수 있다.
**template method pattern**은 조합 폭발이 일어나는 것이 확정이기 때문에 **strategy pattern** 의 의존성 폭발을 해결 하는 방법을 알아본다.


## 생성 사용 패턴과 팩토리

**생성 사용 패턴**이라는 것은 객체를 만들기 위한 코드와 사용하는 코드가 있다는 것이다.
생명주기도 틀리고 관리하기 힘들기 때문에 이 두 코드를 병행해서 사용하면 안된다.

### 생성 사용 패턴

{% include image.html alt="create-use-pattern" path="/images/lecture/code-spitz/create-use-pattern.jpg" %}

생성 사용 패턴 이용해서 생성 코드와 이용 코드를 구분하고 **client** 쪽으로 밀어내서 **service** 코드를 줄이도록 한다.
그러면 **client** 에서 **service** 쪽으로 객체를 주입할 수 밖에 없는 일이 생긴다.

### Injection

{% include image.html alt="discountPolicy-injection.jpg" path="/images/lecture/code-spitz/discountPolicy-injection.jpg" %}

`Calculator` 는 바깥쪽에서 주도적으로 주입되었다.
**Injection**이 좋아 보이지만 바깥쪽에서 강제로 주입 당하고 있기 때문에 독립된 책임과 역할을 가지고 있던 `DiscountPolicy`이 제어권을 상실하게 된다.

### Factory

```java 

interface CalculatorFactory {
    Calculator getCalculator();
}

```

그래서 제어권을 역전하기 위해서 `factory` 를 만든다.
이 `factory` 는 원할 때 `Calculator`를 주는 지연 함수 같은 `interface` 가진다.


```java 

public class AmountCalculatorFactory implements CalculatorFactory {
    public final Money money;
    private AmountCalculator cache;

    public AmountCalculatorFactory(Money amount) {
        this.money = amount;
    }

    @Override
    synchronized public Calculator getCalculator() {
        if (cache == null) cache = new AmountCalculator(money);
        return cache;
    }
}

```

`pushed` 를 제거하고 객체를 원하는 시점에 특정 동작을 넣기 위해 `factory` 를 도입한다.
`factory` 를 구현하고 있는 `AmountCalculatorFactory` 를 보면 외부에서 `AmountCalculator` 를 원할 때 만들어서 제공하고 있고 내부에서는 `cache` 정책도 사용한다.
게다가, `synchronized` 로 선언하여 **multi thread** 에서도 원활하게 동작한다.

### Lazy Pull

```java 

public class DiscountPolicy {
    private final Set<DiscountCondition> conditions = new HashSet<>();
    private final CalculatorFactory supplier;

    public DiscountPolicy(CalculatorFactory supplier) {
        this.supplier = supplier;
    }

    public void addCondition(DiscountCondition condition) {
        conditions.add(condition);
    }

    public Money calculateFee(Screening screening, int count, Money fee) {
        for (DiscountCondition condition : conditions) {
            if (condition.isSatisfiedBy(screening, count)) {
                return supplier.getCalculator().calculateFee(fee);
            }
        }
        return fee;
    }
}

```

`DiscountPolicy` 는 본인이 원할 때 호출할 수 있도록 `factory`로 주입 받는다.
원할 때, `Calculator` 를 사용하게 되었지만 pointer 의 pointer 를 사용하고 있기 때문에 `DiscountPolicy` 는 `Factory` 가 어떤 `Calculator` 를 주고 있는지는 모르게 된다.
지연 연산을 통해 **Runtime** 에 다른 `Calculator` 를 받을 수 있는 가능성을 갖고 있는 것이다.

{% include image.html alt="lazy-pull1" path="/images/lecture/code-spitz/lazy-pull1.jpg" %}

그런데 여기에는 **디미터법칙**을 위반하는 (열차 전복 사고) 문제가 있다.
`DiscountPolicy` 는 필드나 속성에도 `Calculator` 에 대한 정보가 없지만 `Calculator` 지식을 사용하고 있다.
단순하게 객체를 반환하는 `Factory` 는 무조건 **디미터의 법칙**을 위반한다.

**디미터 법칙** 위반을 해결하기 위해 우리는 `DiscountPolicy` 가 `factory` 와 `calculator` 를 동시에 알게 하거나 `factory` 만 알도록 한다.

{% include image.html alt="lazy-pull2" path="/images/lecture/code-spitz/lazy-pull2.jpg" %}

`DiscountPolicy` 에 지역 변수나 field 에 선언해서 `factory` 와 `calculator` 를 알게 한다면 위와 같은 관계도를 얻게 된다.
`Factory` 와 `Calculator` 추상 클래스와 구상 클래스들 순환 참조가 생긴다. 
**factory circulation** 영역이 생겨서 양방향 참조가 성립하게 되서 **simple factory** 를 사용하면 안된다.


### 위임된 팩토리

{% include image.html alt="lazy-pull3" path="/images/lecture/code-spitz/lazy-pull3.jpg" %}

그래서 `factory`에게 책임을 위임해서  `factory` 만 알도록 변경한다.
`calculateFee` 자체를 위임한다.

```java

public interface CalculatorFactory {
    Money calculateFee(Money fee);
}

public class AmountCalculatorFactory implements CalculatorFactory {
    public final Money money;
    private AmountCalculator cache;

    public AmountCalculatorFactory(Money money) {
        this.money = money;
    }

    synchronized public Calculator getCalculator() {
        if (cache == null) cache = new AmountCalculator(money);
        return cache;
    }

    @Override
    public Money calculateFee(Money fee) {
        return getCalculator().calculateFee(fee);
    }
}

```

`Calculator` 의 지식이 `factory` 안으로 들어가게 되고 `DiscountPolicy` 는 `factory` 만 알 수 있게 된다.
이것을 **위임된 factory** 라고 한다.
**순환 참조**가 생기기 때문에 어쩔 수 없이 **위임된 factory pattern** 을 사용해야 한다.

```java 

public class DiscountPolicy {
    private final Set<DiscountCondition> conditions = new HashSet<>();
    private final CalculatorFactory supplier;

    public DiscountPolicy(CalculatorFactory supplier) {
        this.supplier = supplier;
    }

    public void addCondition(DiscountCondition condition) {
        conditions.add(condition);
    }

    public Money calculateFee(Screening screening, int count, Money fee) {
        for (DiscountCondition condition : conditions) {
            if (condition.isSatisfiedBy(screening, count)) {
                return supplier.calculateFee(fee);
            }
        }
        return fee;
    }
}

```

이렇게 되면 `DiscountPolicy` 코드를 줄일 수 있고 **열차 전복 사고**가 사라지고 **디미터의 법칙**을 지킬 수 있다.

{% include image.html alt="commission-to-factory1" path="/images/lecture/code-spitz/commission-to-factory1.jpg" %}

**위임된 factory**를 사용했는데 `factory` 의 `method` 가 `Calculator` 와 동일하다.
결국, **위임된 factory**는 구상 `Calculator` 자체가 되고 **위임된 factory** 의 `interface` 는 **factoring** 하려던 객체의 `interface` 와 일치 되는게 정상이다.
설계 중, 이 사실을 이해하지 못했다면 혼란이 왔을 것이다.

{% include image.html alt="commission-to-factory2" path="/images/lecture/code-spitz/commission-to-factory2.jpg" %}

`DiscountPolicy` 도 결국 `factory` 를 참고할 필요가 없기 때문에 원래대로 돌아온다.
**위임된 factory** 은 `factory` 가 보이지 않는다는 것이 특징이다. 
`Calculator` 를 위임했기 때문에 `Calculator` 와 똑같은 것이다.

{% include image.html alt="commission-to-factory3" path="/images/lecture/code-spitz/commission-to-factory3.jpg" %}

**위임된 factory**로 바꾸면 그림과 같은 관계도가 된다.
**factory pattern** 을 사용하여 `Calculator` 와 `AmountCalculatorFactory` 와 `AmountCalculator` 가 삼각형을 돌면서 순환참조가 생기는 것 같지만 
`AmountCalculator` 의 역할이 `AmountCalculatorFactory` 로 겸하게 되니까 `AmountCalculatorFactory` 가 사라지게 된다.

{% include image.html alt="commission-to-factory4" path="/images/lecture/code-spitz/commission-to-factory4.jpg" %}

그래서 **위임된 factory pattern** 를 사용하면 한줄만 남게 되면서 순환이 없어진다. 

## 추상 팩토리 메소드 패턴

**abstract factory method**는 의존성 폭발을 해결하기 위한 **pattern** 이기 때문에 
 `factory` 는 여러 객체를 반환할 수 있는 능력을 갖게 된다.

{% include image.html alt="discountCondition-change" path="/images/lecture/code-spitz/discountCondition-change.jpg" %}

`factory` 에게 `DiscountCondition` 도 반환하도록 변경하고 `DiscountPolicy` 는 `factory` 만 알도록 한다.
`factory` 에서 공급받는 종류가 2가지가 된다.

### DiscountCondition 위임

```java 

public interface PolicyFactory extends Calculator {
    Set<DiscountCondition> getConditions();
}

public class AmountCalculatorFactory implements PolicyFactory {
    public final Money money;
    private AmountCalculator cache;
    private final Set<DiscountCondition> conditions = new HashSet<>();

    public AmountCalculatorFactory(Money money) {
        this.money = money;
    }

    synchronized public Calculator getCalculator() {
        if (cache == null) cache = new AmountCalculator(money);
        return cache;
    }

    public void addCondition(DiscountCondition condition) {
        conditions.add(condition);
    }

    public void removeCondition(DiscountCondition condition) {
        conditions.remove(condition);
    }

    @Override
    public Money calculateFee(Money fee) {
        return getCalculator().calculateFee(fee);
    }

    @Override
    public Set<DiscountCondition> getConditions() {
        return conditions;
    }
}

```

여러 가지 객체를 반환했으면 **조합 폭발**이 발생했겠지만 `PolicyFactory`는 `Calculator` 이면서 `getCondition` 만 보내면 되니까 간단하다.
지금은 `discountPolicy` 가 `factory` 한개만 알도록 하고 의존성을 `AmountCalculatorFactory` 에게 몰아준다. 
사용 코드와 생성 코드가 나눠지고 `DiscountPolicy` 에는 사용 코드만 남았다.
**의존성**을 줄이기 위해서 **abstract factory method**을 사용했지만 **열차 전복 사고**를 주의 해야 한다.
 
{% include image.html alt="discountPolicy-demeter" path="/images/lecture/code-spitz/discountPolicy-demeter.jpg" %}

`foreach` 를 사용하기 때문에 `conditions` 에 대한 `iterator method` 호출로 **열차 전복 사고**가 내장되어 있다.
내부에서 `iterator` 를 호출하기 때문에 디미터의 법칙을 위반한다.
게다가 `DiscountCondition` 도 모르기 때문에 2중으로 디미터의 법칙을  위반하고 있다.
`foreach` 사용하는 부분을 위임하여 **디미터의 법칙**을 해소한다.

```java 
 
public interface PolicyFactory extends Calculator {
    default Money calculatorFee(Screening screening, int count, Money fee) {
        for (DiscountCondition condition : getConditions()) {
            if (condition.isSatisfiedBy(screening, count)) return calculateFee(fee);
        }
        return fee;
    }

    Set<DiscountCondition> getConditions();
}
 
```

`Policy`의 공통 로직을 `factory` 에 위임하기 때문에 `interface` 에서 `default method` 로 구현한다. 
`Factory` 는 `Condition` 을 알고 있었기 때문에 **디미터의 원칙**을 지킬 수 있고 `template method` 를 사용하게 되었다.
`template method` 에서 2가지 `hook` 을  사용 하는데 `Factory`에 조합 폭발이 미뤄진 것이다.

```java 

public class DiscountPolicy {
    private final PolicyFactory factory;

    public DiscountPolicy(PolicyFactory factory) {
        this.factory = factory;
    }

    public Money calculateFee(Screening screening, int count, Money fee) {
        return factory.calculateFee(screening, count, fee);
    }
}

```

 
그래서 `DiscountPolicy` 는 결국 `factory` 를 받아서 `calculateFee` 를 위임한다.
`DiscountPolicy` 가 `factory`로부터 `conditions` 와 `calculator` 를 공급 받았다면 `DiscountPolicy` 는 모든 지식을 알게 되고 결국 의존성만 생기게 된다.
`factory` 에 대한 의존성만 남겨두려면 `factory` 쪽으로 로직이 이동할 수 밖에 없다.
공통되서 옮긴게 아니라 `conditions` 와 `calculator` 의 의존성을 `factory` 로 옮기기 위한 것이다.
결국, **abstract factory method pattern** 조차도 **위임된 factory pattern** 로 되는 것이다.
`factory`의 `default method` 에는 의존성 폭발이 생기지만 `DiscountPolicy` 는 보호되어 변화가 없으니까 `DiscountPolicy` 을 의존하는 객체들은 안전해진다.
그래서 한 객체에 의존하는 객체가 있으면 그 객체 부터 확정 짓고 작업을 해야 한다.
