---
title: 코드 스피츠 Object83 1회차 정리(2)
tags: [강의, 설계]
categories: lecture
---

<!--more-->

## OOP base system


### Value & Identifier
객체를 구별하는 방법은 식별자 
> 식별자 : Runtime 메모리에 적재 되어 있던 메모리의 주소
  
객체 지향에서 객체의 동가성을 평가하는 방법은 객체의 주소이다.  
객체 지향에서는 미리 정해져있는 값 외에는 전부 객체가 되어야 한다.(식별자로 시스템을 만들어가야 한다.)
    

```kotlin

class ValueType(val name: String){
    override operator fun equals(n: Any?) = n == name
}


// kotlin 에서는 '==' 면 equals 를 호출 
// 아래와 같이 사용하면 안된다. 전부 식별자로 사용하는걸 지향
Valuetype("abc") == Valuetype("abc") //true


// kotlin 에서는 '===' 면 식별자를 비교
Valuetype("abc") === Valuetype("abc") //false

```

### Polymorphism (다형성)
아래 두가지가 충족해야만 다형성이 성립된다.  
Substitution : 대체 가능성  
Internal identity : 내적 동질성  

1. Substitution(대체 가능성)  
다형성을 사용하면 Runnable 의 run 메소드를 먼저 참조하기 때문에 직접 Worker를 사용하는 것보다 느려진다.  
어떤 것이랑 바인딩될지는 pointer의 연속으로 이루어지기 때문에 동적 바인딩

    ```kotlin    
    open class Worker: Runnable{
        override fun run() = println("working")
    }
    
    open class HardWorker: Runnable{
        override fun run() = println("HardWorking")
    }
    
    
    // Runnable로 넣으면 Worker로서의 동작이아니라 Runnable의 역할만 할 수 있다. 
    
    var worker:Runnable = Worker()
    println(worker.run())  // working
    worker = HardWorker()
    println(worker.run())  // HardWorking
    ```

2. Internal identity (내적 동질성)  
최초의 생소한 객체의 함수 포인터를 유지   
어떤 형으로 변경해도 태어난 출신지는 바뀌지 않는다.  
받은 타입을 Worker 라고 하더라도 변형된 있는 형에 참조를 사용하지 않고 원래 만들어졌던 본질적인 객체의 형을
그대로 참조하도록 한 것이 내적 동질성 규칙이다.  
  
    ```kotlin
    
    open class Worker: Runnable{
        override fun run() = println("working")
        fun print() = println(run())
    }
    
    open class HardWorker: Runnable{
        override fun run() = println("HardWorking")
    }
    
    
    var worker:Worker = HardWorker()
    println(worker.print())  // HardWorking
    
    ```


### Object (객체)
  객체 지향에서 객체가 갖춰야할 기본적인 2가지 소양
  
  - Encapsulation of Functionality (기능의 캡슐화)
    - 외부에게 상세한 기능을 노출하지 않고 보다 잘 사용할 수 있게 노출 한다.
    - 다양한 나머지 변화율이 격리
    
  - Maintenance of State(상태 관리)
    - 객체 지향이 레퍼런스를 가리키고 식별자를 참조하려고 하는 이유는 상태관리 때문
    - 데이터 갱신, observing 등등 상태의 모든 관리  
    - 은닉 
  
  
  우리의 궁극 적인 목표는 <b>Isolation(격리)</b> 이다. 
  
  
  
## Theater


{% include image.html alt="theater-dependency" path="/images/lecture/code-spitz/theater-dependency.jpg" %}
오브젝트 책에서 주어지는 다이어 그램이다. 위 설계대로 된다면 빨간 부분이 엉망으로 될 것이다.   
Theater 가 seller를 알아야 되는게 이상하다. Theater 가 TicketOffice 도 알아야 하지 않을까. 
Seller가 TicketOffice와 Audience를 알고 있어서 연결해주는 역할을 해주는데 
그럼 Audience와 TicketOffice를 연결해 주어야 할까? 그렇다면 굉장히 복잡해진다.   

{% include image.html alt="theater-dependency-refactor" path="/images/lecture/code-spitz/theater-dependency-refactor.jpg" %}
위 그림과 같이 구조를 재구성했다.


### Theater

```java
    
class Theater {
    final private List<TicketOffice> ticketOffices = new ArrayList<>();
    final private Long fee;

    public Theater(Long fee) {
        this.fee = fee;
    }

    Long getFee() {
        return this.fee;
    }

    public void setTicketOffices(TicketOffice... ticketOffices) {
        this.ticketOffices.addAll(ticketOffices);
    }

    // ticketOffices 에 Theater가 생성한 Ticket을 추가해준다.
    public void setTicket(TicketOffice ticketOffice, Long num) {
        if (!ticketOffices.contains(ticketOffice)) return;
        while (num-- > 0) {
            // Ticket 에는 반드시 객체를 구별하기 위해서 객체 식별자를 넣어 주어야 한다.
            // name 같은 값을 넣으면 name 만으로 다른 극장을 구분하기 힘들어진다. 
            ticketOffice.addTickke(new Ticket(this));
        }
    }

   // Invitation 도 마찬가지로 Theater가 Audience 만들어서 제공을 한다. 
    public void setInvitation(Audience audience) {
        audience.setInvitation(new Invitation(this));
    }

    public boolean enter(Audience audience) {
        Ticket ticket = audience.getTicket();
        return ticket.isValid(this);
    }
}
    
    
``` 


### Ticket

```java

public class Ticket {
    // 이펙티브 자바 (null 객체 패턴)
    // 식별자로 Empty를 판단
    final static public Ticket EMPTY = new Ticket(null);
    
    // 절대 불변하도록 final로 theater를 잡아 둔다.
    final private Theater theater;
    
    private boolean isEntered = false;

    public Ticket(Theater theater) {
        this.theater = theater;
    }

    // isEntered
    public boolean isValid(Theater theater) {
        if (isEntered || theater != this.theater || this == EMPTY) {
            return false;
        } else {
            isEntered = true;
            return true;
        }
    }

    // pointer의 pointer의 pointer를 사용하는 중
    // 만약 Theater의 fee를 필드 값으로 잡았다면 Theater의 fee 값이 변경 되어도 반영이 안됐을 것이다.
    public Long getFee() {
        return theater.getFee();
    }
}

```

### Invitation

```java

public class Invitation {
    final static public Invitation EMPTY = new Invitation(null);
    final private Theater theater;

    public Invitation(Theater theater) {
        this.theater = theater;
    }
}

```



### TicketOffice

```java

public class TicketOffice {
    private Long amount;
    private List<Ticket> tickets = new ArrayList<>();

    public TicketOffice(Long amount) {
        this.amount = amount;
    }

    public void addTicket(Ticket ticket) {
        this.tickets.add(ticket);
    }

    public Ticket getTicketWithFee() {
        if (tickets.size() == 0) return Ticket.EMPTY;
        else {
            Ticket ticket = tickets.remove(0);
            amount += ticket.getFee();
            return ticket;
        }
    }

    public Ticket getTicketWithNoFee() {
        if (tickets.size() == 0) return Ticket.EMPTY;
        else return tickets.remove(0);
    }

    public Long getTicketPrice() {
        if (tickets.size() == 0) return 0L;
        else return tickets.get(0).getFee();
    }
}

```

### TicketSeller
getTicket 에 대한 비즈니스 로직을 가지고 있는 것이 seller 의 주업무이다.  
fee 에 대한 지식과 트랜잭션 상에서 audience 의 처리에 대해서 도메인 지식을 가지고 있는 것 seller 이다.
이 도메인 지식이 가지고 있는 부분들은 바뀔 수 있거나 추가될 확률이 TicketOffice 와 로직과 다르기 때문에 분리.
TicketOffice 로직이 변하는 변화율과 TicketSeller 의 로직이 변하는 변화율이 다르다.  
TicketSeller 는 TicketOffice 와 Audience 의 생태계를 Isolation 해주는 방패 역할이 되는 것이다.  


```java


public class TicketSeller {
    private TicketOffice ticketOffice;

    public void setTicketOffice(TicketOffice ticketOffice) {
        this.ticketOffice = ticketOffice;
    }

    public Ticket getTicket(Audience audience) {
        Ticket ticket = Ticket.EMPTY;
        if (audience.getInvitation() != Invitation.EMPTY) {
            ticket = ticketOffice.getTicketWithNoFee();
            if (ticket != Ticket.EMPTY) audience.removeInvitation();
        } else {
            Long price = ticketOffice.getTicketPrice();
            if (price > 0 && audience.hasAmount(price)) {
                ticket = ticketOffice.getTicketWithFee();
                if (ticket != Ticket.EMPTY) audience.minusAmount(price);
            }
        }
        return ticket;
    }
}

```

### Audience


```java

class Audience {
    private Ticket ticket = Ticket.EMPTY;
    private Invitation invitation = Invitation.EMPTY;
    private Long amount;

    public Audience(Long amount) {
        this.amount = amount;
    }
    
    // 유일하게 바깥에 노출되는 메소드 다른 메소드들은 같은 패키지 내에서 사용되기 위한 접대하는 메소드이다.
    public void buyTicket(TicketSeller seller) {
        ticket = seller.getTicket(this);
    }

    public boolean hasAmount(Long amount) {
        return this.amount >= amount;
    }

    public boolean minusAmount(Long amount) {
        if (amount > this.amount) return false;
        this.amount -= amount;
        return true;
    }

    public Invitation getInvitation() {
        return invitation;
    }

    public void removeInvitation() {
        invitation = Invitation.EMPTY;
    }

    public Ticket getTicket() {
        return ticket;
    }

    public void setInvitation(Invitation invitation) {
        this.invitation = invitation;
    }
}

```

### Main
강의를 보면서 클래스를 짜고 아래 코드를 작성했지만 절대로 혼자서는 이대로 설계될 수 없다.
우리가 이렇게 짤 수 있는 방법은 아래와 같은 실행 코드를 먼저 짜보고 코드에 맞는 클래스들을 만드는 방법밖에 없다.
오브젝트 책에서는 다양한 책임을 먼저 부여하고 책임을 수행할 역할들을 찾아보라고 하지만 실제로 이렇게 짜기는 힘들다.
내 도메인에 맞는 시나리오를 먼저 짜고 클래스를 설계하는게 더 낫다.
아래와 같은 시나리오를 짜면 클래스를 짜는건 쉬워진다.

```java

public class Main {
    public static void main(String[] args) {
        Theater theater = new Theater(100L);
        Audience audience1 = new Audience(0L);
        Audience audience2 = new Audience(50L);
        TicketOffice ticketOffice = new TicketOffice(0L);
        TicketSeller seller = new TicketSeller();
        theater.setTicketOffices(ticketOffice);
        theater.setTicket(ticketOffice, 10L);
        theater.setInvitation(audience1);
        seller.setTicketOffice(ticketOffice);
        audience1.buyTicket(seller);
        audience2.buyTicket(seller);
        boolean isOk1 = theater.enter(audience1);
        boolean isOk2 = theater.enter(audience2);
        System.out.println(isOk1);  // True
        System.out.println(isOk2);  // False
    }
}

```


## Practice
1. 마지막 theater예제에서 TicketOffice는 암묵적으로 하나의 극장하고만 계약하고 있다는 가정이 있게 구현되어있다.  
코드 상 이 조건을 강제하도록 개선하라.

2. 마지막 theater예제에서 Theater는 단 하나의 영화만 고정가격으로 상영 중이다.  
다양한 가격의 영화를 상영할 수 있게 개선하라.
(Movie클래스가 새롭게 필요하고 또한 이에 따라 초대, 티켓, 티켓 오피스등의 총괄적인 변화가 일어남)
