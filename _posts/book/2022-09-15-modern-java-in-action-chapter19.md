---
title: '[Modern Java in Action] Chapter19. 함수형 프로그래밍 기법'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 19장에서는 함수형 프로그래밍 기법에 대해 소개한다.   
함수형 프로그래밍의 실용적 기법에 대해 자세히 알아본다. 

<!--more-->

<br/>


## 19.1 함수는 모든 곳에 존재한다. 

함수형 프로그래밍에서는 함수를 마치 일반값처럼 사용해서 인수로 전달, 결과로 반환, 자료 구조 저장이 가능하다.  
이처럼 일반값처럼 취갑할 수 있는 함수를 일급 함수(first-class function) 이라고 한다.    
자바 8에서는 `::` 연산자로 메서드 참조를 만들거나 람다 표현식으로 직접 함숫값을 표현해서 사용할 수 있다. 


### 고차원 함수

함수형 프로그래밍 커뮤니티에서는 고차원 함수를 하나 이상의 동작을 수행하는 함수라고 한다. (ex. `Comparator.comparing`)  

- 하나 이상의 함수를 인수로 받음
- 함수를 결과로 반환

```java 
Function<Double, Double> differentiate(Function<Double, Double> func)
```


### 커링(currying)

커링(currying)은 함수를 모듈화하고 코드 재사용에 도움을 준다.  
커링은 x 와 y라는 두 인수를 함수 f 를 받는 한 개의 인수를 받는 g라는 함수로 대체하는 기법이다. (`f(x, y) = (g(x))(y)`)

```java 
// 세 개의 인수를 받을 수 있지만 인수에 매번 같은 인수를 넣으면 재활용하는 것이 불가능
static double converter(double x, double f, double b) {
    return x * f + b;
}

// 커링 개념을 활용하여 한 개의 인수를 갖는 함수를 생성하는 '팩토리' 정의
static DoubleUnaryOperator curriedConverter(double f, double b) {
    return (double x) -> x * f + b;
}
DoubleOperator convertCtoF = curriedConverter(9.0/5, 32);
DoubleOperator convertUSDtoGBP = curriedConverter(0.6, 0);
DoubleOperator convertKmtoMi = curriedConverter(0.6214, 0);
```


