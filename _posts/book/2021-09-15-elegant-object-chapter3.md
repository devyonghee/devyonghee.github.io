---
title: 엘레강트 오브젝트 Chapter3. 취업
tags: [book, elegant-object, OOP]
categories: book
---

3장에서는 거대한 객체, 정적 메서드, NULL 참조, getter, setter, new 연산자 사용을 반대하고 있다.  
그 이유에 대해 자세하게 알아보도록 한다.

<!--more-->
<br>

## 3.1 5개 이하의 `public` 메서드만 노출하세요

작은 객체가 응집력이 높고, 테스트도 용이하고, 유지보수가 가능하다.

### 적절한 **public 메서드** 수는 **5개** (`private` 제외, `protected` 포함)
- 5개가 정확한 숫자는 아니지만 그 이상이 된다면 **하나의 책임**을 수행하고 **응집도가 높은** 클래스인지 확인하라.
- 10개보다 3개의 메서드들이 **조화를 이루도록** 만드는 것이 쉽다.
- 응집도가 높으면 **각 메서드**가 클래스의 **모든 프로퍼티**를 사용한다. (메서드들이 서로 다른 프로퍼티를 사용한다면 응집도가 낮음) 


### Review

메서드 갯수를 작게 유지하는 것이 좋다는 사실은 알고 있었고 충분히 공감되는 내용이었다.    
하지만 entity에서 디미터 법칙을 어기지 않기 위해 `public` 메서드가 많이 생기게 되던데
과연 내가 올바르게 코드를 작성하고 있는 것인지 의문이 들었다.

## 3.2 정적 메서드를 사용하지 마세요.

정적 메서드 대신 객체를 사용해야 한다. 더이상 정적 메서드의 사용을 중단하라.

### 3.2.1 객체 대 컴퓨터 사고 (Object vs Computer thinking)

정적 메서드는 절차적인 코드를 유도하게 되므로 객체로 만들어야 한다.

- **컴퓨터**의 흐름은 항상 **순차적**이며 스크립트의 위에서 아래로 흐른다.
- 우리는 CPU 에게 명령을 내리는 것이 아닌 정의하는 것이고 그 명령의 흐름을 **제어할 책임**이 있다.

```java 
int max(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}
```

모든 **컴퓨터**에서 실제 위 코드 처럼 제공된 명령어를 하나씩 **순차적**으로 실행한다. (절차지향)

```java
class Max implements Number {
    private final Number a; 
    private final Number b;
    public Max(Number left, Number right) {
        this.a = left;
        this.b = right;
    }
}

Number a = new Max(5,9);
```

객체 지향으로 작성하려면 코드는 위와 같이 변경되어야 한다.  
실제 이 코드는 최댓값을 계산하지 않고 단순히 객체만 생성한다.

### 3.2.2 선언형 스타일 대 명령형 스타일 (Declarative vs Imperative style)

**명령형 프로그래밍**과 **선언형 프로그래밍**은 다른 클래스, 객체, 메서드가 **사용하는 방법**에 차이가 있다.

> #### 명령형 프로그래밍
> 프로그램의 상태를 변경하는 문장을 사용하여 계산 방식을 서술
>
> #### 선언형 프로그래밍
> 제어 흐름을 서술하지 않고 계산 로직을 표현


```java 
public static int between(int l, int r, int x) {
    return Math.min(Math.max(l, x), r);
}
```

`between()` 메서드를 호출하면 즉시 CPU 가 계산하여 결과를 받는데 이것이 **명령형** 스타일이다.

```java 
class Between implements Number {

    private final Number num;

    Between(Number left, Number right, Number x) {
        this.num = new Min(new Max(left, x), right);
    }

    @Override
    public int intValue() {
        return num.intValue();
    }
}

Number y = new Between(4, 9, 10);
``` 
 
이 방식은 **무엇인지만** 정의하고 아직 CPU 에게 계산하라고 하지 않았기 때문에 **선언형** 스타일이다.


#### 선언형 스타일의 장점
1. 직접 성능 최적화를 할 수 있다.
   - 계산 결과가 필요한 **시점과 위치**를 결정하도록 CPU에게 위임하고, 요청이 있을 때만 계산을 실행할 수 있어 더 빠르다.
   
2. 다형성
   - 모두 클래스로 이루어져 있기 때문에 코드 블록사이의 의존성을 쉽게 끊을 수 있다. (정적 메서드는 분리할 수 없다)
   - 객체를 다른 객체로 완전 분리하기 위해서는 메서드나 주 ctor 에 new 연산자를 사용하면 안된다.
   
3. 표현력 (expressiveness)
   - 선언형 방식은 결과를 이야기하지만, 명령형 방식은 수행 가능한 한 가지 방법을 이야기한다. (명령형은 결과를 예상하고 머릿속에서 코드를 실행해봐야함)
   
4. 응집도(cohesion)
   - 아래 코드를 보면 Filtered 통해 한줄에 선언했다. 모든 코드들이 한곳에 모여있어서 실수로라도 분리가 불가능.


````java 
Collection<Integer> evens = new Filtered(
        numbers,
        new Predicate<Integer>() {
            @Override
            public boolean suitable(Integer number) {
                return number % 2 == 0;
            }
        });
````

이미 많은 라이브러리에서 정적 메소드를 사용하고 있다. 
객체를 직접 직접 처리할 수 있도록 정적 메서드를 감싸는 클래스를 만들어 분리해야 한다.

