---
title: 엘레강트 오브젝트 Chapter2. 교육 (2)
tags: [book, elegant-object, OOP]
categories: book
---

객체는 작아야 한다는 내용이 이어지고 있다.  
그 이유와 방법에 대해서 계속 알아보도록 한다.  

<!--more-->
<br>

## 2.6 불변 객체로 만드세요

상태 변경이 불가능한 불변 클래스는 응집력이 높고, 결합도가 낮아 유지보수성을 크게 향상한다.

> #### 불변 객체
> 인스턴스를 생성한 후 상태를 변경할 수 없는 객체

### 가변 객체의 사용을 엄격하게 금지해야한다.
- java 에서는 지연로딩을 불변으로 만들 수 없다. 언어 차원에서 지연로딩을 제공해줘야 한다고 생각한다.

### 식별자 가변성(Identity Mutability)

불변 객체에서는 식별자 가변성(Identity Mutability) 문제가 없다.  

아래 코드는 식별자 가변성 문제로 매우 심각하고 찾기 어려운 버그가 될 수 있다.  
불변 객체를 사용하면 이러한 문제를 완벽하게 해결할 수 있다.

```java
Map<Cash, String> map = new HashMap<>();
Cach five = new Cash("$5");
Cach ten = new Cash("$10");

map.put(five, "five");
map.put(ten, "ten");

five.mul(2);

System.out.printls(map); // {$10=>"five", $10=>"ten"}
map.get(five); //"ten"과 "five" 중 하나가 반환
``` 

### 실패 원자성(Failure Atomicity)

불변 객체는 실패 원자성(Failure Atomicity) 장점이 있다.

> #### 실패 원자성
> 견고한 상태의 객체를 얻거나 실패하거나 둘 중 하나만 가능한 특성

가변 객체인 아래 코드에서 `mul()` 메서드 도중 예외가 발생된다면 `dollars` 만 수정되고 `cents`는 유지된다.
심각하고 찾기 어려운 버그이다.  
코드를 수정할 순 있지만 **가변 객체**에서는 **코드가 복잡**해지고 처리가 어려워진다. 

```java

class Cach {
    private int dollars;
    private int cents;
    public void mul(int factor) {
        this.dollars *= factor;
        if(/* 잘못됨 */){
            throw new RuntimeExcption();
        }
        this.cents *= factor;
    }
}

```

### 시간적 결합 (Temporal Coupling)

불변 객체는 시간적 결합(Temporal Coupling)을 제거할 수 있다.  

다음 코드에서 각 줄은 특정한 순서로 정렬되어 있으며 시간적인 순서에 따라 서로 결합되어 있다.
`println` 과 `setCents` 호출 순서가 바뀌어도 정상적으로 컴파일이 될 것이다.  

수정하려면 코드의 시간적인 결합을 이해해야 하며, 유지보수가 어려워진다. 

```java
Cash price = new Cash();
price.setDollars(29);
price.setCents(95);
System.out.println(price) //"$29.95"
```

불변 객체는 이러한 문제를 해결할 수 있으며, 
아래 코드에서는 **인스턴스화(instantiation)**와 **초기화(initialization)**이 함께 이루어지기 때문에 시간적인 결합을 제거한다.  

```java 
Cash price = new Cash(29, 95);
System.out.println(price); // "$29.95"
```

### 부수효과 제거(Side effect-free)

다음과 같은 메소드를 사용한다면 내부에서 값이 변하기 때문에 **side effect** 가 발생된다.
이 문제를 해결하려면 오랜시간이 걸릴 수 있다.
하지만 불변 객체에서는 수정할 수 없으므로 상태에 대해 확신을 가질 수 있다.

```java 
void print(Cash price){
    System.out.println(price);
    price.mul(2);
    System.out.println(price);    
}
```

### NULL 참조 없애기

이번 섹션에서는 **unset** 의 경우에만 다룬다.  
아래 코드에서 `name`은 언제 유효한 상태인지 아닌지 이해가 어렵다.
`null` 체크를 하면 되지만 코드가 복잡해지며, 혹시라도 체크를 잊어버리면 `NullPointerException` 을 마주치게 된다.  

**불변 객체**로 만든다면 **견고하고 응집도 높은 객체**를 생성하도록 강제되기 때문에 **유지보수**하기 더 수월하다.

```java 

class User {

    private final int id;
    private String name = null;

    public User(int num) {
        this.id = num;
    }

    public void setName(String name) {
        this.name = name;
    }
}

```

### 스레드 안전성(Thread Safety)

> #### 스레드 안정성
> 여러 스레드에서 동시에 사용될 수 있고 그 결과를 예측가능하도록 유지하는 **객체의 품질**

아래 코드에서 두 스레드에서 $30.20과 $60.40을 예상했지만 짧은 시간의 오류로 가끔 $60.20 이 발생됨. 
이러한 버그는 재현도 안되고 해결하기 어렵다.  

`synchronized` 키워드로 동기화를 할 수 있겠지만 다음과 같은 문제가 있다.
1. 가변 클래스는 스레드 안정성을 추가하기 어렵다.(**데드락**을 제어해야 함)
2. **성능상의 비용**이 발생된다. (다른 스레드에서 해방될 때까지 기다려야 함)

```java
class Cash {
    private int dollars;
    private int cents;
    public void mul(int factor) {
        this.dollars *= factor;
        this.cents *= factor;
    }
}

Cash price = new new Cache("$15.10");
// 두 스레드에서 실행
price.mul(2);
System.out.println(price);
```

### 더 작고 더 단순한 객체

불변성의 장점은 단순성(유지보수성)

- 객체가 단순해질수록 응집도는 높아지고 유지보수는 쉬워진다.
- java에서 한 클래스에는 주석과 공백 포함하여 **250줄**(그 이상은 리팩토링)
- 불변 객체는 객체를 크게 만드는 것이 불가능

<br>


### Review

객체를 불변성으로 만들어야 하는 이유에 대해 두루뭉실하게 알고 있던 내용을 명확하게 정리해준 것 같다.
확실히 객체를 불변으로 만드는 것이 관리측면에서 훨씬 나았다.    
하지만 실제 데이터를 관리하면서 무조건 불변 객체만 만든다는 것이 실제로 가능할까 의문이든다.
그래도 가능하다면 최대한 불변 객체로 만들고 필요한 곳에만 가변 객체를 이용해야겠다.

## 2.7 문서를 작성하는 대신 테스트를 만드세요

유지보수가 가능한 클래스는 문서화가 필요하지 않다

### 문서화 대신 단위 테스트와 함께 코드를 깔끔하게 만들어야 한다. (테스트가 바로 문서화)
- 단위 테스트는 **클래스의 일부**이지 독립적인 객체가 아니다.
- **깔끔한 단위 테스트**를 추가하면 클래스를 더 깔끔하게 만들 수 있다.
- **테스트**가 문서화보다 **클래스를 이해**하는데 큰 도움이 된다.

### Review
실제 사용하는 코드를 보는 것이 이해하기 편했지만 문서를 대체할 수 있을거라는 생각은 못했다.  
엘레강트 오브젝트 책을 읽고 **켄트벡의 테스트 주도 개발** 책을 다시 읽어봐야겠다.

<br>

