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

<br/>

## 19.2 영속 자료구조 

함수형 메서드에서는 전역 자료구조나 인수로 전달된 구조를 갱신할 수 없다.  
구조를 변경하면 결과가 달라지면서 참조 투명성 위배되고 인수를 결과로 매핑할 수 없어지기 때문이다. 

### 파괴적인 갱신과 함수형

예제를 통해 자료구조를 갱신할 때 발생할 수 있는 문제를 확인하자

```java 
class TrainJourney {
    public int price;
    public TrainJourney onward;
    public TrainJourney(int p, TranJourney t) {
        price = p;
        onward = t;
    }
}

static TrainJourney link(TrainJourney a, TrainJourney b) {
    if (a = null) return b;
    TrainJourney t = a;
    while (t.onward != null) {
        t = t.onward;
    }
    t.onward = b;
    return a;
}
```

위 코드를 통해 `link(firstJourney, secondJourney)` 를 호출하면 `firstJourney` 가 변경되면서 파괴적인 갱신이 일어난다.  
그렇게 되면 기존에 `firstJourney` 을 의존하고 있던 코드는 동작하지 않게 된다.  

함수형에서는 이러한 부작용을 수반하는 메서드를 제한하는 방식으로 문제를 해결한다.  
결과를 표현할 자료구조가 필요하면 갱신하지 않고 새로 생성해야 한다.  

```java 
static TrainJourney append(TrainJourney a, TrainJourney b) {
    return a == null ? b : new TrainJourney(a.price, append(a.onward, b));
}
```

### 트리를 사용한 다른 예제 

`HashMap` 같은 인터페이스를 구현할 때는 이진 탐색 트리가 사용된다.  
주어진 키와 연관된 값 갱신하는 방법에 대해 알아본다.

```java 
class Tree {
    private String key;
    private int val;
    private Tree left, right;
    public Tree (String k, int v, Tree l, Tree r) {
        key = k; val = v; left = l; right = r;
    }
}

class TreeProcessor {
    public static int lookup(String k, int defaultval, Tree t) {
        if (t == null) return defaultval;
        if (k.equals(t.key)) return t.val;
        return lookup(k, defulatval, k.compareTo(t.key) < 0 ? t.left : t.right);
    }
}

public static void update(String k, int newval, Tree t) {
    if (t == null) { /* 새로운 노드 추가*/ }
    else if (k.equals(t.key)) t.val = newval;
    else update(k, newval, k.compareTo(t.key) < 0 ? t.left : t.right);
}

public static void Tree update(String k, int newval, Tree t) {
    if (t == null) t = new Tree(k, newval, null, null);
    else if (k.equals(t.key)) t.val = newval;
    else if (k.compareTo(t.key) < 0) t.left = update(k, newval, t.left);
    else t.right = update(k, newval, t.right);
    return t; 
}
```

두 가지 `update` 모두 기존 트리를 변경한다.  
그러므로 트리에 저장된 맵은 변경에 대해 모든 곳에 영향을 주게 된다.

함수형으로 이 문제를 처리하는 방법을 알아보자.  
새로운 노드를 생성하고 트리의 루트에서 경로에 있는 노드들도 새로 생성해야 한다. 

```java 
public static Tree fupdate(String k, int newval, Tree t) {
    return (t == null) ?
        new Tree(k, newval, null, null) :
            k.equals(t.key) ? new Tree(k, newval, t.left, t.right) :
                k.compareTo(t.key) < 0 ? 
                    new Tree(t.key, t.val, fupdate(k, newval, t.left), t.right) :
                    new Tree(t.key, t.val, t.left, fupdate(k, newval, t.right)));                
}
```

인수를 이용해서 가능한 한 많은 정보를 공유하고 새로운 노드를 만들었다.  
기존 구조를 변화시키지 않기 때문에 공통 부분을 공유할 수 있다는 점에서 다른 구조체와 조금 다르다.  


<br/>

## 19.3 스트림과 게으른 평가

스트림은 한 번만 소비할 수 있는 재약이 있어서 재귀적으로 정의해야 한다.  
이러한 제약 때문에 발생되는 문제에 대해 알아본다. 

### 자기 정의 스트림 

소수를 생성하는 재귀 스트림을 살펴본다.  
소수로 나눌 수 있는 수를 제외하는 과정을 다음 알고리즘으로 구현해본다.  

1. 소수를 선택할 숫자 스트림 필요
2. 스트림에서 첫번째 소수를 가져온다. (처음은 2)
3. 스트림의 꼬리에서 가져온 수로 나누어 떨어지는 모든 수를 제외
4. 남은 숫자만 포함하는 새로운 스트림에서 소수를 찾기 (반복)

#### 1단계 스트림 숫자 얻기

```java 
static Intstream numbers() {
    return IntStream.iterate(2, n -> n + 1);
}
```

#### 2단계 머리 획득

```java 
static int head(IntStream numbers) {
    return numbers.findFirst().getAsInt();
}
```

#### 3단계 꼬리 필터링

```java 
static IntStream tail(IntStream numbers) {
    return numbers.skip(1);
}
```

#### 4단계 재귀적으로 소수 스트림 생성

```java 
static IntStream primes(IntStream numbers) {
    int head = head(numbers);
    return IntStream.concat(
        IntStream.of(head),
        primes(tail(numbers).filter(n -> n % head != 0))
    );
}
```

하지만 위 코드는 최종연산 `findFirst`, `skip` 을 사용했기 때문에 
`stream has already been operated upon or closed.` 라는 에러가 발생된다.  

또한, 두번째 인수가 `primes`를 재귀적으로 호출하기 때문에 무한 재귀에 빠진다.  
이러한 문제는 두 번째 인수에서 `primes`를 게으른 평가를 통해 해결할 수 있다.  


### 게으른 리스트 만들기 

스트림은 최종연산(`filter`, `map`, `reduce` 등)을 적용해서 계산을 해야 하는 상황에서만 연산이 이루어진다.  
게으른 특성 때문에 연산별로 스트림을 탐색할 필요 없이 한 번에 처리할 수 있다.  

#### 기본적인 연결 리스트

기본적인 리스트는 메모리에 존재한다. 

```java 
interface MyList<T> {
    T head();
    MyList<T> tail();
    default boolean isEmpty() {
        return true;
    }
}

class MyLinkedList<T> implements MyList<T> {
    private final T head;
    private final MyList<T> tail;
    public MyLinkedList(T head, MyList<T> tail) {
        this.head = head;
        this.tail = tail;
    }
    public T head() {
        return head;
    }
    public MyList<T> tail() {
        return tail;
    }
    public boolean isEmpty() {
        return false;
    }
}
class Empty<T> implements MyList<T> {
    public T head() {
        throw new UnsupportedOperationException();
    }
    public MyList<T> tail() {
        throw new UnsupportedOperationException();
    }
}

MyList<Integer> l = new MyLinkedList<>(5, new MyLinkedList<>(10, new Empty()));
```

#### 기본적인 게으른 리스트 

`Supplier<T>` 를 이용하여 게으른 리스트를 만들면 메모리에 존재하지 않게 할 수 있다.  

```java 
class LazyList<T> implements MyList<T> {
    final T head;
    final Supplier<MyList<T>> tail;
    public LazyList(T head, Supplier<MyList<T>> tail) {
        this.head = head;
        this.tail = tail;
    }
    public T head() {
        return head;
    }
    public MyList<T> tail() {
        return tail.get();
    }
    public boolean isEmpty() {
        return false;
    }
    public MyList<T> filter(Predicate<T> p) {
        return isEmpty() ? 
            this :
            p.test(head()) ?
                new LazyList<>(head(), () -> tail().filter(p)) :
                tail().filter(p); 
    }
}

public static LazyList<Integer> from(int n) {
    return new LazyList<Integer>(n, () -> from(n+1));
}
```


#### 게으른 소수 리스트 생성

```java 
public static MyList<Integer> primes(MyList<Integer> numbers) {
    return new LazyList<> (
        numbers.head(),
        () -> primes(
            numbers.tail()
                   .filter(n -> n % numbers.head() != 0)
        )
    );
}
```

