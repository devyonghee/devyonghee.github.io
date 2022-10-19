---
title: '[Design Pattern] 스테이트 패턴(State Pattern)'
tags: [design-pattern, state-pattern]
categories: code
---

스테이트 패턴(State Pattern)은 내부 상태에 따라 객체의 행위가 변경되는 패턴이다.  
GoF(Gang of Four) Design Pattern 에서 행위(behavioral) 패턴에 속한다. 

<!--more-->

스테이트 패턴은 특정 상태에 따라 다르게 행동하는 객체의 행위를 상태 객체로 위임하는 패턴이다. 
상태를 캡슐화하여 객체화해서 사용하기 때문에 마치 객체의 클래스가 바뀌는 것처럼 보인다.  

상태에 따른 조건 로직이 복잡해지는 경우 복잡도를 낮추는데 유용하게 사용할 수 있다.  
이 상태는 Context 객체 내부에서 관리되고 있으므로 클라이언트의 입장에서는 내부 구조를 알 필요가 없다.  

## 구조 

{% include image.html alt="state pattern structure" path="images/code/state-pattern/structure.png" %}

- Context 
  - 다양한 내부 상태를 지닐 수 있는 객체
  - 사용자가 요청하는 메소드를 구현 (작업은 상태 객체에게 위임)

- State
  - 구현체 인스턴스들에 대한 공통 인터페이스 정의

- ConcreteState
  - 전달된 요청을 실제로 처리하는 역할
  - 요청을 처리하는 방법을 각자 구현 

## 장점

- 각 상태에게 책임을 위임하기 때문에 코드 복잡도 감소 (조건문 제거)
- 구현할 때 상태 객체만 보면되므로 추가, 수정, 삭제가 간단
- 상태에 따른 행위 파악 간단

## 단점

- 상태마다 새로운 클래스가 추가되어 클래스가 많아지므로 유지보수가 어려워질 수 있음

## 구현

### Context

```java 
class GumballMachine {

    private final State soldOutState = new SoldOutState(this);
    private final State noCoinState = new NoCoinState(this);
    private final State hasCoinState = new HasCoinState(this);
    private final State soldState = new SoldState(this);
    private final State winnerState = new WinnerState(this);

    private int ballsCount;
    private State state = soldOutState;

    GumballMachine(int ballsCount) {
        this.ballsCount = ballsCount;
        if (isNotEmpty()) {
            state = noCoinState;
        }
    }

    public void insertCoin() {
        state.insertCoin();
    }

    public void ejectCoin() {
        state.ejectCoin();
    }

    public void turnCrank() {
        state.turnCrank();
        state.dispense();
    }

    public void releaseBall() {
        System.out.println("a gumball comes rolling out the slot");
        if (isNotEmpty()) {
            ballsCount = ballsCount - 1;
        }
    }

    public void refill(int ballsCount) {
        this.ballsCount += ballsCount;
        System.out.println("The gumball machine was just refilled; its new count is: " + this.ballsCount);
        state.refill();
    }

    public void changeSoldState() {
        state = soldState;
    }

    void changeWinnerState() {
        state = winnerState;
    }

    void changeNoCoinState() {
        state = noCoinState;
    }

    void changeHasCoinState() {
        state = hasCoinState;
    }

    void changeSoldOutState() {
        state = soldOutState;
    }

    boolean isNotEmpty() {
        return !isEmpty();
    }

    boolean isEmpty() {
        return ballsCount == 0;
    }

    boolean hasGreaterThan(int count) {
        return ballsCount > count;
    }
}
```

### State

```java 
interface State {

    void insertCoin();

    void ejectCoin();

    void turnCrank();

    void dispense();

    void refill();
}
```

### ConcreteState

```java 
class SoldState implements State {

    private final GumballMachine gumBallMachine;

    SoldState(GumballMachine gumBallMachine) {
        this.gumBallMachine = gumBallMachine;
    }

    @Override
    public void insertCoin() {
        System.out.println("please wait, we're already giving you a gumball");
    }

    @Override
    public void ejectCoin() {
        System.out.println("already turned the crank");
    }

    @Override
    public void turnCrank() {
        System.out.println("please turn the crank once");
    }

    @Override
    public void dispense() {
        gumBallMachine.releaseBall();
        if (gumBallMachine.isNotEmpty()) {
            gumBallMachine.changeNoCoinState();
            return;
        }
        System.out.println("Oops, out of gumballs");
        gumBallMachine.changeSoldOutState();
    }

    @Override
    public void refill() {
    }

    @Override
    public String toString() {
        return "SoldState";
    }
}
```

```java 
class SoldOutState implements State {

    private final GumballMachine gumballMachine;

    SoldOutState(GumballMachine gumballMachine) {
        this.gumballMachine = gumballMachine;
    }

    @Override
    public void insertCoin() {
        System.out.println("the machine is sold out");
    }

    @Override
    public void ejectCoin() {
        System.out.println("there is no coin to eject");
    }

    @Override
    public void turnCrank() {
        System.out.println("there are no gumballs");
    }

    @Override
    public void dispense() {
        System.out.println("no gumball dispensed");
    }

    @Override
    public void refill() {
        gumballMachine.changeNoCoinState();
    }

    @Override
    public String toString() {
        return "SoldOutState";
    }
}
```

```java 
class NoCoinState implements State {

    private final GumballMachine gumballMachine;

    NoCoinState(GumballMachine gumballMachine) {
        this.gumballMachine = gumballMachine;
    }

    @Override
    public void insertCoin() {
        System.out.println("inserted a quarter");
        gumballMachine.changeHasCoinState();
    }

    @Override
    public void ejectCoin() {
        System.out.println("insert a coin first");
    }

    @Override
    public void turnCrank() {
        System.out.println("there is no coin");
    }

    @Override
    public void dispense() {
        System.out.println("please insert a coin");
    }

    @Override
    public void refill() {
    }

    @Override
    public String toString() {
        return "NoCoinState";
    }
}
```

전체 코드는 [깃허브 레포지토리](https://github.com/devyonghee/design-pattern-java/tree/master/state) 참고

## Strategy Pattern VS State Pattern 

두 패턴은 모두 인터페이스를 통해 구현 클래스를 캡슐화한다.  
이러한 이유로 두 패턴은 다이어그램은 동일하지만 용도에 있어서 차이가 있다.

### Strategy Pattern

- 클라이언트에서 Context 객체에게 필요한 전략 객체를 지정
- 구성을 통해 유연성을 극대화 하기 위함

### State Pattern  

- Context 객체 내부에서 상태를 관리하기 때문에 클라이언트는 상태 객체에 대해 신경쓰지 않아도 됨
- 컨텍스트 객체에서 수많은 조건문 대신 사용하기 위함

## 출처

- Head First Design Patterns
- [https://ko.wikipedia.org/wiki/%EC%83%81%ED%83%9C_%ED%8C%A8%ED%84%B4](https://ko.wikipedia.org/wiki/%EC%83%81%ED%83%9C_%ED%8C%A8%ED%84%B4)
- [https://always-intern.tistory.com/9](https://always-intern.tistory.com/9)
- [https://velog.io/@gmtmoney2357/%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-%EC%83%81%ED%83%9C-%ED%8C%A8%ED%84%B4State-Pattern](https://velog.io/@gmtmoney2357/%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4-%EC%83%81%ED%83%9C-%ED%8C%A8%ED%84%B4State-Pattern)