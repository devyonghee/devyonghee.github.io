---
title: 엘레강트 오브젝트 Chapter2. 교육 (2)
tags: [book, elegant-object, OOP]
categories: book
---

객체는 작게 유지해야 된다는 내용이 계속 이어지고 있다.  
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
