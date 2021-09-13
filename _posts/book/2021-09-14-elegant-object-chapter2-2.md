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

