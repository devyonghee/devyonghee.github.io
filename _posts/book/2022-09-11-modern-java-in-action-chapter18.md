---
title: '[Modern Java in Action] Chapter18. 함수형 관점으로 생각하기'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 18장에서는 함수형 프로그래밍에 대해 소개한다.   
함수형 프로그래밍이 무엇인지 개념에 대해 자세히 살펴본다.  

<!--more-->

<br/>

## 18.1 시스템 구현과 유지보수

쉽게 유지보수하기 위해서는 클래스 계층으로 반영하는 것이 좋다.  
상호 의존성을 가리키는 결합성(coupling)과 어떤 관계를 갖는지 가리키는 응집성(cohesion)으로 구조를 평가할 수 있는데 
함수형 프로그래밍이 제공하는 부작용 없음(no side effect)과 불변성(immutability)이라는 개념이 도움을 준다. 


### 공유된 가변 데이터

여러 메서드에서 가변 데이터 구조를 읽고 갱신하면 변수는 예상하지 못한 값을 갖게 되어 유지보수가 어려워진다.  
그러므로 클래스, 객체의 상태를 바꾸지 않고 결과를 반환해야 한다. 
이러한 메서드를 순수(pure) 메서드 또는 부작용 없는(side effect free) 메서드라고 한다.  

다음은 부작용의 예다. 
- 자료구조를 고치거나 필드에 값을 할당
- 예외 발생
- 파일에 쓰기 등의 I/O 동작 수행

불변 객체를 이용하면 상태를 변경할 수 없으므로 스레드 안정성도 제공하고, 이러한 부작용도 없앨 수 있다.  

### 선언형 프로그래밍

구현하는 방식은 크게 두가지로 구분할 수 있다. 

- 객체지향 프로그래밍
  - '어떻게(how)' 집중하는 프로그래밍 형식
  - 컴퓨터의 저수준 언어와 비슷한 모습
  - 명령형 프로그래밍
  ```java 
  Transaction mostExpensive = transactions.get(0);
  if (mostExpensive == null) {
       throw new IllegalArgumentException("Empty list of transactions");
  }
  for (Transaction t: transactions.subList(1, transactions.size())) {
       if (t.getValue() > mostExpensive.getValue()) {
           mostExpensive = t;
       }
  }
  ```
- 선언형 프로그래밍
  - '무엇을(what)' 집중하는 방식
  - 질의문 구현방법은 라이브러리가 결정
  - 내부 반복(internal iteration)
  ```java 
  Optional<Transaction> mostExpensive = 
      transactions.stream()
                  .max(comparing(Transaction::getValue));
  ```
  
### 왜 함수형 프로그래밍인가?

- 함수형 프로그래밍은 선언형 프로그래밍을 따르는 방식
- 부작용 없는 계산 지향
- 더 쉽게 시스템을 구현하고 유지보수하는데 도움


<br/>

## 18.2 함수형 프로그래밍이란 무엇인가?

함수형 프로그래밍의 함수는 수학적인 함수와 같다.  
함수는 0개 이상의 인수를 가지며, 한 개 이상의 결과를 반환하고 부작용이 없어야 한다.  
특히, 인수가 같다면 항상 같은 결과가 반환된다.

함수 그리고 if-then-else 등의 수학적 표현만 사용하는 방식을 순수 함수형 프로그래밍  
시스템의 다른 부분에 영향을 미치지 않는다면 내부적으로 함수형이 아닌 기능을 사용해도 함수형 프로그래밍

### 함수형 자바

자바에서는 실제 부작용이 있지만 아무도 보지 못하게 함으로써 함수형을 달성할 수 있다.  
만약 진입할 때 필드의 값을 변경했다가 나올 때 돌려놓는다면 단일 스레드에서 이 메서드는 함수형이라 간주할 수 있다.  
하지만 다른 스레드에서 필드의 값을 읽거나 동시에 메서드를 호출하면 함수형이 아니다.

#### 함수형 조건
- 함수나 메서드는 지역 변수만을 변경
  - 참조하는 객체가 있다면 그 객체는 불변 객체여야 한다.
- 함수나 메서드가 어떤 예외도 일으키지 않아야 함
  - 치명적인 에러가 있을 때 처리되는 않는 예외를 발생시키는 것은 괜찮음
  - 예외를 사용하지 않고 함수형을 표현하려면 `Optional<T>` 사용
  - 다른 컴포넌트에 영향을 미치지 않도록 지역적으로만 예외를 사용하는 방법도 고려 가능
- 비함수형 동작을 감출 수 있는 상황에서만 부작용을 포함하는 라이브러리 함수 사용
  - 자료 구조의 변경을 호출자가 알 수 없도록 감추기
  - 부작용을 감추는 설명을 주석이나 마커 어노테이션(marker annotation)으로 메서드 정의 가능

### 참조 투명성

'부작용을 감춰야 한다'라는 제약은 참조 투명성(referential transparency) 개념으로 귀결된다. (같은 인수로 호출하면 같은 결과)   
참조 투명성은 같은 결과를 반환하기 때문에 기억화(memorization) 또는 캐싱(caching)이 가능하여 최적화 기능도 제공한다.

### 객체지향 프로그래밍과 함수형 프로그래밍

- 익스트림 객체지향 방식: 모든 것을 객체로 간주하고 객체의 필드를 갱신, 메서드 호출, 관련 객체를 갱신하는 방식
- 함수형 프로그래밍 형식: 참조적 투명성을 중시, 변화를 허용하지 않음

자바 프로그래머는 두가지 프로그래밍 형식을 혼한다.

### 함수형 실전 연습

함수형을 이해하기 위해 예제를 살펴본다.  
`List<Integer>` 가 주어졌을 때 서브집합의 멤버로 구성된 `List<List<Integer>>` 을 만드는 함수를 구현한다.

```java 
static List<List<Integer>> subsets(List<Integer> list) {
    if (list.isEmpty()) {
        List<List<Integer>> ans = new ArrayList<>();
        ans.add(Collections.emptyList());
        return ans;
    }
    Integer first = list.get(0);
    List<Integer> rest = list.subList(1, list.size());
    
    // 하나의 요소를 꺼내고 나머지 요소의 모든 서브집합을 찾아 전달
    List<List<Integer>> subans = subsets(rest);
    // subans 의 모든 리스트에 처음 꺼낸 요소를 앞에 추가해 생성 
    List<List<Integer>> subans2 = insertAll(first, subans);
    return concat(subans, subans2);
}

static List<List<Integer>> insertAll(Integer first, List<List<Integer>> lists) {
    List<List<Integer>> result = new ArrayList<>();
    for (List<Integer> list: lists) {
        // 리스트를 복사한 다음 복사한 리스트에 요소를 추가
        List<Integer> copyList = new ArrayList<>();
        copyList.add(first);
        copyList.addAll(list);
        result.add(copyList);
    }
    return result;
}

static List<List<Integer>> concat(List<List<Integer>> a,
                                  List<List<Integer>> b) {
    List<List<Integer>> r = new ArrayList<>(a);
    r.addAll(b);
    return r;
}
```

<br/>

## 18.3 재귀와 반복

for-each 문을 이용하면 함수형과 상충하는 부작용이 발생될 수 있다.  
그러나 반복을 이용하는 모든 프로그램은 재귀로 구현 가능하다.  
재귀를 이용하면 변화가 일어나지 않고 루프 단계마다 갱신되는 반복 변수를 제거할 수 있다.  

```java 
// for 문 사용
static int factorialIterative(int n) {
    int r = 1;
    for (int i = 1; i <= n; i++) {
        r *= i;
    }
    return r; 
}
// 재귀함수 사용 (StackOverflowError 발생 가능)
static long factorialRecursive(long n) {
    return n == 1 ? 1 : n * factorialRecursive(n-1);
}
// 꼬리 호출 죄척화(tail-call optimization)
static long factorialRecursive(long n) {
    return factorialHelper(1, n);
}
static long factorialHelper(long acc, long n) {
    // 컴파일러나 하나의 스택 프레임을 재활용할 수 있음
    return n == 1 ? acc : factorialHelper(acc * n, n-1);
}
// 스트림 사용
static long factorialStreams(long n) {
    return LongStream.rangeClosed(1, n)
                     .reduce(1, (long a, long b) -> a * b);
}
```
