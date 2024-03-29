---
title: 엘레강트 오브젝트 Chapter2. 교육 (1)
tags: [book, elegant-object, OOP]
categories: book
---

이번 챕터에서 하고자 하는 얘기는 바로 '객체는 작아야 한다.' 이다.  
객체를 작게 유지하기 위한 기준과 그 이유를 자세하게 설명해주고 있다.

<!--more-->
<br>

## 2.1 가능하면 적게 캡슐화 하세요

복잡성은 유지보수성과 직접적인 관련이 있다. **복잡성**이 높을수록 **유지보수성이 감소**된다.

### 객체는 함께 동작하는 객체들의 집합이다
- 상태없는 객체는 존재하면 안되고 상태는 **객체의 식별자**이어야 한다.
- Java 에서 상태없는 객체를 생성할 수 있으며 그 객체들을 서로 다른 객체로 인식되는 것은 잘못된 방식이다.
- 완전한 객체 지향 언어에서는 동일한 상태를 가지고 있다면 두 객체는 동일해야 한다.

### 4개 이하의 객체를 캡슐화 하라
- **4개 이상의 요소**로 구성된 좌표는 **직관에 위배**되고 이해가 힘들다.
- 더 많은 객체를 캡슐화하고 있다면 다시 그룹화하여 객체들로 구성된 트리를 만들어야 한다.
- 수십 개의 객체를 캡슐화 하는 것은 잘못된 설계이다.

> Java 결함때문에 `==` 연산자 대신 `equals()` 메소드를 오버라이드하여 이용하자. 

### Review

객체를 작게 캡슐화 하는 것은 확실히 올바른 방향인 것 같다.  
하지만 실제로 코드를 작성하면서 이 원칙을 지켜낼 수 있을지 아직 확신이 서지 않는다.
그래도 이 글을 읽고 4개 이하라는 기준이 생기게 되었고 넘어가게 된다면 더 작게 캡슐화하기 위해 고민을 해봐야겠다. 

<br>

## 2.2 최소한 뭔가는 캡슐화하세요

### 너무 많거나 아무것도 캡슐화하지 않는 방식은 잘못됐다
- **프로퍼티가 없는 클래스**는 객체지향 프로그래밍에서 좋지 않은 **정적메서드**와 유사하다.
- 어떤 것도 캡슐화하지 않는 객체는 **식별자가 없는** 것이고 그렇다면 이 **클래스는 오직 하나만 존재**해야 한다.

### Review
이 글을 읽으면서 가장 생각났던 것은 바로 util 클래스이다.  
어떠한 객체도 캡슐화 하지 않고 정적 메소드만 가지고 있는 대표적인 클래스가 아닐까 생각된다.  
확실히 객체 지향과는 많이 어긋난 클래스이고 SRP도 쉽게 어길 수 있기 때문에 이러한 클래스는 지양되어야 할 것 같다.

<br>

## 2.3 항상 인터페이스를 사용하세요

객체들은 서로를 필요로 하기 때문에 **결합도(coupling)**가 생긴다.  
하지만 객체들의 수가 많아질수록 **강한 결합도(tight coupling)**로 심각한 문제가 발생된다.

### 결합도로부터 객체 분리를 도와주는 것이 **인터페이스(`interface`)** 이다
- 인터페이스는 객체 의사소통를 위한 계약(contract)이다.
- 클래스 안의 **모든 퍼블릭 메서드**가 인터페이스(`interface`)를 구현하도록 만들어야 한다.
- 각각의 클래스는 서로 다른 클래스로 **대체**할 수 있도록 느슨한 **결합도(loose coupling)** 을 유지해야 한다.
- 인터페이스는 시스템을 구조화된 상태로 유지하여 무너지지 않도록 도와준다.


### Review

**느슨한 결합도**를 위해 반드시 필요한 설계라고 생각되지만 실제로 지키기 힘든 원칙같다.
그래도 모든 퍼블릭 메소드에 인터페이스 정의를 고민해본다면 해당 객체 역할에 대해 다시 생각해보는 계기 될 것 같다.

<br>

## 2.4 메서드 이름을 신중하게 선택하세요

빌더와 조정자 사이에 만들고 조작하거나, 조작 후 반환하는 등 어떤 메서드도 존재하면 안됨

> ##### **빌더(builder)**
> - 뭔가 만들고 새로운 객체를 반환하는 메서드
> - 절대 void 가 될 수 없음.
> - 형용사를 통해 명사를 풍부하게 설명하는 것은 허용 (ex. parsedCell)
> <br><br>
>
> ##### **조정자(manipulator)**
> - 엔티티를 수정하는 메서드
> - 항상 void

### **빌더(builder)**는 **명사**
- `getter` 는 어떤 값을 반환하는 빌더로 동사 `get`으로 시작하는 작명에는 문제가 있다.
- `cookBrownie`, `brewCupOfCoffee` 같은 메서드는 객체의 메서드가 아니라 객체에게 일일이 명령하는 **프로시저**이다.
- 무엇을 만들어야 하는지 요청만하고 방법은 객체 스스로 결정해야 한다. 

### **조정자(manipulator)**는 **동사**
- 클라이언트 입장에서 값을 받을것을 기대하고 요청하지 않는다.
- 빌더(Builder) 패턴을 사용할경우 with로 시작하는 메서드 이름은 무방

> ##### 빌더 패턴 사용하지 말자.  
> - 빌더 패턴은 유지보수성이 낮고 응집도가 떨어지도록 조장.  
> - 생성자 인자가 많으면 유용한 패턴이지만, 애초에 인자 수가 많은 것이 문제.

### **빌더(builder)**와 **조정자(manipulator)** 혼합하기

```java
class Document {
    int write(InputStream content);
}
```

위 메서드는 데이터를 쓰고 값도 반환해주는 복잡한 일을 하고 있다. 메서드 목적이 명확하지 않아 다음처럼 리팩토링이 필요하다. 

```java
class Document {
    OutputPipe output();
}

class OutputPipe {
    void write(InputStream content);
    int bytes();
    long time();
}
```
연산을 수행할 객체를 준비하여 빌더와 조정자를 구분하게 되었다.

### Boolean 값을 반환하는 경우 **형용사**

- 마찬가지로 Boolean 값을 반환하기 때문에 빌더에 속하지만, **형용사**로 지어야 가독성이 좋다.  
(ex. isEmpty -> empty, isReadable -> readable, isNegative -> negative)
- is 가 붙으면 올바르지 않은 문장이 만들어지기 쉽다.(isEquals, isExists) 


> #### summary
> 빌더(builder) -> 명사  
> 조정자(manipulator) -> 동사  
> Boolean 빌더 -> 형용사

### Review
`item.getPrice()` 보다 `item.price()` 이 명사로 접근한다는 점에서 확실히 가독성이 좋은 것 같다.
바로 도입하고 싶지만 아직 `setter`, `getter` 패턴을 이용한 java 라이브러리들이 많기 때문에 문제가 없는지 검토는 필요할 것 같다.  

<br>

## 2.5 퍼블릭 상수(Public Constant)를 사용하지 마세요

- 객체들은 **독립적**이고 닫혀있어야 하며 어떠한 것도 **공유해서는 안된**다.
- **퍼블릭 상수**를 사용하면서 중복은 제거할 수 있겠지만 **결합도는 높아지고**, **응집도는 낮아진다**.

### 결합도 증가

- **퍼블릭 상수**를 변경하면 어떻게 사용되고 있는지 알지 못하기 때문에 영향을 예상하지 못한다.
- 객체들끼리 **어떻게 사용되고 있는지** 알 수 없다면 **결합도가 높은** 것이다.

### 응집도 저하

- 객체는 **상수**에 자기만의 **의미**를 부여해야 한다.
- **중복 문제를 해결**하려고 퍼블릭 상수를 사용하는 것보다 기능을 공유하는 **새로운 클래스**를 선언하라.
  - **계약**을 통해 추가되는 것이므로 언제라도 **분리가 가능**하여 유지보수성도 좋다.
  - 인터페이스는 유지하면서 쉽게 **동작 변경**이 가능하다.

> Java 의 열거형에 대해서도 동일하므로 역시 사용해서 안된다.

### Review

확실히 퍼블릭 상수는 조심스럽게 선언해야 하는 것 같다.  
하지만 spring에서 `cacheRegion` 같이 어노테이션 값으로 사용되어야 하며 공유되어야 한다면
예외로 사용할 수 있지 않을까 생각이 들었다.