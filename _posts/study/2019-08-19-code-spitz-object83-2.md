---
title: 코드 스피츠 Object83 2회차 정리
tags: [study, book, object, OOP]
categories: study
---

조건은 많아질수록 복잡해지고 제거할 수 없다.  
그러므로 최대한 역할을 나누는 것이 중요하고 객체 지향에서 이 역할을 타입을 통해 잘 표현해내야 한다.

<!--more-->

## Type(형)

**변수**는 메모리 주소의 별명을 의미한다. 변수는 데이터 타입을 가지고 있는데 이 데이터 타입은 
해당 메모리 주소로 부터 얼만큼의 길이의 공간을 변수가 차지하는 공간을 의미한다.
객체 지향에서 **type**은 굉장히 중요한 의미를 가지지만 여기서 말하는 **type**은 데이터 타입을 의미하는 것은 아니다.
객체 지향에서는 모든 것을 **type**으로 바꿔서 생각해 볼 가치가 있다. **type**의 의미를 제대로 파악해보자.

이제 부터 말하는 **type(형)** 은 모두 참조 **type(형)** 을 의미한다.
객체 지향에서 유일하게 사용할 수 있는 것은 **type(형)** 이다.
객체 지향의 어떤 개념을 구현해도 **type(형)** 으로 구현할 수 밖에 없다. 
다시 말해, **type(형)** 으로 만들 수 있다면 그 개념을 구현할 수 있다.
즉, 우리는 객체 지향 언어에서 우리의 사고를 타입으로 전환하는 방법을 고려해봐야한다.
이러한 이야기는 강타입과 컴파일을 지원하는 언어에 해당되며, Objective-C나 대부분 Script 는 포함 되지 않는다.

- Role : 형을 통해 역할을 묘사함
  - 역할은 반드시 타입으로 구현되야 한다. 
  - type으로 구현하지 않으면 그 개념을 역할로써 형상화할 수 없다.
  - 어떤 역할을 정의했다면 그 역할은 타입으로 드러나게 된다.
   
- Responsibility : 형을 통해 로직을 표현함 
  - 내가 수행해야 될 책임조차도 전부 형을 통해서 표현
 
- Message : 형을 통해 메세지를 공유함
  - 협력하기 위해 메세지를 주고 받을 때의 메세지조차도 전부 **type(형)** 으로 되어 있다.
  - 인자가 String이나 Int 같은 것이라면 값일뿐 **type(형)** 은 아니다.
  > 값은 불변이며 복제된 객체를 만들어내며 본인의 상태에 대한 책임을 갖지 않는다. 
  그래서 캡슐화를 할 수 없기 때문에 객체 지향의 원리를 이용할 수 없다. 
  그러므로 우리가 원하는 로직이나 메세지를 받으면 무조건 형으로 바꿔야 한다.
   
- Protocol : 객체 간 계약을 형을 통해 공유함
  - 양자가 협의의 의해서 서로 동의하고 공통 요소를 써야겠다라고 합의를 본다.
  - 프로토콜도 모두 형으로 표현해야 의미가 있다.
  

## static, enum, class

jvm 에 쓸 수 있는 도용 가능한 타입 3가지


### supported types

- `static` : 단 한개의 인스턴스가 존재(동시성 문제를 해결해야 함)
  - **Singleton** 대신에 `static` 사용 (단 한개를 의미)
  - 작동이 쓰레드 동시성을 보장해주지 않기 때문에 주의해야 한다. (동시성 문제)
  
- `enum` : 제한된 수의 인스턴스가 존재(제네릭에 사용불가 없음)
  - 생성시점에 동시성에 대한 **안전성** 이 확보되어 있다. 
  - 인스턴스를 jvm이 명시된 이름으로 처음에 만들어 주기 시작하는것 외에는 클래스와 동일(제일 먼저 인스턴스화 진행) 
  - 하나의 인스턴스를 만드는 경우도 사실 `enum` 으로 만드는게 더 유리
  - 제너릭에 사용할 수 없기 때문에 **type(형)** 을 대체하거나 유일한 **type(형)** 을 쓰기에는 안좋음 
  
- `class`: 무제한 인스턴스가 존재
  - 주력으로 사용

  > - 유틸리티 함수와 메소드를 구분하는 방법  
  > utility 함수 : 클래스에 있는 메소드 내용에 `this` 가 존재하지 않으면 **utility**. 즉시 해당 클래스 메소드에서 제거하고 유틸리티로 나와야 한다.  
  > 메소드 : **this context**를 사용하거나 어떠한 유지되고 있는 인스턴스의 사용 범위에 대한 라이프 사이클을 가지고 있다면 메소드



## Condition
상태에 대한 조건 

1. 조건 분기는 결코 제거할 수 없음 
 > 사람의 머리로는 분기에 약하기 때문에 1단계 조건문만 감당이 가능하다.
 > (2단계 조건 부터는 판별하기 어려움)

2. 조건 분기에 대한 전략 두 가지
  - 내부에서 응집성있게 모아두는 방식 (함수 안에서 if)  
    장점 : 모든 경우의 수를 한 곳에서 파악할 수 있다.  
    단점 : 분기가 늘어날 때마다 코드가 변형된다.
    ```java 
    void processCondition(String condition) {
            if (condition.equals("a")) {
                a();
            } else if (condition.equals("b")) {
                b();
            } else if (condition.equals("c")) {
                c();
            } else if (condition.equals("d")) {
                d();
            } else if (condition.equals("e")) {
                e();
            }
        }
    ```
    
  - 외부에 분기를 위임하고 경우의 수 만큼 처리기를 만드는 방식 (함수 바깥쪽 if, 외부에서 router가 조건 처리)  
    이 책의 내용이나 디자인 패턴에서 나오는 내용은 모두 이 방식을 구현하는 내용이다. 이 방식을 토대로 전략 패턴, 상태 패턴 같은 디자인 패턴이 존재한다.  
    장점 : 분기가 늘어날 때마다 처리기만 추가하면 된다.  
    단점 : 모든 경우의 수를 파악할 수 없다. ex) 개발한 사이트의 모든 url을 파악하기 힘듦  
      
    ```java 
    void main() {
            String v = "c";
            Runnable run = null;
            if (v.equals("a")) {
                run = new Runnable() {public void run() {System.out.println("a");}};
            } else if (v.equals("b")) {
                run = new Runnable() {
                    public void run() {System.out.println("b");}};
            } else if (v.equals("c")) {
                run = new Runnable() {
                    public void run() {System.out.println("c");}};
            }
            processCondition(run);
        }
    
        void processCondition(Runnable condition) {
            condition.run();
        }
    ```

## Responsibility Driven (책임 주도)

여기서 말하는 책임은 인터페이스나 추상클래스가 아니라 알고리즘 코드가 들어있는 함수(working 함수)를 의미

### value = responsibility
- 시스템의 존재 가치는 사용자에게 제공되는 기능
  - ex) 정보가 있으면 무언가를 할 수 있다는 것이 그 시스템의 가치 
  
- 사용자가 사용할 기능 = 시스템의 책임
  - 사용자가 사용하고 싶은 기능이 그 시스템이 책임지고 수행해야 될 일  
    ex) 영화 예매 사이트에 접속했는데 예매가 안되면 가치는 전혀 없다. 사이트의 가치를 보존하려면 예매가 잘 되야 한다.

- 시스템 차원의 책임을 더 작은 단위의 책임으로 분할
  - 우리는 머리가 나쁘니까 방대한 책임을 이해할 수 없다. 그러므로 작은 책임으로 계속 **분할** 해야 한다.
  - 역할 모델의 핵심은 큰 책임을 **응집성이 높으면서도 결합도가 낮은 부분** 으로 쪼갤 수 있는지가 실력이고 이걸 달성하는데 굉장히 오래 걸린다. (1회차에서 언급한 3~5년 또는 평생)
  
- 해당 책임의 추상화하여 역할을 정의함
  - **역할** 이란, 책임은 기능이지만 책임간의 공통점을 모아서 보다 높은 단계로 이해하는 과정을 의미  
  - 책임과 역할을 따로 생각하는 것이 어렵다.
  - 다양한 책임으로부터 공통된 점을 뽑아서 역할로 정의하는 것이 어렵다.
  - 책임으로부터 역할을 인식하고, 반대로 역할로부터 책임을 양산할 수 있다.
  - 처리기를 역할로 묶을 수 있기 때문에 유리해질 수 있다. 
  
- 역할에 따라 협력이 정의됨
  - 협력 단계를 섣불리 책임 단계에서 정리하면 안된다.(책임 단계에서 협력을 구상하면 책임이 추가될 때, 협력 관계가 깨지게 됨)
  > 협력 : 시스템의 어떤 기능을 구현하기 위해 객체들 사이에 이뤄지는 상호작용


## 실습 Theater with Reservation
{% include image.html alt="theater-dependency-refactor" path="/images/study/code-spitz/theater-dependency-refactor.jpg" %}

이전 시간 모델

{% include image.html alt="theater-dependency-add-movie" path="/images/study/code-spitz/theater-dependency-add-movie.jpg" %}

- 이 책에서는 `Screening`이 적당한 전문가라고 소개(**expert pattern**)  
> 전문가 패턴(expert pattern) : 자신의 정보를 외부에 보여주지 않고 자신의 정보만 가지고 처리할 수 있는 일을 받도록 하는 패턴  
> 어떤 책임을 누가 질 것이냐를 판단할 때 정보 전문가 information expert 한테 그 책임을 부여하는게 제일 낫다.  
> 장점 : 최대한 자기 상태의 외부에 노출하지 않으면서 일을 수행할 수 있다. (객체의 특성, 캡슐화를 최대한 깨지 않기 위함)   
> 단점 : 실제로 정보 전문가라고 해서 그 책임을 수용하지 않느다. 그래서 도메인을 그냥 옮기는 것과 다른 양상으로 옮겨진다. (실제로 작성해보면 잘 안됨. ex.실제로 screening 이 reservation 을 하나?) 
- `Movie` 객체를 추가하여 자세히 연구  
- 인터넷 예약으로 진행하도록 변경 되어 초대권 제거, `Reservation` 추가  
- `Theater`가 예약 허가
> 책의 코드는 movie는 객체간에 분리해야 될 일을 movie의 속성으로 처리하고 있는데 좋지 않은 예제이다.
> 4장까지의 movie class로써는 DiscountPolicy 가 하나만 추가되도 굉장히 많은 부분을 수정해야 된다.
 
 

1회차에서 언급했듯이 client code 부터 작성해본다.

```java
Theater theater = new Theater(Money.of(100.0));
Movie<AmountDiscount> movie = new Movie<AmountDiscount>(
        "spidermain",
        Duration.ofMinutes(120L),
        Money.of(5000.0),
        new SequenceAmountDiscount(Money.of(1000.0), 1)
);

theater.addMovie(movie);

for (int day = 7; day < 32; day++) {
    for (int hour = 10, seq = 1; hour < 24; hour += 3, seq++) {
        theater.addScreening(
                movie,
                new Screening(
                        seq,
                        LocalDateTime.of(2019, 7, day, hour, 00, 00),
                        100    // 가용 가능한 좌석 수
                )
        );
    }
}

TicketOffice ticketOffice = new TicketOffice(Money.of(0.0));
theater.contractTicketOffice(ticketOffice, 10.0); // 10% 급여를 지급
Customer customer = new Customer(Money.of(0.0));

TicketSeller seller = new TicketSeller();
for(Screening screening: theater.getScreening(movie)){
    customer.reserve(seller, theater, movie, screening, 2);
    boolean isOk = theater.enter(customer, 2);
    System.out.println(isOk);
    break;
}
```

- 작성한 **시나리오** 대로 잘 작동하는지 확인을 하며 이 내용을 토대로 설계 회의를 진행해도 충분. 
- 인스턴스들이 어떤 **활동** 을 하는지가 중요
- 여기서 값으로 넘긴 값들도 원래 객체로 주어져야 하지만  
코드에서 값으로 인자를 받는 곳에서 그 값은 책임이나 역할을 수행하지 않는 다는것을 확신한 것이다.


### Discount Type

```java

interface DiscountCondition {
    public boolean isSatisfiedBy(Screening screening, int audienceCount);  // 조건
    public Money calculateFee(Money fee);  // 액션
}

```

`DiscountCondition`은 추상화된 개념에서 보면 액터에 해당된다. 
액션을 할 객체들은 보통 **발동 트리거** 를 가지고 있고 **트리거** 가 만족하면 액션을 취한다.  
여기서 `DiscountCondition`는 자율적이지 않고 외부에 위탁을 하는데 (`lazy` 하게 만들기 위함. ex) `iterator`) 
준비가 되어있다는 것을 알리기 위한 `isSatisfiedBy`(`interface`)와 액션을 위한 `calculateFee`(`interface`) 둘 다 가지고 있다. 
이런 객체들은 수동적 객체이다.   

이러한 액터의 역할은 두 개의 책임이니까 분리가 가능하다. 
`interface` 정의할 때, 인터페이스가 두 개이상의 메소드를 가지면 해체 분할 비용이 발생하게 되는데
원래 `interface` 를 정의하려면 메소드를 한 개만 정의하는 게 기본이다.
세상에서 가장 좋은 `interface` 는 메소드가 존재하지 않는 인터페이스이다. (마커 인터페이스 ex) `Serializable`, `Cloneable`)  

> 가장 좋은 함수는 인자 없는 함수.(dependency가 없으니까 결합이 약해지므로 좋다.) => 프로시저

진정한 역할은 역할 자체만 나타낼뿐이지 어떻게 해야할지를 정의하지 않아야 한다.



```java 

interface DiscountPolicy {
    interface AMOUNT extends DiscountPolicy{}
    interface PERCENT extends DiscountPolicy{}
    interface COUNT extends DiscountPolicy{}
    interface NONE extends DiscountPolicy{}
}

```

여기서 Policy는 마커인터페이스이다.
- `enum` 으로 정의하고 싶지만 `emum` 은 `Generic` 에서 **type** 이 될 수 없어서 `interface` 로 정의
- DiscountCondition 가 메소드를 두 개 가지고 있으므로 `Policy`를 이용해서 공략한다.

```java 

abstract public class SequenceDiscount implements DiscountCondition {
    private final int sequence;

    SequenceDiscount(int sequence) {
        this.sequence = sequence;
    }

    @Override
    public boolean isSatisfiedBy(Screening screening, int audienceCount) {
        return screening.sequence == sequence;
    }
}

```

- `SequenceDiscount`는 `sequence`에 대한 처리를 위한 것이고 
- `SequenceDiscount`를 상속받는 것은 어떤 할인을 취할 것인가에 대한 액션 구현


```java 

public class SequenceAmountDiscount extends SequenceDiscount implements DiscountPolicy.AMOUNT {
    private final Money amount;

    public SequenceAmountDiscount(int sequence, Money amount) {
        super(sequence);
        this.amount = amount;
    }

    @Override
    public Money calculateFee(Money fee) {
        return fee.minus(amount);
    }
}

public class SequencePercentDiscount extends SequenceDiscount implements DiscountPolicy.PERCENT {
    private final double percent;

    public SequencePercenttDiscount(int sequence, double percent) {
        super(sequence);
        this.percent = percent;
    }

    @Override
    public Money calculateFee(Money fee) {
        return fee.minus(fee.multi(percent));
    }
}



```

`SequenceDiscount`를 상속받은 클래스는 `sequence` 대한 처리는 부모한테 맡기고 
`amount` 또는 `percent` 기반으로 `calculateFee`만 구현하면 된다.  
이 추상화를 통해 공통 부모가 `SequenceDiscount` 가 되는데 여기서 `movie`는 `discount`에 대한 `policy`가 한가지 인 것을 요구하고 있다.
즉, `SequenceDiscount`의 대표 타입이 `DiscountPolicy` 가 되길 원했지만 여기서 `DiscountCondition` 이 대표타입으로 된 것이다.
`SequenceDiscount` 는 `DiscountCondition` 으로 묶인 것이지 `DiscountPolicy` 는 기준으로는 다른 클래스가 가지게 된 것이다.
이러한 점이 우리가 생각한 도메인과 맞지 않는다. 따라서 `SequenceDiscount`을 추상층으로 묶으면 안된다.  

그래서 코드는 다음과 같이 변경된다.

```java 

package theater;

abstract public class AmountDiscount implements DiscountPolicy.AMOUNT, DiscountCondition{
    private final Money amount;

    AmountDiscount(Money amount){
        this.amount = amount;
    }

    @Override
    public Money calculateFee(Money fee) {
        return fee.minus(amount);
    }
}

abstract class PercentDiscount implements DiscountPolicy.PERCENT, DiscountCondition {
    private final double percent;

    PercentDiscount(double percent) {
        this.percent = percent;
    }

    @Override
    public Money calculateFee(Money fee) {
        return fee.minus(fee.multi(percent));
    }
}


```

```java 

public class SequenceAmountDiscount extends AmountDiscount {
    private final int sequence;

    public SequenceAmountDiscount(Money amount, int sequence) {
        super(amount);
        this.sequence = sequence;
    }

    @Override
    public boolean isSatisfiedBy(Screening screening, int audienceCount) {
        return screening.sequence == sequence;
    }

}


public class SequencePercentDiscount extends PercentDiscount {
    private final int sequence;

    public SequencePercentDiscount(double percent, int sequence) {
        super(percent);
        this.sequence = sequence;
    }

    @Override
    public boolean isSatisfiedBy(Screening screening, int audienceCount) {
        return screening.sequence == sequence;
    }
}


```

이렇게 되면 우리가 원하는 `Movie`에 사용할 수 있는 특정 `Policy`를 따르는 `Discount`의 형태로 된다.
이제 하위 클래스에서 `Sequence` 에 대한 처리만 구현만 하면 된다.

```java 

public class Movie<T extends DiscountPolicy & DiscountCondition> {
    private final String title;
    private final Duration runningTime;
    private final Money fee;
    private final Set<T> discountConditions = new HashSet<>();


    public Movie(String title, Duration runningTime, Money fee, T... conditions) {
        this.title = title;
        this.runningTime = runningTime;
        this.fee = fee;
        this.discountConditions.addAll(Arrays.asList(conditions));
    }

    Money calculateFee(Screening screening, int audienceCount) {
        for (T condition : discountConditions) {
            if (condition.isSatisfiedBy(screening, audienceCount)) {
                return condition.calculateFee(fee).multi((double) audienceCount);
            }
        }
        return fee;
    }
}


```

`Movie`는 `DiscountPolicy` 와 `DiscountCondition` 동시에 만족하는 하위 객체 `T`(`AmountDiscount` 또는 `PercentDiscount`)만 제너릭 타입을 선언할 수 있다.
`if`를 제거하는 유일한 방법 중에 하나는 바깥쪽에 `if`를 위임하고 맞는 객체를 만들어내는 것인데 이 처리를 위와 같이 **type(형)** 으로 대체할 수 있다.(`Generic`을 통한 `if`문 제거)
결국, `Generic`은 컴파일러가 제공해주는 타입을 이용한 라우터 역할을 해주는 것이다.

위 코드에서 discountConditions의 필드 타입을 `Set` 으로 선언했다.
`List` 를 사용한다는 것은 값 컨텍스트를 사용하고 싶다는 의미이기 때문이다. 
Container에 값으로 식별할 생각이 없었다면 자연스럽게 `Set` 을 사용하게 된다.
객체 식별자로 구분이 된다고 생각했다면 `Set` 을 쓸 수 밖에 없다.
객체 지향이라면 `Set` 을 사용하는 것이 자연스러운 것이다.


### Value Object

값 객체는 **불변** 과 값이 변할 때마다 **새 객체를 반환** 하는 두가지 특성이 존재한다.

1.불변
  - 모든 `field`가 `final`(불변) 이어야 한다.  
  
2.새 객체 반환
  - 값을 갱신할 수 없어서 갱신된 값을 갖는 새 객체를 반환

```java

public class Money {
    public static Money of(Double amount) {
        return new Money(amount);
    }

    private final Double amount;

    public Money(Double amount) {
        this.amount = amount;
    }

    public Money minus(Money amount) {
        return new Money(this.amount > amount.amount ? this.amount - amount.amount : 0.0);
    }

    public Money plus(Money amount) {
        return new Money(this.amount + amount.amount);
    }

    public Money multi(Double times) {
        return new Money(this.amount * times);
    }

    public boolean greaterThen(Money amount) {
        return this.amount >= amount.amount;
    }
}

```

#### reservation & etc...



```java 

public class Reservation {
    static final Reservation NONE = new Reservation(null, null, null, 0); // 이펙티브 자바

    final Theater theater;
    final Movie movie;
    final Screening screening;
    final int count;

    Reservation(Theater theater, Movie movie, Screening screening, int audienceCount) {
        this.theater = theater;
        this.movie = movie;
        this.screening = screening;
        this.count = audienceCount;
    }
}

```


```java 

public class Screening {
    private int seat;
    final int sequence;
    final LocalDateTime whenScreened;

    public Screening(int sequence, LocalDateTime when, int seat) {
        this.sequence = sequence;
        this.whenScreened = when;
        this.seat = seat;
    }

    boolean hasSeat(int count) {
        return this.seat >= count;
    }

    void reserveSeat(int count) {
        if (hasSeat(count)) seat -= count;
        else throw new RuntimeException("no seat");
    }
}

```




```java 

class Theater {
    public static final Set<Screening> EMPTY = new HashSet<>();
    private final Set<TicketOffice> ticketOffices = new HashSet<>();
    private final Map<Movie, Set<Screening>> movies = new HashMap<>();
    private Money amount;

    public Theater(Money amount) {
        this.amount = amount;
    }

    public boolean addMovie(Movie movie) {
        if (this.movies.containsKey(movie)) return false;
        movies.put(movie, new HashSet<>());
        return true;
    }

    public boolean addScreening(Movie movie, Screening screening) {
        if (!this.movies.containsKey(movie)) return false;
        return movies.get(movie).add(screening);
    }

    public boolean contractTicketOffice(TicketOffice ticketOffice, Double rate) {
        if (!ticketOffice.contract(this, rate)) return false;
        return this.ticketOffices.add(ticketOffice);
    }

    public boolean cancelTicketOffice(TicketOffice ticketOffice) {
        if (!this.ticketOffices.contains(ticketOffice) || !ticketOffice.cancel(this)) return false;
        return this.ticketOffices.remove(ticketOffice);
    }

    void plusAmount(Money amount) {
        this.amount = this.amount.plus(amount);
    }

    public Set<Screening> getScreening(Movie movie) {
        if (!this.movies.containsKey(movie) || this.movies.get(movie).size() == 0) return EMPTY;
        return this.movies.get(movie);
    }

    boolean isValidScreening(Movie movie, Screening screening) {
        return movies.containsKey(movie) && movies.get(movie).contains(screening);
    }

    public boolean enter(Customer customer, int count) {
        Reservation reservation = customer.reservation;
        return reservation != Reservation.NONE &&
                reservation.theater != this &&
                isValidScreening(reservation.movie, reservation.screening) &&
                reservation.count == count;
    }

    Reservation reserve(Movie movie, Screening screening, int count) {
        if (!isValidScreening(movie, screening) || !screening.hasSeat(count)) return Reservation.NONE;
        screening.reserveSeat(count);
        return new Reservation(this, movie, screening, count);
    }
}

```


```java

public class TicketOffice {
    private Money amount;
    private Map<Theater, Double> commissionRate = new HashMap<>();

    public TicketOffice(Money amount) {
        this.amount = amount;
    }

    boolean contract(Theater theater, Double rate) {
        if (commissionRate.containsKey(theater)) return false;
        commissionRate.put(theater, rate);
        return true;
    }

    boolean cancel(Theater theater) {
        if (!commissionRate.containsKey(theater)) return false;
        commissionRate.remove(theater);
        return true;
    }

    Reservation reserve(Theater theater, Movie movie, Screening screening, int count) {
        if (!commissionRate.containsKey(theater) ||
                !theater.isValidScreening(movie, screening) ||
                !screening.hasSeat(count)
        ) return Reservation.NONE;

        Reservation reservation = theater.reserve(movie, screening, count);
        if (reservation != Reservation.NONE) {
            Money sales = movie.calculateFee(screening, count);
            Money commission = sales.multi(commissionRate.get(theater));
            amount = amount.plus(commission);
            theater.plusAmount(sales.minus(commission));
        }
        return reservation;
    }
}

```


```java 

public class TicketSeller {
    private TicketOffice ticketOffice;

    public void setTicketOffice(TicketOffice ticketOffice){
        this.ticketOffice = ticketOffice;
    }

    Reservation reserve(Customer customer, Theater theater, Movie movie, Screening screening, int count){
        Reservation reservation = Reservation.NONE;
        Money price = movie.calculateFee(screening, count);
        if(customer.hasAmount(price)){
            reservation = ticketOffice.reserve(theater,movie,screening,count);
            if(reservation != Reservation.NONE) customer.minusAmount(price);
        }
        return reservation;
    }
}

```


```java 

public class Customer {
    Reservation reservation = Reservation.NONE;
    private Money amount;

    public Customer(Money amount) {
        this.amount = amount;
    }

    public void reserve(TicketSeller seller, Theater theater, Movie movie, Screening screening, int count) {
        reservation = seller.reserve(this, theater, movie, screening, count);
    }

    boolean hasAmount(Money amount) {
        return this.amount.greaterThen(amount);
    }

    void minusAmount(Money amount) {
        this.amount = this.amount.minus(amount);
    }
}

```


### Practice

1. 본 예제에서는 `Sequence`를 통한 할인조건만 구현되어 있다. 
Period 및 한번에 예약하는 사람의 수가 일정 수를 넘어가면 
할인해주는 Count 조건에 따른 할인조건을 구현하라.

2. 현재의 예제는 영화와 상영이라는 컨텍스트로 역할로 예매를 진행한다.
상영은 본디 시간표일 뿐이므로 좌석수 등을 갖을 수 없다.
극장이 상영관을 소유하게 하고 상영이 상영관과 협력하여 예매시의 잔여좌석수를 관리하도록 개선하라


