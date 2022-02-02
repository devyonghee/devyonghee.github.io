---
title: 이펙티브 자바 Chapter11. 동시성
tags: [book, effective-java]
categories: book
---


이펙티브 자바 11장에서는 동시성 프로그램을  
명확하고 정확하게 만들고 문서화하는 방법에 대해 소개한다.

<!--more-->

<br/>

## 아이템 78. 공유 중인 가변 데이터는 동기화해 사용하라

- **동기화**는 스레드 사이의 **안정적인 통신**에 필요
  - 동기화에 실패하면 처참한 결과를 초래 (ex. 응답 불가 상태)
  - `Thread.stop()` 사용금지
    - **폴링**하면서 값이 변경되면 멈추도록 하는 것이 안전
  - **동기화**(`synchronized`) 메소드로 데이터 접근해서 사용 (쓰기와 읽기 모두 동기화 필요) 
  - `volatile` 선언한 필드를 이용하면 동기화 생략 가능
    - **증가 연산자**(`++`)의 경우, **안전 실패(safety failure)** 오류 발생, 동기화가 필요
    - 참고. `AtomicLong`
- 가급적 **가변 데이터**는 **단일 스레드**에서만 사용
  - **불변 데이터**만 공유
  - **프레임워크**와 **라이브러리**에 대해 깊이 이해할 필요가 있음

<br/>

## 아이템 79. 과도한 동기화는 피하라

- 메서드나 동기화 블럭 안에서 제어를 클라이언트에게 **양도하면 안됨**
  - 과도한 동기화는 **성능 저하**, **교착 상태**에 빠뜨릴 수 있음
  - **재정의**할 수 있는 **메소드 호출 금지**
  - 클라이언트가 넘겨준 **함수 객체 호출 금지**
- 동기화 영역에서는 가능한 한 **최소한**의 일만 정의
  - 락 걸기, 공유 데이터 검사, 수정, 락 풀기 이외 오래걸리는 작업은 **동기화 영역 바깥**으로 옮겨야 함

```java 
private void notifyElementAdded(E element) {
    synchronized(observers) {
        for (SetObserver<E> observer : oberservers) {
           // 재정의 할 수 있는 객체의 메소드를 호출하면서 예외, 교착 문제가 발생될 수 있다.
           observer.added(this, element);
        }  
    }
}
```

외계인 메소드를 **동기화 블록 바깥**으로 옮기면 됨

```java 
private void notifyElementAdded(E element) {
    List<SetObserver<E>> snapshot = null;
    synchronized(observers) {
        snapshot = new ArrayList<>(observers);
    }
    for (SetObserver<E> observer : snapshot) {
        observer.added(this, element);
    }
}
```
  
### 가변 클래스 작성 방법 2가지
1. 동기화 전혀하지 말고 사용해야하는 클래스가 **외부**에서 동기화
   - ex. `java.util`
2. 동기화를 **내부**에서 수행해 스레드 안전한 클래스
   - 외부에서 객체 전체 락을 거는 것보다 동시성을 월등히 개선할 수 있다면 선택
   - **락 분할**, **락 스트라이핑**, **비차단 동시성 제어** 등의 기법을 동원해 동시성 향상 가능
   - ex. `java.util.concurrent`

<br/>

## 아이템 80. 스레드보다는 실행자, 태스크, 스트림을 애용하라

> 태스크 : 작업 단위를 나타내는 추상 개념  
> 실행자 서비스 : 태스크를 수행하는 일반적인 매커니즘  

스레드는 안전 실패나 응답 불가 처리를 위한 코드가 필요
스레드는 작업 단위와 수행 메커니즘 역할을 모두 수행, 실행자 프레임원크에서는 두 역할이 분리


```java
ExecutorService exec = Executors.newSingleThreadExecutor();
exec.execute(runnable);
```

### 실행자 
- `ThreadPoolExecutor`
  - 평범하지 않은 실행자 원하는 경우 사용
  - 스레드 풀 동작을 결정하는 거의 모든 속성 설정 가능
- `Executors.newCachedThreadPool`
  - 작은 프로그램이나 가벼운 서버
  - 특별히 설정할게 없고 일반적인 용도
- `Executors.newFixedThreadPool`
  - 무거운 프로덕션 서버의 경우 사용

### 태스크
- `Runnable`
- `Callable`(값을 반환하고 임의의 예외를 던질 수 있음)

<br/>

## 아이템 81. `wait`와 `notify` 보다는 동시성 유틸리티를 애용하라
새로운 코드에서 `wait`와 `notify`를 사용할 이유가 거의 없음  
`wait`와 `notify`는 사용이 까다로우니 고수준 동시성 유틸리티 사용하라 (ex. `java.util.concurrent`)
- 실행자 프레임워크 (아이템 80 참고)
- 동시성 컬렉션(concurrent collection)
- 동기화 장치 (synchronizer)

### 동시성 컬렉션
- `List`, `Queue`, `Map` 같은 표준 컬렉션 인터페이스에 동시성을 가미한 고성능 컬렉션  
- 동시성 무력화는 불가능, 외부에 락을 추가하면 오히려 속도 저하  
- `Collections.synchronizedMap` 보다 `ConcurrentHashMap` 사용이 성능상 훨씬 좋음

### 동기화 장치
- 스레드가 다른 스레드를 기다릴 수 있게하여 서로 작업을 조율할 수 있게 해줌
- 보통 `CountDownLatch` 와 `Semaphore` 을 주요 사용 (`CyclicBarrier`와 `Exchanger`는 비교적 덜 사용)
  - `CountDownLatch` 는 일회성 장벽으로, 하나 이상의 스레드가 다른 스레드들의 작업이 끝날때까지 기다리게 함
  - 시간 간격을 잴 때는 항상 `System.currentTimeMillis` 보다 `System.nanoTime` 사용 (정확, 정밀, 시간 보정 영향 없음)

### `wait`와 `notify` 사용해야 하는 경우
- `wait` 메서드는 스레드가 어떤 조건이 충족되기를 기다리게 할 때 사용  
- `wait` 는 반드시 **대기 반복문 (wait loop)** 관용구를 사용, 반복문 밖에서 호출 금지  
- `notify` 메서드를 먼저 호출한 후 대기 상태로 빠지면, 스레드를 다시 깨울 수 있다고 보장되지 않음
- 일반적으로 `notify` 보다는 `notifyAll` 사용 권장, `notify`를 사용한다면 응답 불가 상태에 빠지지 않는지 주의

```java 
synchronized (obj) {
    while (<조건이 충족되지 않음>) {
        obj.wait(); // (락을 놓고, 깨어나면 다시 잡기)
    }
    ... // 조건이 충족되면 동작 수행
}
```

<br/>

## 아이템 82. 스레드 안정성 수준을 문서화하라

- `synchronized` 선언은 구현일 뿐 API 에 속하지 않음, 이 한정자로 스레드 안전을 신뢰하기는 어려움
- 클래스가 지원하는 스레드 안정성 수준을 명시해야 함
- 반환 타입만으로 알 수 없는 정적 팩터리라면 스레드 안전성 문서화

### 스레드 안정성이 높은 순
- 불변 (immutable)
  - 상수과 같아 외부 동기화 불필요. 
  - ex. `String`, `Long`, `BigInteger`
- 무조건적 스레드 안전 (unconditionally thread-safe)
  - 인스턴스는 수정될 수 있으나, 내부에서 충분히 동기화되어 외부 동기화 없이 사용해도 안전
  - ex. `AtomicLong`, `ConcurrentHashMap`
- 조건부 스레드 안전 (conditionally thread-safe)
  - 일부 메서드는 동시에 사용하려면 외부 동기화 필요
  - ex. `Collections.synchronized`
- 스레드 안전하지 않음 (not thread-safe)
  - 인스턴스는 수정될 수 있음. 동시에 사용하려면 외부 동기화 메커니즘으로 감싸야 함
  - ex. `ArrayList`, `HashMap`
- 스레드 적대적 (thread-hostile)
  - 외부 동기화로 감사도 멀티 스레드 환경에서 안전하지 않음
  - 일반적으로 정적 데이터를 동기화 없이 수정
  - `generateSerialNumber` 메서드에서 내부 동기화 생략한 경우 스레드 적대적

<br/>

## 아이템 83. 지연 초기화는 신중히 사용하라

> 지연 초기화(lazy initialization)  
> 필드의 초기화 시점을 그 값이 처음 필요할 때까지 늦추는 기법  
> 주로 최적화 용도로 사용

- **지연 초기화하는 필드**를 멀티스레드 환경에서 공유하면 반드시 **동기화**가 필요
- 대부분의 상황에서는 **일반적인 초기화**가 지연 초기화보다 좋음

### 지연 초기화 3가지 방법

- 지연 초기화가 초기 순환성을 깨뜨릴 것 같다면 `synchronized` 사용
```java
private FieldType field;

private synchronized FieldType getField() {
    if (field == null)
        field = computeFieldValue();
    return field; 
}
```

- **인스턴스 필드**의 지연 초기화가 필요하면 **이중검사(double-check)** 관용구 사용
  - 초기화된 이후 동기화하지 않으므로 `volatile` 선언
  - 정적 필드에도 적용할 순 있지만 지연 초기화 홀더 클래스 방식이 더 좋음
  - 반복해서 초기화 해도 상관 없다면 두번째 검사 생략 가능 (단일검사)
```java
private volatile FieldType field;

private FieldType getField() {
    FieldType result = field; // 필드를 딱 한번만 읽도록 보장하는 지역변수
    if (result != null)  // 첫 번째 검사
        return result;
        
    synchronized (this) {
        if (field == null)  // 두 번째 검사
            field = computeFieldValue();
        return field;
    }
}
```

- **정적 필드** 지연 초기화가 필요하면 **지연 초기화 홀더 클래스(lazy initialization holder class)** 관용구 사용
```java
private static class FieldHolder {
    static final FieldType field = computeFieldValue();
}
// 처음 호출되는 순간 FieldHolder 클래스 초기화
private static FieldType getField() { return FieldHolder.field; }
```


<br/>

## 아이템 84. 프로그램의 동작을 스레드 스케줄러에 기대지 말라

- 정확성이나 성능이 스레드 스케줄러에 따라 달라진다면 다른 플랫폼으로 이식이 어려움
  - 이식성이 좋으려면 실행 가능한 스레드의 수가 프로세서 수보다 적어야 함
  - 스레드 수를 적게 유지하려면 처리해야 할 작업이 없을 때 실행되선 안됨 (바쁜 대기 상태 금지)
- `Thread.yield`에 의존 금지
  - 이식성이 좋지 않고 오히려 느려질 수 있음
  - 테스트할 수단이 없음
- 스레드 우선 순위 조절에 의존 금지
  - 이식성이 떨어짐

