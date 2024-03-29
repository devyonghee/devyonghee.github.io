---
title: '[Modern Java in Action] Chapter15. CompletableFuture 와 리액티브 프로그래밍 컨셉의 기초'
tags: [book, moder java in action]
categories: book
---

모던 자바 인 액션 15장에서는 동시성 API 에 대해 소개하고 있다.   
CompletableFuture 와 리팩티브 프로그래밍에 대해 자세히 알아본다. 

<!--more-->

소프트웨어 개발 방법을 뒤집는 추세 2가지  

1. 멀티코어 프로세서 발전 
   - 멀티 코어 프로세서 활용하면서 애플리케이션 속도 개선 
2. 인터넷 서비스를 이용하는 애플리케이션 증가
   - 거대한 애플리케이션 대신 작은 애플리케이션 서비스로 나눔

이러한 추세로 서비스간의 상호 작용이 많아지면서 응답을 기다리는 동안 연산이 블록 되거나 CPU 클록 사이클 자원이 낭비된다.   
그래서 자바에서는 연산 자원 낭비를 피하기 위해 다음 두 가지를 제공한다. 

1. `CompletableFuture` (자바 8 추가) 
   - `Future` 인터페이스의 구현체
2. 플로 API (자바 9 추가) 
   - 리액티브 프로그래밍 개념 

<br/>

## 15.1 동시성을 구현하는 자바 지원의 진화

멀티코어 CPU 에서 효과적으로 프래그래밍 가능성이 커지면서 동시성 지원이 제공되기 시작하였다.

- 자바 5
  - `ExecutorService` 인터페이스 제공 (`ExecutorServices`는 `Runnable`, `Callable` 둘 다 실행 가능)
  - `Callable<T>`, `Future<T>`, 제네릭 등 제공
- 자바 7
  - `java.util.concurrent.RecursiveTask` 추가 (분할 정복 알고리즘의 포크/조인 구현 지원)
- 자바 8
  - 스트림과 람다 지원에 기반한 병렬 프로세싱
  - `Future`를 조합하는 기능인 `CompletableFuture` 추가
- 자바 9
  - 리액티브 프로그래밍인 발행-구독 프로토콜(`java.util.concurrent.Flow`) 지원 (명시적인 비동기 프로그래밍) 

### 스레드와 높은 수준의 추상화

멀티코어 환경을 효율적으로 다루기 위해서는 스레드의 도움이 필요하다.  
하지만 일반적인 외부 반복처리로 스레드를 다루면 성가시고 에러가 발생하기 쉽다.  
반대로 병렬 스트림 반복(내부 반복)을 이용하면 병렬성을 쉽게 달성할 수 있다.  

이렇듯 스트림과 같이 `RecursiveTask`, `ExecutorService` 를 이용하면 복잡성도 줄어들고 효율적으로 활용할 수 있다.  

### Executor와 스레드 풀

#### 스레드의 문제 

- 운영체제 스레드에 직접 접근하기 때문에 비용이 비쌈
- 운영체제 스레드가 제한적임
  - 스레드 수를 초과하면 예상치 못한 방식으로 크래시 될 수 있음

위와 같은 문제로 다양한 기기에서 실행할 수 있는 프로그램이라면 하드웨어 스레드 개수를 추측하지 않는 것이 좋다.  

#### 스레드 풀 그리고 스레드 풀이 더 좋은 이유

자바 `ExecutorService` 는 태스크를 제출하고 결과를 수집할 수 있는 인터페이스를 제공한다.  
다음 팩토리 메서드를 통해 스레드 풀을 만들 수 있다.  
이 메서드는 워커 스레드라 불리는 `ExecutorService`를 만들고 스레드 풀에 저장한다.  
먼저 온 순서대로 태스크를 먼저 실행하고 종료되면 스레드를 풀로 반환한다.

```java 
ExecutorService newFixedThreadPool(int nThreads)
```

이 방식을 이용하면 다음과 같은 장점들이 존재한다. 
- 하드웨어에 맞는 수의 태스크 유지
- 수 천개의 태스크를 오버헤드 없이 처리 가능
- 큐의 크기 조정, 거부 정책, 태스크 종류에 따른 우선 순위 조정 등 다양한 설정

#### 스레드 풀 그리고 스레드 풀이 나쁜 이유

스레드 풀을 사용할 때는 다음과 같은 사항들을 주의해야 한다. 

- k 스레드를 가진 스레드 풀은 오직 k 만큼만 동시 실행 가능 (초과로 제출된 태스크는 큐에 저장)
  - 잠을 자거나, I/O 대기, 네트워크 연결을 기다리면 워커 스레드가 아무 작업을 안함
  - 블록할 수 있는 태스크는 스레드 풀에 제줄하지 않는 것이 좋음
- 프로그램을 종료하기 전에 모든 스레드 풀을 종료 해야함
  - 다른 태스크 제출을 기다리면서 종료되지 않은 상태일 수 있음

### 스레드의 다른 추상화: 중첩되지 않은 메서드 호출

[7장(병렬 스트림 처리와 포크/조인 프레임)](https://devyonghee.github.io/book/2022/06/26/modern-java-in-action-chapter7/)에서 
소개한 동시성은 메서드 호출안에서 시작되면 작업이 끝나기만을 기다렸다. (엄격한 포크/조인)  
내부 호출이 아닌 외부 호출에서 종료하도록 하는 여유로운 방식도 비교적 안전하다.  

15장에서는 스레드가 생성되고 메서드를 벗어나 계속 실행되는 비동기 메서드에 대해 소개한다. 
그러나 비동기 메서드는 다음과 같은 위험성이 존재한다. 
- 스레드 실행은 다음의 코드와 동시에 실행되므로 데이터 경쟁 문제가 일어나지 않도록 주의
- 실행중인 스레드가 종료되지 않고 `main()` 메서드 반환되는 경우 다음과 같은 방법들이 존재하지만 안전하지 않음 
  - 애플리케이션이 종료되지 않고 모든 스레드가 실행이 끝날 때가지 대기
    - 종료 못한 스레드 때문에 애플리케이션이 크래스될 수 있음
  - 종료되지 않은 스레드를 강제종료
    - 작업이 중단되면서 데이터 일관성 파괴 가능

자바 스레드는 `setDaemon()`으로 데몬과 비데몬으로 구분 가능하다.  
- 데몬
  - 애플리케이션이 종료될 때 강제 종료됨 (데이터 일관성을 파괴하지 않는 동작을 수행할 때 유용)
- 비데몬
  - `main()` 메서드가 모든 비데몬 스레드가 종료될 때까지 기다림


<br/>

## 15.2 동기 API 와 비동기 API

[7장(병렬 스트림 처리와 포크/조인 프레임)](https://devyonghee.github.io/book/2022/06/26/modern-java-in-action-chapter7/)에서는 
자바 8 스트림의 `parallel()` 메서드로 복잡한 스레드 작업없이 병렬 처리가 가능했다.
하지만 루프 기반 이외에 별도의 스레드로 병렬성을 사용한다면 다음과 같이 코드가 복잡해진다.

```java 
int x = 1337;
Result result = new Result();

Thread t1 = new Thread(() -> {result.left = f(x);});
Thread t2 = new Thread(() -> {result.right = g(x);});

t1.start();
t2.start();
t1.join();
t2.join();
System.out.println(result.left + result.right);
```

`ExecutorService` 로 스레드 풀을 설정한다면 코드는 다음처럼 변경된다.  
하지만 이 코드 역시 `submit` 메서드 호출같이 불필요한 코드가 발생된다.  

```java 
int x = 1337;
ExecutorService executorService = Executors.newFixedThreadPool(2);
Future<Integer> y = executorService.submit(() -> f(x));
Future<Integer> z = executorService.submit(() -> g(x));
System.out.println(y.get() + z.get());
executorService.shutdown();
```

위와 같은 문제는 다음 두가지 비동기 API 로 해결이 가능하다.

- `CompletableFuture`(자바 8)
- `java.util.concurrent.Flow`(자바 9)

### Future 형식 API

`Future` 을 사용하면 코드는 다음과 같이 변경된다.

```java 
Future<Integer> f(int x);
Future<Integer> g(int x);

Future<Integer> y = f(x);
Future<Integer> z = g(x);
System.out.println(y.get() + z.get());
```

### 리액티브 형식 API

인수로 람다를 전달해서 결과를 반환하는 것이 아니라 결과가 준비되면 이를 람다로 호출하는 태스크를 만든다.  

```java 
int x = 1337;
Result result = new Result();

f(x, (int y) -> {
    result.left = y;
    System.out.println(result.left + result.right);
});

g(x, (int z) -> {
    result.right = z;
    System.out.println(result.left + result.right);
});
```

하지만 이러한 방식은 락을 사용하지 않아 값을 두번 출력할 수 있고 두 피연산자가 `println` 이 호출 되기전에 업데이트 될 수도 있다.   
이러한 문제는 다음 두 가지 방법으로 보완할 수 있다.

- if-then-else 를 이용해 적절한 락을 이용해 두 콜백이 호출되었는지 확인하고 `println` 호출
- 리액티브 형식의 API 는 일련의 이벤트에 반응하도록 설계되었으므로, 한 결과가 필요하면 `Future` 이용하는 것이 적절


### 잠자기(그리고 기타 블로킹 동작)는 해로운 것으로 간주

어떤 일이 일정 속도로 제한되어 일어나는 상황을 만들 때 `sleep()` 메서드를 사용할 수 있다.  
하지만 이렇게 잠자는 스레드는 시스템 자원을 점유하게 되기 때문에 문제가 심각해진다.  
잠자는 스레드뿐만 아니라 블록 동작도 동일하다.

블록 동작은 다음 두가지로 구분될 수 있다.
- 다른 태스크가 동작 완료하기를 기다리는 동작
  - ex) `Future`에 `get()` 호출
- 외부 상호작용을 기다리는 동작
  - ex) 데이터베이스 읽기, 키보드 입력

다음 두 코드를 비교해본다. 
```java 
// 코드 A
work1();
Thread.sleep(10000);
work2();

// 코드 B
ScheduledExecutorService scheduledExecutorService = Executors.newScheduledThreadPool(1); 
work(1);
// work1() 이 끝난 다음 10초 뒤에 work2() 를 개별 태스크로 스케줄함
scheduledExecutorService.schedule(Example::work2, 10, TimeUnit.SECONDS);
scheduledExecutorService.shutdown();
```

코드 A와 B 는 같은 동작을 수행하지만 A는 자는 동안 스레드 자원을 점유하는 반면 B 는 다른 작업이 실행될 수 있도록 허용한다.  
그렇기 때문에 코드 B 가 더 좋다. 


### 현실성 확인

동시 실행되는 태스크로 설계해서 블록할 수 있는 모든 동작을 비동기 호출로 구현한다면 하드웨어를 최대한 활용할 수 있다.  
하지만 현실적으로 `모든 것은 비동기`라는 설계 원칙을 어겨야 한다.  
유익을 얻을 수 있는 상황을 찾아보고 개선된 API 를 사용해는 것을 권장한다.  

### 비동기 API 에서 예외는 어떻게 처리하는가?


- `CompleteFuture`
  - 예외에서 회복할 수 있도록 `exceptionally()` 같은 메서드 제공
- 리액티브 형식의 비동기 API
  - 예외가 발생했을 때 실행할 콜백을 만들어 인터페이스 변경
  ```java 
  void f(int x, Consumer<Integer> dealWithResult, Consumer<Throwable> dealWithException);
  ```
- 자바 9 플로 API
  - 여러 콜백을 한 객체로 감싼다.
  ```java 
  void onComplete()  // 값을 다 소진하거나 에러가 발생해서 더 이상 처리할 데이터가 없을 때
  void onError(Throwable throwable)  // 도중에 에러가 발생했을 때
  void onNext(T item) // 값이 있을 때
  // 코드는 다음과 같이 변경
  void f(int x, Subscriber<Integer> s);
  s.onError(t);
  ```  

<br/>

## 15.3 박스와 채널 모델

{% include image.html alt="간단한 박스와 채널 다이어그램" source_txt='모던 자바 인 액션' path="images/book/modern-java-in-action/simple-box-channel-model.png" %}

```java 
int t = p(x);
Future<Integer> a1 = executorService.submit(() -> q1(t));
Future<Integer> a2 = executorService.submit(() -> q2(t));
System.out.println(r(a1.get(), a2.get()));
```

박스와 채널 모델은 동시성 모델을 잘설계하고 개념화한 그림이다.  
박스와 채널 모델을 이용하면 생각과 코드를 구조화하여 대규모 시스템 구현의 추상화 수준을 높일 수 있다.  
박스로 원하는 연산을 표현하면 손으로 코딩한 결과보다 더 효율적일 것이다.  

위 모든 함수를 `Future` 로 감싸면 병렬성을 극대화할 수 있다.  
하지만 시스템이 커지고 많은 박스와 채널 다이어그램이 등장하게 된다면 태스크가 `get()` 메서드를 호출하여 기다리는 상태가 될 수 있다.  
결국 병렬성을 제대로 활용하지 못하거나 데드락에 걸릴 수 있는데, 
이러한 문제는 자바 8 의 `CompletableFure` 와 콤비네이터(combinators)를 이용하여 해결한다.

<br/>

## 15.4 CompletableFuture 와 콤비네이터를 이용한 동시성

자바 8에서는 `Future` 인터페이스의 구현체인 `CompletableFuture`를 이용해 `Future` 를 조합할 수 있게 되었다.    
`CompletableFuture` 는 다음과 같은 이유로 `Completable` 단어가 사용되었다.    

- 실행 코드 없이 `Future` 생성 허용
- `complete()` 메서드로 다른 스레드가 이를 완료 가능
- `get()`으로 값을 얻을 수 있음   

`CompletableFuture<T>` 의 `thenCombine` 메서드를 사용하면 동작 조합이 가능하다.   
이 동작 조합을 이용하면 다른 프로레싱을 기다리는 자원 낭비 문제를 해결할 수 있다.  

```java 
CompletableFuture<V> thenCombine(CompletableFuture<U> other, BiFunction<T, U, V> fn)
// 예시 사용 코드
ExecutorService executorService = Executors.newFixedThreadPool(10);
int x = 1337;

CompletableFuture<Integer> a = new CompletableFuture<>();
CompletableFuture<Integer> b = new CompletableFuture<>();
CompletableFuture<Integer> c = a.thenCombine(b, (y, z) -> y + z);
executorService.submit(() -> a.complete(f(x)));
executorService.submit(() -> b.complete(g(x)));

System.out.println(c.get());
executorService.shutdown();
```

이처럼 `thenCombine` 을 이용하면 `f(x)`, `g(x)` 이 끝나야 덧셈 계산이 실행된다. 


<br/>

## 15.5 발행-구독 그리고 리액티브 프로그래밍

`Future` 는 한 번만 실행하여 결과를 제공한다.    
하지만 리액티브 프로그래밍은 시간이 흐르면서 여러 결과를 제공한다. (ex. HTTP 요청을 기다리는 리스너 객체)  
자바 9에서는 `java.util.concurrent.Flow` 의 인터페이스에 발행-구독 모델을 적용해 리액티브 프로그래밍을 제공한다.  
Flow API 는 다음 세가지로 정리할 수 있다. 

- 구독자가 구독할 수 있는 발행자
- 이 연결을 구독(subscription)이라 한다. 
- 이 연결을 이용해 메시지(또는 이벤트)를 전송

### 두 플로를 합치는 예제

이벤트가 발생했을 때 다른 곳에서 구독할 수 있도록 `Publisher<T>` 인터페이스를 정의한다.  
이 인터페이스의 인수에는 통신할 구독자를 받는다. 

```java 
interface Publisher<T> {
    void subscribe(Subscriber<? super T> subscriber);
}
```

이제 정보를 전달할 수 있도록 `Subscriber<T>` 인터페이스를 정의한다.  
구현자가 필요한대로 이 메서드를 구현할 수 있다. 

```java 
interface Subscriber<T> {
    void onNext(T t);
}
```

이 두 개념을 합쳐서 이벤트를 구독하면서 반응할 수 있는 `Cell` 을 구현한다.

```java 
private class SimpleCell implements Publisher<Integer>, Subscriber<Integer> {
    private int value = 0;
    private String name; 
    private List<Subscriber> subsribers = new ArrayList<>();
    
    public SimpleCell(String name) {
        this.name = name;
    }
    
    @Override
    public void subscribe(Subscriber<? super Integer> subscriber) {
        subscribers.add(subscriber);
    }
    @Override
    public void onNext(Integer newValue) {
        // 구독한 셀에 새 값이 생겼을 때 값을 갱신
        this.value = newValue;
        System.out.println(this.name + ":" + this.value);
        notifyAllSubscribers();  // 값 갱신을 알림
    }
    private void notifyAllSubscribers() {
        // 새 값이 있다고 구독자들에게 알림
        subscribers.forEach(subscriber -> subsriber.onNext(this.value));
    }        
}
// 사용예시
SimpleCell c3 = new SimpleCell("C3");
SimpleCell c2 = new SimpleCell("C2");
SimplcCell c1 = new SimpleCell("C1");

c1.subsribe(c3);

c1.onNext(10); // C1:10, C3:10
c2.onNext(20); // C2:20
```

`C3=C1+C2` 연산을 할 수 있는 클래스를 구현해본다. 

```java 
public class ArithmeticCell extends SimpleCell {
    private int left;
    private int right;
    
    public ArithmeticCell(String name) {
        super(name);
    }
    
    public void setLeft(int left) {
        this.left = left;
        onNext(left + this.right);
    }
    
    public void setRight(int right) {
        this.right = right;
        onNext(right + this.left);
    }
}
// 사용예시
ArithmeticCell c3 = new ArithmeticCell("C3");
SimpleCell c2 = new SimpleCell("C2");
SimpleCell c1 = new SimpleCell("C1");

c1.subscribe(c3::setLeft);
c2.subscribe(c3::setRight);

c1.onNext(10);  // C1:10, C3:10
c2.onNext(20);  // C2:20, C3:30
c1.onNext(15);  // C1:15, C3:25
```

자바 9 `Flow` Api의 `Subscriber` 에서는 `onNext` 이벤트 외에도    
데이터 흐름에서 예외가 발생하거나 종료되었을 때를 위해 `onError` 와 `onComplete` 를 지원한다.

간단하지만 `Flow` 인터페이스를 복잡하게 만든 두가지 기능은 압력과 역압력이다.  
스레드 활용하기 위해서는 이 기능들은 필수다.

매우 빠른 속도로 이벤트가 발생하여 매초마다 수천 개의 메시지가 `onNext` 로 전달되는 상황을 압력이라고 한다.  
이런 상황에서는 출구로 추가될 이벤트를 제한하는 역압력 기능이 필요하다.  

### 역압력

정보의 흐름 속도를 역압력으로 제어(`Subscriber` -> `Publisher` 정보 요청)할 필요가 있을 수 있다.  
그래서 자바 9 Flow API 의 `Subcrier` 인터페이스는 다음 메서드를 포함한다.

```java 
void onSubscribe(Subscription subscription);

interface Subscription {
    void cancel();
    void request(long n);
}
```

`Publisher` 는 `Subscription` 객체를 만들어 `Subscriber` 에 전달하면,  
`Subscriber` 는 이를 이용해 `Publisher` 에 정보를 보낼 수 있다.  

### 실제 역압력의 간단한 형태

한 번에 한 개의 이벤트를 처리하도록 발행-구독 연결을 구성하려면 다음과 같은 작업이 필요하다.

- `Subscriber` 가 `onSubscribe`로 전달된 `Subscription` 객체를 `subscription` 같은 필드에 저장
- `Subscriber` 가 수많은 이벤트를 받지 않도록 `onSubscribe`, `onNext`, `onError` 의 마지막 동작에 `channel.request(1)` 을 추가해 한 이벤트만 요청
- 요청을 보낸 채널에만 `onNext`, `onError` 이벤트를 보내도록 `Publisher` 의 `notifyAllSubscribers` 코드 변경


<br/>

## 15.6 리액티브 시스템 vs 리액티브 프로그래밍

리액티브 시스템은 런타임 환경이 변화에 대응하도록 아키텍처가 설계된 프로그램이다.  
리액티브 시스템에는 다음과 같이 3가지 속성이 존재한다.

- 반응성(responsive): 응답을 지연하지 않고 실시간으로 입력에 반응 
- 회복성(resilient): 한 컴포넌트의 실패로 전체 시스템이 실패하지 않음
- 탄력성(elastic): 작업 부하에 맞게 적응하며 작업을 효율적으로 처리함

여러가지 방법이 있지만 `Flow` 인터페이스에서 제공하는 리액티브 프로그래밍 형식을 이용하면 이 속성을 구현할 수 있다.

